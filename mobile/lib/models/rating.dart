class RatingReview {
  final String id;
  final String userId;
  final String username;
  final int stars;
  final String? comment;
  final DateTime createdAt;
  final bool isAnonymous;

  const RatingReview({
    required this.id,
    required this.userId,
    this.username = 'Anonymous',
    required this.stars,
    this.comment,
    required this.createdAt,
    this.isAnonymous = true,
  });
}

class RatingDistribution {
  final int star5;
  final int star4;
  final int star3;
  final int star2;
  final int star1;

  const RatingDistribution({
    this.star5 = 0,
    this.star4 = 0,
    this.star3 = 0,
    this.star2 = 0,
    this.star1 = 0,
  });

  int get total => star5 + star4 + star3 + star2 + star1;

  int countForStar(int star) {
    switch (star) {
      case 5: return star5;
      case 4: return star4;
      case 3: return star3;
      case 2: return star2;
      case 1: return star1;
      default: return 0;
    }
  }
}

class Rating {
  final String id;
  final String title;
  final String description;
  final String entityName;
  final String entityType;
  final String category;
  final double averageRating;
  final int totalRatings;
  final RatingDistribution distribution;
  final List<RatingReview> recentReviews;
  final DateTime createdAt;
  final bool hasRated;

  const Rating({
    required this.id,
    required this.title,
    this.description = '',
    required this.entityName,
    this.entityType = 'general',
    required this.category,
    this.averageRating = 0.0,
    this.totalRatings = 0,
    this.distribution = const RatingDistribution(),
    this.recentReviews = const [],
    required this.createdAt,
    this.hasRated = false,
  });
}
