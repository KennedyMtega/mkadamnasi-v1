import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../providers/categories_provider.dart';
import '../../../providers/votes_provider.dart';

class CreateVoteForm extends ConsumerStatefulWidget {
  const CreateVoteForm({super.key});

  @override
  ConsumerState<CreateVoteForm> createState() => _CreateVoteFormState();
}

class _CreateVoteFormState extends ConsumerState<CreateVoteForm> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final List<TextEditingController> _optionControllers = [
    TextEditingController(),
    TextEditingController(),
  ];

  String _selectedType = 'standard';
  String? _selectedCategoryId;
  bool _isAnonymous = true;
  DateTime? _endDate;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    for (final c in _optionControllers) {
      c.dispose();
    }
    super.dispose();
  }

  void _addOption() {
    setState(() {
      _optionControllers.add(TextEditingController());
    });
  }

  void _removeOption(int index) {
    if (_optionControllers.length <= 2) return;
    setState(() {
      _optionControllers[index].dispose();
      _optionControllers.removeAt(index);
    });
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 7)),
      firstDate: DateTime.now().add(const Duration(hours: 1)),
      lastDate: DateTime.now().add(const Duration(days: 90)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(primary: AppColors.brandOrange),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => _endDate = picked);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final options = _optionControllers
        .map((c) => c.text.trim())
        .where((t) => t.isNotEmpty)
        .toList();
    if (options.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ongeza angalau chaguo 2')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    final result = await ref.read(votesProvider.notifier).createVote(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      optionLabels: options,
      categoryId: _selectedCategoryId,
      type: _selectedType,
      expiresAt: _endDate,
    );
    setState(() => _isSubmitting = false);

    if (mounted) {
      if (result != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Kura imeundwa!'), backgroundColor: AppColors.successGreen),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Hitilafu imetokea. Jaribu tena.'), backgroundColor: AppColors.errorRed),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final categoriesState = ref.watch(categoriesProvider);
    final categories = categoriesState.categories.where((c) => c.id != 'all').toList();

    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Title
          Text('Kichwa cha Kura', style: AppTypography.label),
          const SizedBox(height: 8),
          TextFormField(
            controller: _titleController,
            decoration: _inputDecoration('Mfano: Mchezaji bora wa mwaka'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Weka kichwa' : null,
          ),
          const SizedBox(height: 20),

          // Description
          Text('Maelezo', style: AppTypography.label),
          const SizedBox(height: 8),
          TextFormField(
            controller: _descriptionController,
            maxLines: 3,
            decoration: _inputDecoration('Eleza kura yako...'),
          ),
          const SizedBox(height: 20),

          // Vote type
          Text('Aina ya Kura', style: AppTypography.label),
          const SizedBox(height: 8),
          Row(
            children: [
              _TypeChip('Poll', 'standard', _selectedType == 'standard', () => setState(() => _selectedType = 'standard')),
              const SizedBox(width: 8),
              _TypeChip('Versus', 'versus', _selectedType == 'versus', () => setState(() => _selectedType = 'versus')),
              const SizedBox(width: 8),
              _TypeChip('Ranking', 'ranking', _selectedType == 'ranking', () => setState(() => _selectedType = 'ranking')),
            ],
          ),
          const SizedBox(height: 20),

          // Category
          Text('Kategoria', style: AppTypography.label),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            value: _selectedCategoryId,
            decoration: _inputDecoration('Chagua kategoria'),
            items: categories.map((c) => DropdownMenuItem(value: c.id, child: Text(c.displayName))).toList(),
            onChanged: (v) => setState(() => _selectedCategoryId = v),
          ),
          const SizedBox(height: 20),

          // Options
          Row(
            children: [
              Text('Chaguo', style: AppTypography.label),
              const Spacer(),
              GestureDetector(
                onTap: _addOption,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.add_circle_rounded, color: AppColors.brandOrange, size: 20),
                    const SizedBox(width: 4),
                    Text('Ongeza', style: AppTypography.buttonSm.copyWith(color: AppColors.brandOrange)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...List.generate(_optionControllers.length, (i) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _optionControllers[i],
                      decoration: _inputDecoration('Chaguo ${i + 1}'),
                    ),
                  ),
                  if (_optionControllers.length > 2)
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline_rounded, color: AppColors.errorRed),
                      onPressed: () => _removeOption(i),
                    ),
                ],
              ),
            );
          }),
          const SizedBox(height: 20),

          // Anonymous toggle
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Kura ya Siri', style: AppTypography.label),
                    Text('Jina lako halitaonekana', style: AppTypography.caption),
                  ],
                ),
              ),
              Switch(
                value: _isAnonymous,
                activeColor: AppColors.brandOrange,
                onChanged: (v) => setState(() => _isAnonymous = v),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // End date
          GestureDetector(
            onTap: _pickDate,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.lightGray),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.calendar_today_rounded, color: AppColors.mediumGray, size: 20),
                  const SizedBox(width: 12),
                  Text(
                    _endDate != null
                        ? 'Inaisha: ${_endDate!.day}/${_endDate!.month}/${_endDate!.year}'
                        : 'Chagua tarehe ya mwisho',
                    style: AppTypography.body.copyWith(
                      color: _endDate != null ? AppColors.deepNavy : AppColors.mediumGray,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),

          // Submit
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: _isSubmitting ? null : _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.brandOrange,
                foregroundColor: AppColors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                elevation: 0,
              ),
              child: _isSubmitting
                  ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: AppColors.white, strokeWidth: 2))
                  : Text('Chapisha Kura', style: AppTypography.button.copyWith(color: AppColors.white)),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: AppTypography.body.copyWith(color: AppColors.mediumGray),
      filled: true,
      fillColor: AppColors.white,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.lightGray)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.lightGray)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.brandOrange, width: 1.5)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    );
  }
}

class _TypeChip extends StatelessWidget {
  final String label;
  final String value;
  final bool isSelected;
  final VoidCallback onTap;

  const _TypeChip(this.label, this.value, this.isSelected, this.onTap);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.brandOrange : AppColors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: isSelected ? AppColors.brandOrange : AppColors.lightGray),
        ),
        child: Text(label, style: AppTypography.buttonSm.copyWith(color: isSelected ? AppColors.white : AppColors.darkGray)),
      ),
    );
  }
}
