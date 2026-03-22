import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';
import '../core/theme/app_spacing.dart';

class MkdInput extends StatelessWidget {
  final String? label;
  final String? hint;
  final String? errorText;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final bool obscureText;
  final bool readOnly;
  final bool enabled;
  final int maxLines;
  final int? maxLength;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onTap;
  final String? Function(String?)? validator;

  const MkdInput({
    super.key,
    this.label,
    this.hint,
    this.errorText,
    this.controller,
    this.focusNode,
    this.obscureText = false,
    this.readOnly = false,
    this.enabled = true,
    this.maxLines = 1,
    this.maxLength,
    this.keyboardType,
    this.textInputAction,
    this.prefixIcon,
    this.suffixIcon,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: AppTypography.label.copyWith(
              color: AppColors.darkGray,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 6),
        ],
        SizedBox(
          height: maxLines > 1 ? null : 56,
          child: TextFormField(
            controller: controller,
            focusNode: focusNode,
            obscureText: obscureText,
            readOnly: readOnly,
            enabled: enabled,
            maxLines: maxLines,
            maxLength: maxLength,
            keyboardType: keyboardType,
            textInputAction: textInputAction,
            style: AppTypography.body.copyWith(color: AppColors.deepNavy),
            onChanged: onChanged,
            onFieldSubmitted: onSubmitted,
            onTap: onTap,
            validator: validator,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: AppTypography.body.copyWith(color: AppColors.mediumGray),
              errorText: errorText,
              prefixIcon: prefixIcon,
              suffixIcon: suffixIcon,
              filled: true,
              fillColor: enabled ? AppColors.white : AppColors.offWhite,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.base,
                vertical: AppSpacing.base,
              ),
              border: OutlineInputBorder(
                borderRadius: AppSpacing.borderRadiusMd,
                borderSide: const BorderSide(
                  color: AppColors.lightGray,
                  width: 1.5,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: AppSpacing.borderRadiusMd,
                borderSide: const BorderSide(
                  color: AppColors.lightGray,
                  width: 1.5,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: AppSpacing.borderRadiusMd,
                borderSide: const BorderSide(
                  color: AppColors.brandOrange,
                  width: 1.5,
                ),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: AppSpacing.borderRadiusMd,
                borderSide: const BorderSide(
                  color: AppColors.errorRed,
                  width: 1.5,
                ),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: AppSpacing.borderRadiusMd,
                borderSide: const BorderSide(
                  color: AppColors.errorRed,
                  width: 1.5,
                ),
              ),
              disabledBorder: OutlineInputBorder(
                borderRadius: AppSpacing.borderRadiusMd,
                borderSide: const BorderSide(
                  color: AppColors.lightGray,
                  width: 1.5,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
