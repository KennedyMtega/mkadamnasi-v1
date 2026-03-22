class SearchResult {
  final String id;
  final String type;
  final String title;
  final String? description;
  final String? imageUrl;
  final String? categoryName;
  final double? rating;
  final int? voteCount;
  final int? ratingCount;
  final DateTime createdAt;
  final double relevanceScore;

  const SearchResult({
    required this.id,
    required this.type,
    required this.title,
    this.description,
    this.imageUrl,
    this.categoryName,
    this.rating,
    this.voteCount,
    this.ratingCount,
    required this.createdAt,
    this.relevanceScore = 0.0,
  });

  factory SearchResult.fromJson(Map<String, dynamic> json) {
    return SearchResult(
      id: json['id'] as String,
      type: json['type'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      imageUrl: json['imageUrl'] as String?,
      categoryName: json['categoryName'] as String?,
      rating: (json['rating'] as num?)?.toDouble(),
      voteCount: json['voteCount'] as int?,
      ratingCount: json['ratingCount'] as int?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      relevanceScore: (json['relevanceScore'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'categoryName': categoryName,
      'rating': rating,
      'voteCount': voteCount,
      'ratingCount': ratingCount,
      'createdAt': createdAt.toIso8601String(),
      'relevanceScore': relevanceScore,
    };
  }

  bool get isVote => type == 'vote';
  bool get isRating => type == 'rating';
  bool get isCategory => type == 'category';

  String get route {
    switch (type) {
      case 'vote':
        return '/vote/$id';
      case 'rating':
        return '/rating/$id';
      case 'category':
        return '/category/$id';
      default:
        return '/';
    }
  }
}

class SearchResults {
  final List<SearchResult> items;
  final int totalCount;
  final String query;
  final bool hasMore;

  const SearchResults({
    this.items = const [],
    this.totalCount = 0,
    this.query = '',
    this.hasMore = false,
  });

  factory SearchResults.fromJson(Map<String, dynamic> json) {
    return SearchResults(
      items: (json['items'] as List<dynamic>?)
              ?.map((e) => SearchResult.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      totalCount: json['totalCount'] as int? ?? 0,
      query: json['query'] as String? ?? '',
      hasMore: json['hasMore'] as bool? ?? false,
    );
  }
}
