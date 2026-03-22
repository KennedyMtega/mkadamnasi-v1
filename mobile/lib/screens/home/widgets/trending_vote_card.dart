import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../models/vote.dart';

class TrendingVoteCard extends StatelessWidget {
  final Vote vote;
  final VoidCallback? onTap;

  const TrendingVoteCard({super.key, required this.vote, this.onTap});

  @override
  Widget build(BuildContext context) {
    final categoryName = vote.category?.displayName ?? 'Jumla';

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 220,
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.lightGray),
          boxShadow: [
            BoxShadow(
              color: AppColors.deepNavy.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.brandOrange.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    categoryName,
                    style: AppTypography.caption.copyWith(
                      color: AppColors.brandOrange,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const Spacer(),
                _MiniBarChart(options: vote.options),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              vote.title,
              style: AppTypography.buttonSm.copyWith(color: AppColors.deepNavy),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                const Icon(Icons.how_to_vote_rounded, size: 14, color: AppColors.mediumGray),
                const SizedBox(width: 4),
                Text(
                  _formatCount(vote.totalVotes),
                  style: AppTypography.bodySm.copyWith(fontWeight: FontWeight.w600),
                ),
                const Spacer(),
                Icon(
                  Icons.access_time_rounded,
                  size: 12,
                  color: vote.isActive ? AppColors.successGreen : AppColors.mediumGray,
                ),
                const SizedBox(width: 3),
                Flexible(
                  child: Text(
                    vote.timeRemainingText,
                    style: AppTypography.caption,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatCount(int count) {
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}K';
    return count.toString();
  }
}

class _MiniBarChart extends StatelessWidget {
  final List<dynamic> options;

  const _MiniBarChart({required this.options});

  @override
  Widget build(BuildContext context) {
    final colors = [
      AppColors.brandOrange,
      AppColors.infoBlue,
      AppColors.successGreen,
      AppColors.warningYellow,
    ];

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: List.generate(
        options.length.clamp(0, 4),
        (i) => Container(
          width: 4,
          height: 6 + (options[i].percentage / 100 * 14),
          margin: const EdgeInsets.only(left: 2),
          decoration: BoxDecoration(
            color: colors[i % colors.length],
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ),
    );
  }
}
