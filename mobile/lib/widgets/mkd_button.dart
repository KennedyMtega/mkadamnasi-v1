import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../core/theme/app_spacing.dart';

enum MkdButtonVariant { primary, secondary, ghost }
enum MkdButtonSize { normal, small }

class MkdButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final MkdButtonVariant variant;
  final MkdButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;
  final IconData? trailingIcon;

  const MkdButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = MkdButtonVariant.primary,
    this.size = MkdButtonSize.normal,
    this.isLoading = false,
    this.isFullWidth = true,
    this.icon,
    this.trailingIcon,
  });

  @override
  Widget build(BuildContext context) {
    final isSmall = size == MkdButtonSize.small;
    final height = isSmall ? 36.0 : 48.0;
    final radius = isSmall ? AppSpacing.radiusSm : AppSpacing.radiusMd;
    final textStyle = isSmall ? AppTypography.buttonSm : AppTypography.button;

    switch (variant) {
      case MkdButtonVariant.primary:
        return _buildPrimary(height, radius, textStyle);
      case MkdButtonVariant.secondary:
        return _buildSecondary(height, radius, textStyle);
      case MkdButtonVariant.ghost:
        return _buildGhost(height, radius, textStyle);
    }
  }

  Widget _buildPrimary(double height, double radius, TextStyle textStyle) {
    return SizedBox(
      height: height,
      width: isFullWidth ? double.infinity : null,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.brandOrange,
          foregroundColor: AppColors.white,
          elevation: 2,
          shadowColor: AppColors.brandOrange.withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radius),
          ),
          padding: EdgeInsets.symmetric(
            horizontal: isFullWidth ? 0 : AppSpacing.xl,
          ),
          textStyle: textStyle,
        ),
        child: _buildContent(textStyle.copyWith(color: AppColors.white)),
      ),
    );
  }

  Widget _buildSecondary(double height, double radius, TextStyle textStyle) {
    return SizedBox(
      height: height,
      width: isFullWidth ? double.infinity : null,
      child: OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.brandOrange,
          side: const BorderSide(color: AppColors.brandOrange, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radius),
          ),
          padding: EdgeInsets.symmetric(
            horizontal: isFullWidth ? 0 : AppSpacing.xl,
          ),
          textStyle: textStyle,
        ),
        child: _buildContent(textStyle.copyWith(color: AppColors.brandOrange)),
      ),
    );
  }

  Widget _buildGhost(double height, double radius, TextStyle textStyle) {
    return SizedBox(
      height: height,
      width: isFullWidth ? double.infinity : null,
      child: TextButton(
        onPressed: isLoading ? null : onPressed,
        style: TextButton.styleFrom(
          foregroundColor: AppColors.brandOrange,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radius),
          ),
          padding: EdgeInsets.symmetric(
            horizontal: isFullWidth ? 0 : AppSpacing.xl,
          ),
          textStyle: textStyle,
        ),
        child: _buildContent(textStyle.copyWith(color: AppColors.brandOrange)),
      ),
    );
  }

  Widget _buildContent(TextStyle textStyle) {
    if (isLoading) {
      return SizedBox(
        width: 20,
        height: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(
            variant == MkdButtonVariant.primary
                ? AppColors.white
                : AppColors.brandOrange,
          ),
        ),
      );
    }

    final children = <Widget>[];
    if (icon != null) {
      children.add(Icon(icon, size: 20));
      children.add(const SizedBox(width: 8));
    }
    children.add(Text(label, style: textStyle));
    if (trailingIcon != null) {
      children.add(const SizedBox(width: 8));
      children.add(Icon(trailingIcon, size: 20));
    }

    return Row(
      mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: children,
    );
  }
}
