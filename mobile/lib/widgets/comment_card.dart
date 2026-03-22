import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../models/comment.dart';

class CommentCard extends StatefulWidget {
  final Comment comment;
  final VoidCallback onLike;
  final VoidCallback onDelete;
  final void Function(String content, String parentId) onReply;
  final void Function(String commentId)? onLikeById;
  final bool isReply;

  const CommentCard({
    super.key,
    required this.comment,
    required this.onLike,
    required this.onDelete,
    required this.onReply,
    this.onLikeById,
    this.isReply = false,
  });

  @override
  State<CommentCard> createState() => _CommentCardState();
}

class _CommentCardState extends State<CommentCard> {
  bool _showReplyField = false;
  final _replyController = TextEditingController();

  @override
  void dispose() {
    _replyController.dispose();
    super.dispose();
  }

  void _submitReply() {
    final text = _replyController.text.trim();
    if (text.isEmpty) return;
    widget.onReply(text, widget.comment.id);
    _replyController.clear();
    setState(() => _showReplyField = false);
  }

  @override
  Widget build(BuildContext context) {
    final comment = widget.comment;

    return Padding(
      padding: EdgeInsets.only(left: widget.isReply ? 32.0 : 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar
              CircleAvatar(
                radius: widget.isReply ? 14 : 18,
                backgroundColor: AppColors.mediumGray,
                child: Text(
                  comment.displayName[0].toUpperCase(),
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: widget.isReply ? 11 : 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name and time
                    Row(
                      children: [
                        Text(
                          comment.displayName,
                          style: AppTypography.bodySm.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.deepNavy,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          comment.timeAgoText,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.mediumGray,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    // Comment text
                    Text(
                      comment.content,
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.deepNavy,
                      ),
                    ),
                    const SizedBox(height: 6),
                    // Actions
                    Row(
                      children: [
                        // Like
                        GestureDetector(
                          onTap: widget.onLike,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.favorite_border_rounded,
                                size: 16,
                                color: AppColors.mediumGray,
                              ),
                              if (comment.likesCount > 0) ...[
                                const SizedBox(width: 3),
                                Text(
                                  '${comment.likesCount}',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.mediumGray,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        // Reply (only for top-level)
                        if (!widget.isReply) ...[
                          const SizedBox(width: 16),
                          GestureDetector(
                            onTap: () {
                              setState(() => _showReplyField = !_showReplyField);
                            },
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.reply_rounded,
                                  size: 16,
                                  color: AppColors.mediumGray,
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  'Jibu',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.mediumGray,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Reply input
          if (_showReplyField)
            Padding(
              padding: const EdgeInsets.only(left: 46, top: 8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _replyController,
                      maxLength: 500,
                      style: AppTypography.bodySm,
                      decoration: InputDecoration(
                        hintText: 'Andika jibu...',
                        hintStyle: AppTypography.bodySm.copyWith(
                          color: AppColors.mediumGray,
                        ),
                        counterText: '',
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: AppColors.lightGray),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: AppColors.lightGray),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide(color: AppColors.brandOrange),
                        ),
                        filled: true,
                        fillColor: AppColors.offWhite,
                      ),
                      onSubmitted: (_) => _submitReply(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _submitReply,
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.deepNavy,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.send_rounded,
                        size: 18,
                        color: AppColors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),

          // Nested replies
          if (comment.replies.isNotEmpty) ...[
            const SizedBox(height: 8),
            ...comment.replies.map(
              (reply) => Padding(
                padding: const EdgeInsets.only(top: 6),
                child: CommentCard(
                  comment: reply,
                  onLike: () => widget.onLikeById?.call(reply.id),
                  onDelete: widget.onDelete,
                  onReply: widget.onReply,
                  onLikeById: widget.onLikeById,
                  isReply: true,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
