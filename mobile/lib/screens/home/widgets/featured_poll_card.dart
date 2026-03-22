import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../models/vote.dart';

class FeaturedPollCard extends StatelessWidget {
  final Vote vote;
  final VoidCallback? onTap;

  const FeaturedPollCard({super.key, required this.vote, this.onTap});

  @override
  Widget build(BuildContext context) {
    final categoryName = vote.category?.displayName ?? 'Jumla';

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 300,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppColors.deepNavy.withValues(alpha: 0.08),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 120,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.brandOrange,
                    AppColors.brandOrange.withValues(alpha: 0.7),
                    AppColors.deepNavy.withValues(alpha: 0.8),
                  ],
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.white.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        categoryName,
                        style: AppTypography.caption.copyWith(
                          color: AppColors.brandOrange,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.deepNavy.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.how_to_vote_rounded, size: 12, color: AppColors.white),
                          const SizedBox(width: 4),
                          Text(
                            '${vote.totalVotes}',
                            style: AppTypography.caption.copyWith(color: AppColors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Center(
                    child: Icon(Icons.poll_rounded, size: 48, color: Colors.white38),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    vote.title,
                    style: AppTypography.h4,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.access_time_rounded,
                        size: 14,
                        color: vote.isActive ? AppColors.successGreen : AppColors.errorRed,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          vote.timeRemainingText,
                          style: AppTypography.bodySm.copyWith(
                            color: vote.isActive ? AppColors.successGreen : AppColors.errorRed,
                          ),
                        ),
                      ),
                      if (vote.isAnonymous)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.lightGray,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.visibility_off_rounded, size: 10, color: AppColors.mediumGray),
                              const SizedBox(width: 3),
                              Text('Siri', style: AppTypography.caption),
                            ],
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
