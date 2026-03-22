import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/category.dart';
import '../core/network/api_client.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

final _now = DateTime.now();

final _defaultCategories = [
  Category(id: 'all', name: 'All', nameSwahili: 'Zote', iconName: 'grid_view', createdAt: _now, updatedAt: _now),
  Category(id: 'michezo', name: 'Sports', nameSwahili: 'Michezo', iconName: 'sports_soccer', itemCount: 24, createdAt: _now, updatedAt: _now),
  Category(id: 'burudani', name: 'Entertainment', nameSwahili: 'Burudani', iconName: 'music_note', itemCount: 18, createdAt: _now, updatedAt: _now),
  Category(id: 'siasa', name: 'Politics', nameSwahili: 'Siasa', iconName: 'account_balance', itemCount: 12, createdAt: _now, updatedAt: _now),
  Category(id: 'teknolojia', name: 'Technology', nameSwahili: 'Teknolojia', iconName: 'phone_android', itemCount: 15, createdAt: _now, updatedAt: _now),
  Category(id: 'elimu', name: 'Education', nameSwahili: 'Elimu', iconName: 'school', itemCount: 9, createdAt: _now, updatedAt: _now),
  Category(id: 'chakula', name: 'Food', nameSwahili: 'Chakula', iconName: 'restaurant', itemCount: 20, createdAt: _now, updatedAt: _now),
  Category(id: 'usafiri', name: 'Transport', nameSwahili: 'Usafiri', iconName: 'directions_car', itemCount: 7, createdAt: _now, updatedAt: _now),
  Category(id: 'afya', name: 'Health', nameSwahili: 'Afya', iconName: 'health_and_safety', itemCount: 6, createdAt: _now, updatedAt: _now),
];

class CategoriesState {
  final List<Category> categories;
  final bool isLoading;
  final String? error;

  const CategoriesState({
    this.categories = const [],
    this.isLoading = false,
    this.error,
  });

  CategoriesState copyWith({
    List<Category>? categories,
    bool? isLoading,
    String? error,
  }) {
    return CategoriesState(
      categories: categories ?? this.categories,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class CategoriesNotifier extends StateNotifier<CategoriesState> {
  final ApiClient _apiClient;

  CategoriesNotifier(this._apiClient) : super(const CategoriesState()) {
    loadCategories();
  }

  Future<void> loadCategories() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.categories,
      );
      final categories = (response['data'] as List<dynamic>)
          .map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(categories: categories, isLoading: false);
    } catch (_) {
      state = state.copyWith(
        categories: _defaultCategories,
        isLoading: false,
      );
    }
  }

  Category? categoryById(String id) {
    try {
      return state.categories.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }
}

final categoriesProvider =
    StateNotifierProvider<CategoriesNotifier, CategoriesState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return CategoriesNotifier(apiClient);
});

final selectedCategoryProvider = StateProvider<String>((ref) => 'all');

/// Helper to get an icon for a category by icon name
IconData categoryIcon(String? iconName) {
  switch (iconName) {
    case 'grid_view':
      return Icons.grid_view_rounded;
    case 'sports_soccer':
      return Icons.sports_soccer;
    case 'music_note':
      return Icons.music_note_rounded;
    case 'account_balance':
      return Icons.account_balance_rounded;
    case 'phone_android':
      return Icons.phone_android_rounded;
    case 'school':
      return Icons.school_rounded;
    case 'restaurant':
      return Icons.restaurant_rounded;
    case 'directions_car':
      return Icons.directions_car_rounded;
    case 'health_and_safety':
      return Icons.health_and_safety_rounded;
    default:
      return Icons.category_rounded;
  }
}
