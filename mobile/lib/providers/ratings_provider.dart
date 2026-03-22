import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/rating.dart';

final _sampleRatings = [
  Rating(
    id: '1',
    title: 'Serengeti Premium Lager',
    description: 'Kadiria bia maarufu Tanzania',
    entityName: 'Serengeti Breweries',
    entityType: 'Bidhaa',
    category: 'Vinywaji',
    averageRating: 4.3,
    totalRatings: 856,
    distribution: const RatingDistribution(star5: 400, star4: 250, star3: 120, star2: 50, star1: 36),
    recentReviews: [
      RatingReview(id: 'r1', userId: 'u1', username: 'Mtumiaji001', stars: 5, comment: 'Bia nzuri sana!', createdAt: DateTime.now().subtract(const Duration(hours: 2))),
      RatingReview(id: 'r2', userId: 'u2', username: 'Anonymous', stars: 4, comment: 'Ladha tamu', createdAt: DateTime.now().subtract(const Duration(hours: 5)), isAnonymous: true),
    ],
    createdAt: DateTime.now().subtract(const Duration(days: 10)),
  ),
  Rating(
    id: '2',
    title: 'DSTV Tanzania',
    description: 'Huduma ya TV ya kulipa',
    entityName: 'MultiChoice Tanzania',
    entityType: 'Huduma',
    category: 'Burudani',
    averageRating: 3.2,
    totalRatings: 1243,
    distribution: const RatingDistribution(star5: 200, star4: 250, star3: 350, star2: 280, star1: 163),
    createdAt: DateTime.now().subtract(const Duration(days: 5)),
  ),
  Rating(
    id: '3',
    title: 'Uber Tanzania',
    description: 'Huduma ya usafiri',
    entityName: 'Uber',
    entityType: 'Huduma',
    category: 'Usafiri',
    averageRating: 3.8,
    totalRatings: 2100,
    distribution: const RatingDistribution(star5: 600, star4: 700, star3: 400, star2: 250, star1: 150),
    createdAt: DateTime.now().subtract(const Duration(days: 3)),
  ),
  Rating(
    id: '4',
    title: 'Mlimani City Mall',
    description: 'Soko kuu la Dar es Salaam',
    entityName: 'Mlimani City',
    entityType: 'Mahali',
    category: 'Ununuzi',
    averageRating: 4.1,
    totalRatings: 534,
    distribution: const RatingDistribution(star5: 200, star4: 150, star3: 100, star2: 50, star1: 34),
    createdAt: DateTime.now().subtract(const Duration(days: 7)),
  ),
];

class RatingsState {
  final List<Rating> ratings;
  final bool isLoading;
  final String? error;

  const RatingsState({
    this.ratings = const [],
    this.isLoading = false,
    this.error,
  });

  RatingsState copyWith({
    List<Rating>? ratings,
    bool? isLoading,
    String? error,
  }) {
    return RatingsState(
      ratings: ratings ?? this.ratings,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class RatingsNotifier extends StateNotifier<RatingsState> {
  RatingsNotifier() : super(const RatingsState()) {
    loadRatings();
  }

  Future<void> loadRatings() async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(milliseconds: 500));
    state = state.copyWith(ratings: _sampleRatings, isLoading: false);
  }

  Future<void> refresh() async {
    await loadRatings();
  }

  List<Rating> get topRatings {
    final sorted = [...state.ratings];
    sorted.sort((a, b) => b.averageRating.compareTo(a.averageRating));
    return sorted;
  }

  List<Rating> ratingsByCategory(String category) {
    return state.ratings.where((r) => r.category == category).toList();
  }

  Rating? ratingById(String id) {
    try {
      return state.ratings.firstWhere((r) => r.id == id);
    } catch (_) {
      return null;
    }
  }
}

final ratingsProvider = StateNotifierProvider<RatingsNotifier, RatingsState>((ref) {
  return RatingsNotifier();
});
