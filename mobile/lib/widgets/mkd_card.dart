import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_spacing.dart';

class MkdCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final double? borderRadius;
  final Border? border;

  const MkdCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.onTap,
    this.backgroundColor,
    this.borderRadius,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: backgroundColor ??
            (isDark ? AppColors.darkCard : AppColors.white),
        borderRadius: BorderRadius.circular(borderRadius ?? AppSpacing.radiusLg),
        border: border ??
            Border.all(
              color: isDark ? AppColors.darkBorder : const Color(0xFFF3F4F6),
              width: 1,
            ),
        boxShadow: isDark
            ? null
            : [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 3,
                  offset: const Offset(0, 1),
                ),
              ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius:
              BorderRadius.circular(borderRadius ?? AppSpacing.radiusLg),
          child: Padding(
            padding: padding ?? AppSpacing.paddingBase,
            child: child,
          ),
        ),
      ),
    );
  }
}
