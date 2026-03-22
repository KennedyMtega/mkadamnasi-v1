import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../providers/categories_provider.dart';
import '../../../providers/ratings_provider.dart';

class CreateRatingForm extends ConsumerStatefulWidget {
  const CreateRatingForm({super.key});

  @override
  ConsumerState<CreateRatingForm> createState() => _CreateRatingFormState();
}

class _CreateRatingFormState extends ConsumerState<CreateRatingForm> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _entityNameController = TextEditingController();

  String _entityType = 'general';
  String? _selectedCategoryId;
  bool _isAnonymous = true;
  bool _isSubmitting = false;

  final _entityTypes = [
    ('general', 'Jumla'),
    ('product', 'Bidhaa'),
    ('service', 'Huduma'),
    ('place', 'Mahali'),
    ('person', 'Mtu'),
    ('business', 'Biashara'),
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _entityNameController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    final result = await ref.read(ratingsProvider.notifier).createRating(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      entityName: _entityNameController.text.trim(),
      entityType: _entityType,
      categoryId: _selectedCategoryId,
    );
    setState(() => _isSubmitting = false);

    if (mounted) {
      if (result != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Kipimo kimeundwa!'), backgroundColor: AppColors.successGreen),
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
          Text('Kichwa', style: AppTypography.label),
          const SizedBox(height: 8),
          TextFormField(
            controller: _titleController,
            decoration: _inputDecoration('Mfano: Serengeti Premium Lager'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Weka kichwa' : null,
          ),
          const SizedBox(height: 20),

          // Description
          Text('Maelezo', style: AppTypography.label),
          const SizedBox(height: 8),
          TextFormField(
            controller: _descriptionController,
            maxLines: 3,
            decoration: _inputDecoration('Eleza kipimo chako...'),
          ),
          const SizedBox(height: 20),

          // Entity name
          Text('Jina la Kitu/Huduma', style: AppTypography.label),
          const SizedBox(height: 8),
          TextFormField(
            controller: _entityNameController,
            decoration: _inputDecoration('Mfano: Serengeti Breweries'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Weka jina' : null,
          ),
          const SizedBox(height: 20),

          // Entity type
          Text('Aina', style: AppTypography.label),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            value: _entityType,
            decoration: _inputDecoration('Chagua aina'),
            items: _entityTypes.map((t) => DropdownMenuItem(value: t.$1, child: Text(t.$2))).toList(),
            onChanged: (v) => setState(() => _entityType = v ?? 'general'),
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

          // Anonymous toggle
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Kipimo cha Siri', style: AppTypography.label),
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
                  : Text('Chapisha Kipimo', style: AppTypography.button.copyWith(color: AppColors.white)),
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
