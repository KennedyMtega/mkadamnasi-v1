import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

class MkdStarRating extends StatelessWidget {
  final double rating;
  final double size;
  final bool interactive;
  final ValueChanged<int>? onRatingChanged;

  const MkdStarRating({
    super.key,
    required this.rating,
    this.size = 20,
    this.interactive = false,
    this.onRatingChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        final starValue = index + 1;
        final isFull = rating >= starValue;
        final isHalf = rating >= starValue - 0.5 && rating < starValue;

        return GestureDetector(
          onTap: interactive ? () => onRatingChanged?.call(starValue) : null,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 1),
            child: Icon(
              isFull
                  ? Icons.star_rounded
                  : isHalf
                      ? Icons.star_half_rounded
                      : Icons.star_border_rounded,
              color: isFull || isHalf ? AppColors.warningYellow : AppColors.lightGray,
              size: size,
            ),
          ),
        );
      }),
    );
  }
}
