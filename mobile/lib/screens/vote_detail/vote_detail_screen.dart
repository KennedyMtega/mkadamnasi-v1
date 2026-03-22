import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/votes_provider.dart';
import '../../widgets/mkd_loading.dart';
import '../../widgets/mkd_error_state.dart';

class VoteDetailScreen extends ConsumerStatefulWidget {
  final String voteId;

  const VoteDetailScreen({super.key, required this.voteId});

  @override
  ConsumerState<VoteDetailScreen> createState() => _VoteDetailScreenState();
}

class _VoteDetailScreenState extends ConsumerState<VoteDetailScreen> {
  String? _selectedOptionId;
  bool _isVoting = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(votesProvider.notifier).getVoteById(widget.voteId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(votesProvider);
    final vote = state.selectedVote ?? ref.read(votesProvider.notifier).voteById(widget.voteId);

    return Scaffold(
      backgroundColor: AppColors.offWhite,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.deepNavy),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded, color: AppColors.deepNavy),
            onPressed: () => _showShareSheet(context),
          ),
        ],
      ),
      body: vote == null
          ? state.isLoading
              ? const MkdLoading(message: 'Inapakia kura...')
              : MkdErrorState(message: 'Kura haijapatikana', onRetry: () => ref.read(votesProvider.notifier).getVoteById(widget.voteId))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category + anonymity
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.brandOrange.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          vote.category?.displayName ?? 'Jumla',
                          style: AppTypography.caption.copyWith(color: AppColors.brandOrange, fontWeight: FontWeight.w600),
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (vote.isAnonymous)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.lightGray, borderRadius: BorderRadius.circular(8)),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.visibility_off_rounded, size: 12, color: AppColors.mediumGray),
                              const SizedBox(width: 4),
                              Text('Siri', style: AppTypography.caption),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Title
                  Text(vote.title, style: AppTypography.h2),
                  const SizedBox(height: 8),

                  // Description
                  if (vote.description != null && vote.description!.isNotEmpty)
                    Text(vote.description!, style: AppTypography.bodyLg),
                  const SizedBox(height: 20),

                  // Options
                  ...vote.options.map((option) {
                    final isSelected = _selectedOptionId == option.id || vote.selectedOptionId == option.id;
                    final showResults = vote.hasVoted == true;

                    return GestureDetector(
                      onTap: vote.hasVoted == true || !vote.isActive
                          ? null
                          : () => setState(() => _selectedOptionId = option.id),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.brandOrange.withValues(alpha: 0.08) : AppColors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? AppColors.brandOrange : AppColors.lightGray,
                            width: isSelected ? 1.5 : 1,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(color: isSelected ? AppColors.brandOrange : AppColors.mediumGray, width: 2),
                                    color: isSelected ? AppColors.brandOrange : Colors.transparent,
                                  ),
                                  child: isSelected
                                      ? const Icon(Icons.check, size: 14, color: AppColors.white)
                                      : null,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    option.label,
                                    style: AppTypography.body.copyWith(
                                      color: AppColors.deepNavy,
                                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                                    ),
                                  ),
                                ),
                                if (showResults)
                                  Text(
                                    '${option.percentage.toStringAsFixed(1)}%',
                                    style: AppTypography.numberSm.copyWith(fontSize: 14, color: AppColors.brandOrange),
                                  ),
                              ],
                            ),
                            if (showResults) ...[
                              const SizedBox(height: 8),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: option.percentage / 100,
                                  backgroundColor: AppColors.lightGray,
                                  valueColor: AlwaysStoppedAnimation(
                                    isSelected ? AppColors.brandOrange : AppColors.mediumGray,
                                  ),
                                  minHeight: 6,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text('Kura ${option.voteCount}', style: AppTypography.caption),
                            ],
                          ],
                        ),
                      ),
                    );
                  }),

                  const SizedBox(height: 20),

                  // Stats
                  Row(
                    children: [
                      _StatChip(icon: Icons.how_to_vote_rounded, label: 'Kura ${vote.totalVotes}'),
                      const SizedBox(width: 12),
                      _StatChip(
                        icon: Icons.access_time_rounded,
                        label: vote.timeRemainingText,
                        color: vote.isActive ? AppColors.successGreen : AppColors.errorRed,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Cast vote button
                  if (vote.hasVoted != true && vote.isActive)
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _selectedOptionId == null || _isVoting
                            ? null
                            : () async {
                                setState(() => _isVoting = true);
                                await ref.read(votesProvider.notifier).castVote(vote.id, _selectedOptionId!);
                                if (mounted) setState(() => _isVoting = false);
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.brandOrange,
                          foregroundColor: AppColors.white,
                          disabledBackgroundColor: AppColors.lightGray,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: _isVoting
                            ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: AppColors.white, strokeWidth: 2))
                            : Text('Piga Kura', style: AppTypography.button.copyWith(color: AppColors.white)),
                      ),
                    ),

                  if (vote.hasVoted == true)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.successGreen.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.successGreen.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.check_circle_rounded, color: AppColors.successGreen, size: 20),
                          const SizedBox(width: 8),
                          Text('Umeshapiga kura', style: AppTypography.buttonSm.copyWith(color: AppColors.successGreen)),
                        ],
                      ),
                    ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
    );
  }

  void _showShareSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 40, height: 4, decoration: BoxDecoration(color: AppColors.lightGray, borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: 20),
              Text('Shiriki Kura', style: AppTypography.h3),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _ShareOption(icon: Icons.copy_rounded, label: 'Nakili', onTap: () => Navigator.pop(context)),
                  _ShareOption(icon: Icons.message_rounded, label: 'Ujumbe', onTap: () => Navigator.pop(context)),
                  _ShareOption(icon: Icons.share_rounded, label: 'Shiriki', onTap: () => Navigator.pop(context)),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _StatChip({required this.icon, required this.label, this.color = AppColors.mediumGray});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.lightGray)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 6),
          Text(label, style: AppTypography.bodySm.copyWith(color: color)),
        ],
      ),
    );
  }
}

class _ShareOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ShareOption({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(color: AppColors.offWhite, shape: BoxShape.circle),
            child: Icon(icon, color: AppColors.brandOrange, size: 24),
          ),
          const SizedBox(height: 8),
          Text(label, style: AppTypography.caption),
        ],
      ),
    );
  }
}
