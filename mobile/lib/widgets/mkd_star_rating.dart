import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

class MkdStarRating extends StatefulWidget {
  final double rating;
  final double size;
  final bool interactive;
  final ValueChanged<int>? onRatingChanged;
  final Color? filledColor;
  final Color? emptyColor;

  const MkdStarRating({
    super.key,
    required this.rating,
    this.size = 20,
    this.interactive = false,
    this.onRatingChanged,
    this.filledColor,
    this.emptyColor,
  });

  /// Display mode: compact, small stars
  const MkdStarRating.display({
    super.key,
    required this.rating,
    this.filledColor,
    this.emptyColor,
  })  : size = 20,
        interactive = false,
        onRatingChanged = null;

  /// Input mode: larger stars with touch targets
  const MkdStarRating.input({
    super.key,
    required this.rating,
    required this.onRatingChanged,
    this.filledColor,
    this.emptyColor,
  })  : size = 40,
        interactive = true;

  @override
  State<MkdStarRating> createState() => _MkdStarRatingState();
}

class _MkdStarRatingState extends State<MkdStarRating>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  int? _animatingIndex;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTap(int index) {
    if (!widget.interactive) return;
    setState(() => _animatingIndex = index);
    _controller.forward(from: 0).then((_) {
      setState(() => _animatingIndex = null);
    });
    widget.onRatingChanged?.call(index + 1);
  }

  @override
  Widget build(BuildContext context) {
    final filledColor = widget.filledColor ?? const Color(0xFFF59E0B);
    final emptyColor = widget.emptyColor ?? AppColors.lightGray;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        final starValue = index + 1;
        final isFull = widget.rating >= starValue;
        final isHalf =
            widget.rating >= starValue - 0.5 && widget.rating < starValue;

        Widget star = Icon(
          isFull
              ? Icons.star_rounded
              : isHalf
                  ? Icons.star_half_rounded
                  : Icons.star_border_rounded,
          color: isFull || isHalf ? filledColor : emptyColor,
          size: widget.size,
        );

        // Scale animation for interactive mode
        if (widget.interactive && _animatingIndex == index) {
          star = ScaleTransition(
            scale: Tween<double>(begin: 1.0, end: 1.3).animate(
              CurvedAnimation(parent: _controller, curve: Curves.easeOut),
            ),
            child: star,
          );
        }

        if (widget.interactive) {
          return GestureDetector(
            onTap: () => _onTap(index),
            child: SizedBox(
              width: 48,
              height: 48,
              child: Center(child: star),
            ),
          );
        }

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 1),
          child: star,
        );
      }),
    );
  }
}
