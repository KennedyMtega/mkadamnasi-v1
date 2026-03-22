import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/contests_provider.dart';

class ContestantRegisterScreen extends ConsumerStatefulWidget {
  final String contestId;

  const ContestantRegisterScreen({super.key, required this.contestId});

  @override
  ConsumerState<ContestantRegisterScreen> createState() =>
      _ContestantRegisterScreenState();
}

class _ContestantRegisterScreenState
    extends ConsumerState<ContestantRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _bioController = TextEditingController();
  final _photoUrlController = TextEditingController();

  @override
  void dispose() {
    _fullNameController.dispose();
    _bioController.dispose();
    _photoUrlController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    final data = {
      'fullName': _fullNameController.text.trim(),
      'bio': _bioController.text.trim().isEmpty
          ? null
          : _bioController.text.trim(),
      'photoUrl': _photoUrlController.text.trim().isEmpty
          ? null
          : _photoUrlController.text.trim(),
    };

    final result = await ref
        .read(contestsProvider.notifier)
        .registerForContest(widget.contestId, data);

    if (mounted && result != null) {
      final assignedCode = result['code'] as String? ?? '---';
      _showSuccessDialog(assignedCode);
    } else if (mounted) {
      final state = ref.read(contestsProvider);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            state.error ?? 'Usajili umeshindikana',
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

  void _showSuccessDialog(String code) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.successGreen.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle_rounded,
                    color: AppColors.successGreen,
                    size: 48,
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Umesajiliwa!',
                  style: AppTypography.h3,
                ),
                const SizedBox(height: 8),
                Text(
                  'Msimamo wako ni:',
                  style: AppTypography.body,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 14,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.brandOrange.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppColors.brandOrange.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Text(
                    code,
                    style: AppTypography.number.copyWith(
                      color: AppColors.brandOrange,
                      fontSize: 32,
                      letterSpacing: 4,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Shiriki msimamo huu kwa wapiga kura wako',
                  style: AppTypography.caption,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context); // close dialog
                      Navigator.pop(context); // go back to detail
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.brandOrange,
                      foregroundColor: AppColors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      'Sawa',
                      style: AppTypography.button.copyWith(
                        color: AppColors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(contestsProvider);

    return Scaffold(
      backgroundColor: AppColors.offWhite,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Text('Jiandikishe', style: AppTypography.h3),
        centerTitle: false,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: AppColors.deepNavy,
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header info
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.infoBlue.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.infoBlue.withValues(alpha: 0.2),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.info_outline_rounded,
                      color: AppColors.infoBlue,
                      size: 20,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Jaza fomu hii ili kujiandikisha kushiriki mashindano. Utapewa msimamo wa kipekee.',
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.infoBlue,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Full name
              Text(
                'Jina Kamili',
                style: AppTypography.label.copyWith(
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _fullNameController,
                textCapitalization: TextCapitalization.words,
                decoration: InputDecoration(
                  hintText: 'Jina la kwanza na la mwisho',
                  hintStyle: AppTypography.body.copyWith(
                    color: AppColors.mediumGray,
                  ),
                  filled: true,
                  fillColor: AppColors.white,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.lightGray),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.lightGray),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.brandOrange),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.errorRed),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Jina linahitajika';
                  }
                  if (value.trim().length < 3) {
                    return 'Jina liwe na herufi 3 au zaidi';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Bio
              Text(
                'Maelezo Binafsi',
                style: AppTypography.label.copyWith(
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _bioController,
                maxLines: 4,
                maxLength: 200,
                textCapitalization: TextCapitalization.sentences,
                decoration: InputDecoration(
                  hintText: 'Elezea kidogo kuhusu wewe...',
                  hintStyle: AppTypography.body.copyWith(
                    color: AppColors.mediumGray,
                  ),
                  filled: true,
                  fillColor: AppColors.white,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.lightGray),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.lightGray),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.brandOrange),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Photo URL
              Text(
                'Picha (URL)',
                style: AppTypography.label.copyWith(
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _photoUrlController,
                keyboardType: TextInputType.url,
                decoration: InputDecoration(
                  hintText: 'https://example.com/picha.jpg',
                  hintStyle: AppTypography.body.copyWith(
                    color: AppColors.mediumGray,
                  ),
                  filled: true,
                  fillColor: AppColors.white,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  prefixIcon: const Icon(
                    Icons.image_outlined,
                    color: AppColors.mediumGray,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.lightGray),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.lightGray),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.brandOrange),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Submit button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: state.isRegistering ? null : _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.brandOrange,
                    foregroundColor: AppColors.white,
                    disabledBackgroundColor: AppColors.lightGray,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 0,
                  ),
                  child: state.isRegistering
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: AppColors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : Text(
                          'Jiandikishe',
                          style: AppTypography.button.copyWith(
                            color: AppColors.white,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
