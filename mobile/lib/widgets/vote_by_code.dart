import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_typography.dart';

class VoteByCode extends StatefulWidget {
  final String? codePrefix;
  final bool isLoading;
  final Future<bool> Function(String code) onSubmit;

  const VoteByCode({
    super.key,
    this.codePrefix,
    this.isLoading = false,
    required this.onSubmit,
  });

  @override
  State<VoteByCode> createState() => _VoteByCodeState();
}

class _VoteByCodeState extends State<VoteByCode> {
  final _controller = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    final code = _controller.text.trim();
    if (code.isEmpty) return;

    setState(() => _isSubmitting = true);

    final fullCode = widget.codePrefix != null && !code.startsWith(widget.codePrefix!)
        ? '${widget.codePrefix}$code'
        : code;

    final success = await widget.onSubmit(fullCode);

    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        _controller.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Umepiga kura kwa msimamo $fullCode',
              style: AppTypography.bodySm.copyWith(color: AppColors.white),
            ),
            backgroundColor: AppColors.successGreen,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Imeshindikana. Hakikisha msimamo ni sahihi.',
              style: AppTypography.bodySm.copyWith(color: AppColors.white),
            ),
            backgroundColor: AppColors.errorRed,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
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
        children: [
          Text(
            'Piga Kura kwa Msimamo',
            style: AppTypography.buttonSm.copyWith(color: AppColors.deepNavy),
          ),
          const SizedBox(height: 4),
          Text(
            'Ingiza msimamo wa mshiriki',
            style: AppTypography.caption,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              if (widget.codePrefix != null) ...[
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 14,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.offWhite,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(10),
                      bottomLeft: Radius.circular(10),
                    ),
                    border: Border.all(color: AppColors.lightGray),
                  ),
                  child: Text(
                    widget.codePrefix!,
                    style: AppTypography.buttonSm.copyWith(
                      color: AppColors.mediumGray,
                    ),
                  ),
                ),
              ],
              Expanded(
                child: TextField(
                  controller: _controller,
                  textCapitalization: TextCapitalization.characters,
                  decoration: InputDecoration(
                    hintText: widget.codePrefix != null ? '001' : 'MT001',
                    hintStyle: AppTypography.body.copyWith(
                      color: AppColors.mediumGray,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 14,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.only(
                        topLeft: widget.codePrefix != null
                            ? Radius.zero
                            : const Radius.circular(10),
                        bottomLeft: widget.codePrefix != null
                            ? Radius.zero
                            : const Radius.circular(10),
                        topRight: const Radius.circular(10),
                        bottomRight: const Radius.circular(10),
                      ),
                      borderSide: const BorderSide(color: AppColors.lightGray),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.only(
                        topLeft: widget.codePrefix != null
                            ? Radius.zero
                            : const Radius.circular(10),
                        bottomLeft: widget.codePrefix != null
                            ? Radius.zero
                            : const Radius.circular(10),
                        topRight: const Radius.circular(10),
                        bottomRight: const Radius.circular(10),
                      ),
                      borderSide: const BorderSide(color: AppColors.lightGray),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.only(
                        topLeft: widget.codePrefix != null
                            ? Radius.zero
                            : const Radius.circular(10),
                        bottomLeft: widget.codePrefix != null
                            ? Radius.zero
                            : const Radius.circular(10),
                        topRight: const Radius.circular(10),
                        bottomRight: const Radius.circular(10),
                      ),
                      borderSide: const BorderSide(
                        color: AppColors.brandOrange,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              SizedBox(
                height: 48,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.brandOrange,
                    foregroundColor: AppColors.white,
                    disabledBackgroundColor: AppColors.lightGray,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: AppColors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : Text(
                          'Piga Kura',
                          style: AppTypography.buttonSm.copyWith(
                            color: AppColors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
