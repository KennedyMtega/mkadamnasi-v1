import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../models/rating.dart';
import '../../../widgets/mkd_star_rating.dart';

class TopRatingCard extends StatelessWidget {
  final Rating rating;
  final VoidCallback? onTap;

  const TopRatingCard({super.key, required this.rating, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 200,
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
            // Category
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.infoBlue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                rating.category,
                style: AppTypography.caption.copyWith(
                  color: AppColors.infoBlue,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 10),
            // Entity name
            Text(
              rating.entityName,
              style: AppTypography.buttonSm.copyWith(color: AppColors.deepNavy),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            // Title
            Text(
              rating.title,
              style: AppTypography.bodySm,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 10),
            // Stars + count
            Row(
              children: [
                MkdStarRating(rating: rating.averageRating, size: 16),
                const Spacer(),
                Text(
                  rating.averageRating.toStringAsFixed(1),
                  style: AppTypography.numberSm.copyWith(
                    color: AppColors.brandOrange,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Vipimo ${rating.totalRatings}',
              style: AppTypography.caption,
            ),
          ],
        ),
      ),
    );
  }
}
