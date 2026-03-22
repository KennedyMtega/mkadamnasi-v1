import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/rating.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exceptions.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

final _now = DateTime.now();

final _sampleRatings = [
  Rating(
    id: '1',
    title: 'Serengeti Premium Lager',
    description: 'Kadiria bia maarufu Tanzania',
    entityName: 'Serengeti Breweries',
    entityType: 'product',
    categoryId: 'vinywaji',
    averageRating: 4.3,
    totalRatings: 856,
    distribution: const RatingDistribution(star5: 400, star4: 250, star3: 120, star2: 50, star1: 36),
    createdAt: _now.subtract(const Duration(days: 10)),
    updatedAt: _now,
  ),
  Rating(
    id: '2',
    title: 'DSTV Tanzania',
    description: 'Huduma ya TV ya kulipa',
    entityName: 'MultiChoice Tanzania',
    entityType: 'service',
    categoryId: 'burudani',
    averageRating: 3.2,
    totalRatings: 1243,
    distribution: const RatingDistribution(star5: 200, star4: 250, star3: 350, star2: 280, star1: 163),
    createdAt: _now.subtract(const Duration(days: 5)),
    updatedAt: _now,
  ),
  Rating(
    id: '3',
    title: 'Uber Tanzania',
    description: 'Huduma ya usafiri',
    entityName: 'Uber',
    entityType: 'service',
    categoryId: 'usafiri',
    averageRating: 3.8,
    totalRatings: 2100,
    distribution: const RatingDistribution(star5: 600, star4: 700, star3: 400, star2: 250, star1: 150),
    createdAt: _now.subtract(const Duration(days: 3)),
    updatedAt: _now,
  ),
  Rating(
    id: '4',
    title: 'Mlimani City Mall',
    description: 'Soko kuu la Dar es Salaam',
    entityName: 'Mlimani City',
    entityType: 'place',
    categoryId: 'ununuzi',
    averageRating: 4.1,
    totalRatings: 534,
    distribution: const RatingDistribution(star5: 200, star4: 150, star3: 100, star2: 50, star1: 34),
    createdAt: _now.subtract(const Duration(days: 7)),
    updatedAt: _now,
  ),
];

class RatingsState {
  final List<Rating> ratings;
  final List<Rating> topRatings;
  final Rating? selectedRating;
  final bool isLoading;
  final bool isLoadingMore;
  final String? error;
  final int currentPage;
  final bool hasMore;

  const RatingsState({
    this.ratings = const [],
    this.topRatings = const [],
    this.selectedRating,
    this.isLoading = false,
    this.isLoadingMore = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
  });

  RatingsState copyWith({
    List<Rating>? ratings,
    List<Rating>? topRatings,
    Rating? selectedRating,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    int? currentPage,
    bool? hasMore,
  }) {
    return RatingsState(
      ratings: ratings ?? this.ratings,
      topRatings: topRatings ?? this.topRatings,
      selectedRating: selectedRating ?? this.selectedRating,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

class RatingsNotifier extends StateNotifier<RatingsState> {
  final ApiClient _apiClient;

  RatingsNotifier(this._apiClient) : super(const RatingsState()) {
    loadRatings();
  }

  Future<void> loadRatings({String? categoryId}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.ratings,
        queryParameters: {
          'page': 1,
          'limit': 20,
          if (categoryId != null) 'categoryId': categoryId,
        },
      );
      final ratings = (response['data'] as List<dynamic>)
          .map((e) => Rating.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(
        ratings: ratings,
        isLoading: false,
        currentPage: 1,
        hasMore: ratings.length >= 20,
      );
    } on ApiException catch (e) {
      state = state.copyWith(
        ratings: _sampleRatings,
        isLoading: false,
        error: e.message,
      );
    } catch (_) {
      state = state.copyWith(ratings: _sampleRatings, isLoading: false);
    }
  }

  Future<void> loadTopRatings() async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.ratingTop,
      );
      final ratings = (response['data'] as List<dynamic>)
          .map((e) => Rating.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(topRatings: ratings);
    } catch (_) {
      final sorted = [..._sampleRatings];
      sorted.sort((a, b) => b.averageRating.compareTo(a.averageRating));
      state = state.copyWith(topRatings: sorted);
    }
  }

  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore) return;
    state = state.copyWith(isLoadingMore: true);
    try {
      final nextPage = state.currentPage + 1;
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.ratings,
        queryParameters: {'page': nextPage, 'limit': 20},
      );
      final newRatings = (response['data'] as List<dynamic>)
          .map((e) => Rating.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(
        ratings: [...state.ratings, ...newRatings],
        isLoadingMore: false,
        currentPage: nextPage,
        hasMore: newRatings.length >= 20,
      );
    } catch (_) {
      state = state.copyWith(isLoadingMore: false, hasMore: false);
    }
  }

  Future<void> refresh() async {
    await loadRatings();
    await loadTopRatings();
  }

  Future<Rating?> getRatingById(String id) async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.ratingById(id),
      );
      final rating = Rating.fromJson(response);
      state = state.copyWith(selectedRating: rating);
      return rating;
    } catch (_) {
      try {
        final rating = state.ratings.firstWhere((r) => r.id == id);
        state = state.copyWith(selectedRating: rating);
        return rating;
      } catch (_) {
        return null;
      }
    }
  }

  Future<bool> submitRating(String ratingId, int score, {String? comment}) async {
    try {
      await _apiClient.post(
        ApiConstants.submitRating(ratingId),
        data: {
          'score': score,
          if (comment != null) 'comment': comment,
        },
      );
      // Update local state
      final updatedRatings = state.ratings.map((r) {
        if (r.id == ratingId) {
          return r.copyWith(
            hasRated: true,
            userRating: score,
            totalRatings: r.totalRatings + 1,
          );
        }
        return r;
      }).toList();
      state = state.copyWith(ratings: updatedRatings);
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<Rating?> createRating({
    required String title,
    required String entityName,
    String? description,
    String entityType = 'general',
    String? categoryId,
  }) async {
    try {
      final response = await _apiClient.post<Map<String, dynamic>>(
        ApiConstants.ratings,
        data: {
          'title': title,
          'entityName': entityName,
          'description': description,
          'entityType': entityType,
          'categoryId': categoryId,
        },
      );
      final rating = Rating.fromJson(response);
      state = state.copyWith(ratings: [rating, ...state.ratings]);
      return rating;
    } catch (_) {
      return null;
    }
  }

  Rating? ratingById(String id) {
    try {
      return state.ratings.firstWhere((r) => r.id == id);
    } catch (_) {
      return null;
    }
  }
}

final ratingsProvider =
    StateNotifierProvider<RatingsNotifier, RatingsState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return RatingsNotifier(apiClient);
});
