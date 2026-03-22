import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../models/contestant.dart';

class ContestantCard extends StatelessWidget {
  final Contestant contestant;
  final bool isSelected;
  final bool showVoteButton;
  final bool isVoting;
  final VoidCallback? onVote;

  const ContestantCard({
    super.key,
    required this.contestant,
    this.isSelected = false,
    this.showVoteButton = false,
    this.isVoting = false,
    this.onVote,
  });

  Color _rankColor(int rank) {
    switch (rank) {
      case 1:
        return const Color(0xFFFFD700); // Gold
      case 2:
        return const Color(0xFFC0C0C0); // Silver
      case 3:
        return const Color(0xFFCD7F32); // Bronze
      default:
        return AppColors.mediumGray;
    }
  }

  @override
  Widget build(BuildContext context) {
    final rankColor = _rankColor(contestant.rank);

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isSelected
            ? AppColors.brandOrange.withValues(alpha: 0.08)
            : AppColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? AppColors.brandOrange : AppColors.lightGray,
          width: isSelected ? 1.5 : 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Rank number
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: contestant.rank <= 3
                      ? rankColor.withValues(alpha: 0.15)
                      : AppColors.lightGray.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Text(
                    '${contestant.rank}',
                    style: AppTypography.numberSm.copyWith(
                      fontSize: 14,
                      color: contestant.rank <= 3
                          ? rankColor
                          : AppColors.mediumGray,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),

              // Photo avatar
              CircleAvatar(
                radius: 20,
                backgroundColor:
                    AppColors.brandOrange.withValues(alpha: 0.1),
                backgroundImage: contestant.photoUrl != null
                    ? NetworkImage(contestant.photoUrl!)
                    : null,
                child: contestant.photoUrl == null
                    ? Text(
                        contestant.initials,
                        style: AppTypography.buttonSm.copyWith(
                          color: AppColors.brandOrange,
                        ),
                      )
                    : null,
              ),
              const SizedBox(width: 12),

              // Name + code
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      contestant.fullName,
                      style: AppTypography.buttonSm.copyWith(
                        color: AppColors.deepNavy,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.infoBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        contestant.code,
                        style: AppTypography.caption.copyWith(
                          color: AppColors.infoBlue,
                          fontWeight: FontWeight.w600,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Vote count + button
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '${contestant.voteCount}',
                    style: AppTypography.numberSm.copyWith(
                      fontSize: 14,
                      color: AppColors.deepNavy,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'kura',
                    style: AppTypography.caption,
                  ),
                ],
              ),
              if (showVoteButton) ...[
                const SizedBox(width: 8),
                SizedBox(
                  height: 32,
                  child: ElevatedButton(
                    onPressed: isVoting ? null : onVote,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.brandOrange,
                      foregroundColor: AppColors.white,
                      disabledBackgroundColor: AppColors.lightGray,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      elevation: 0,
                    ),
                    child: isVoting
                        ? const SizedBox(
                            width: 14,
                            height: 14,
                            child: CircularProgressIndicator(
                              color: AppColors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : Text(
                            'Piga',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 8),

          // Progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: contestant.percentage / 100,
              backgroundColor: AppColors.lightGray,
              valueColor: AlwaysStoppedAnimation(
                isSelected ? AppColors.brandOrange : rankColor,
              ),
              minHeight: 5,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                '${contestant.percentage.toStringAsFixed(1)}%',
                style: AppTypography.caption.copyWith(
                  color: AppColors.brandOrange,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
