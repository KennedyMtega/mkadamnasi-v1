import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../providers/comments_provider.dart';
import 'comment_card.dart';
import 'mkd_loading.dart';
import 'mkd_empty_state.dart';

class CommentSection extends ConsumerStatefulWidget {
  final String targetId;
  final String targetType; // 'vote' or 'rating'

  const CommentSection({
    super.key,
    required this.targetId,
    required this.targetType,
  });

  @override
  ConsumerState<CommentSection> createState() => _CommentSectionState();
}

class _CommentSectionState extends ConsumerState<CommentSection> {
  final _commentController = TextEditingController();
  bool _isSending = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  ({String targetId, String targetType}) get _params =>
      (targetId: widget.targetId, targetType: widget.targetType);

  Future<void> _submitComment() async {
    final text = _commentController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isSending = true);
    final success =
        await ref.read(commentsProvider(_params).notifier).addComment(text);
    if (success) {
      _commentController.clear();
    }
    if (mounted) setState(() => _isSending = false);
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(commentsProvider(_params));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),

        // Header
        Row(
          children: [
            const Icon(Icons.chat_bubble_outline_rounded,
                size: 20, color: AppColors.deepNavy),
            const SizedBox(width: 8),
            Text(
              'Maoni',
              style: AppTypography.h3.copyWith(color: AppColors.deepNavy),
            ),
            if (state.total > 0) ...[
              const SizedBox(width: 6),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.lightGray,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${state.total}',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.mediumGray,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 12),

        // Input field
        Container(
          decoration: BoxDecoration(
            color: AppColors.offWhite,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.lightGray),
          ),
          child: Column(
            children: [
              TextField(
                controller: _commentController,
                maxLength: 500,
                maxLines: 3,
                minLines: 1,
                style: AppTypography.bodySm,
                decoration: InputDecoration(
                  hintText: 'Andika maoni yako...',
                  hintStyle: AppTypography.bodySm.copyWith(
                    color: AppColors.mediumGray,
                  ),
                  counterText: '',
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 12,
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.only(left: 14, right: 8, bottom: 8),
                child: Row(
                  children: [
                    ValueListenableBuilder(
                      valueListenable: _commentController,
                      builder: (_, value, __) {
                        final count = value.text.length;
                        return Text(
                          '$count/500',
                          style: AppTypography.caption.copyWith(
                            color: count > 450
                                ? AppColors.errorRed
                                : AppColors.mediumGray,
                          ),
                        );
                      },
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: _isSending ? null : _submitComment,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.deepNavy,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: _isSending
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(
                                  color: AppColors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.send_rounded,
                                      size: 16, color: AppColors.white),
                                  const SizedBox(width: 6),
                                  Text(
                                    'Tuma',
                                    style: AppTypography.buttonSm.copyWith(
                                      color: AppColors.white,
                                    ),
                                  ),
                                ],
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Error
        if (state.error != null)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.errorRed.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              state.error!,
              style: AppTypography.bodySm.copyWith(color: AppColors.errorRed),
            ),
          ),

        // Loading
        if (state.isLoading)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 20),
            child: MkdLoading(message: 'Inapakia maoni...'),
          ),

        // Empty state
        if (!state.isLoading && state.comments.isEmpty)
          const MkdEmptyState(
            icon: Icons.chat_bubble_outline_rounded,
            title: 'Hakuna maoni bado',
            subtitle: 'Kuwa wa kwanza kutoa maoni!',
          ),

        // Comments list
        if (!state.isLoading && state.comments.isNotEmpty)
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: state.comments.length,
            separatorBuilder: (_, __) => const Divider(
              height: 20,
              color: AppColors.lightGray,
            ),
            itemBuilder: (context, index) {
              final comment = state.comments[index];
              return CommentCard(
                comment: comment,
                onLike: () {
                  ref
                      .read(commentsProvider(_params).notifier)
                      .likeComment(comment.id);
                },
                onLikeById: (commentId) {
                  ref
                      .read(commentsProvider(_params).notifier)
                      .likeComment(commentId);
                },
                onDelete: () {
                  ref
                      .read(commentsProvider(_params).notifier)
                      .deleteComment(comment.id);
                },
                onReply: (content, parentId) {
                  if (content.isNotEmpty) {
                    ref
                        .read(commentsProvider(_params).notifier)
                        .addComment(content, parentId: parentId);
                  }
                },
              );
            },
          ),

        // Load more
        if (state.hasMore && !state.isLoading)
          Center(
            child: Padding(
              padding: const EdgeInsets.only(top: 12),
              child: TextButton(
                onPressed: state.isLoadingMore
                    ? null
                    : () {
                        ref
                            .read(commentsProvider(_params).notifier)
                            .loadMore();
                      },
                child: state.isLoadingMore
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text(
                        'Pakia zaidi',
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.brandOrange,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ),
          ),

        const SizedBox(height: 20),
      ],
    );
  }
}
