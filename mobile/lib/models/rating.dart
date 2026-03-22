import 'category.dart';
import 'rating_entry.dart';

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

  double percentageForStar(int star) {
    if (total == 0) return 0;
    return (countForStar(star) / total) * 100;
  }

  factory RatingDistribution.fromJson(Map<String, dynamic> json) {
    return RatingDistribution(
      star5: json['star5'] as int? ?? json['5'] as int? ?? 0,
      star4: json['star4'] as int? ?? json['4'] as int? ?? 0,
      star3: json['star3'] as int? ?? json['3'] as int? ?? 0,
      star2: json['star2'] as int? ?? json['2'] as int? ?? 0,
      star1: json['star1'] as int? ?? json['1'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'star5': star5,
      'star4': star4,
      'star3': star3,
      'star2': star2,
      'star1': star1,
    };
  }
}

class Rating {
  final String id;
  final String title;
  final String? description;
  final String entityName;
  final String entityType;
  final String? imageUrl;
  final double averageRating;
  final int totalRatings;
  final int viewCount;
  final int shareCount;
  final bool isAnonymous;
  final bool isFeatured;
  final String? creatorId;
  final String? categoryId;
  final Category? category;
  final RatingDistribution distribution;
  final List<RatingEntry> recentEntries;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool? hasRated;
  final int? userRating;
  final List<String> tags;

  const Rating({
    required this.id,
    required this.title,
    this.description,
    required this.entityName,
    this.entityType = 'general',
    this.imageUrl,
    this.averageRating = 0.0,
    this.totalRatings = 0,
    this.viewCount = 0,
    this.shareCount = 0,
    this.isAnonymous = true,
    this.isFeatured = false,
    this.creatorId,
    this.categoryId,
    this.category,
    this.distribution = const RatingDistribution(),
    this.recentEntries = const [],
    required this.createdAt,
    required this.updatedAt,
    this.hasRated,
    this.userRating,
    this.tags = const [],
  });

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      entityName: json['entityName'] as String? ?? json['title'] as String,
      entityType: json['entityType'] as String? ?? 'general',
      imageUrl: json['imageUrl'] as String?,
      averageRating: (json['averageRating'] as num?)?.toDouble() ?? 0.0,
      totalRatings: json['totalRatings'] as int? ?? 0,
      viewCount: json['viewCount'] as int? ?? 0,
      shareCount: json['shareCount'] as int? ?? 0,
      isAnonymous: json['isAnonymous'] as bool? ?? true,
      isFeatured: json['isFeatured'] as bool? ?? false,
      creatorId: json['creatorId'] as String?,
      categoryId: json['categoryId'] as String?,
      category: json['category'] != null
          ? Category.fromJson(json['category'] as Map<String, dynamic>)
          : null,
      distribution: json['distribution'] != null
          ? RatingDistribution.fromJson(
              json['distribution'] as Map<String, dynamic>)
          : const RatingDistribution(),
      recentEntries: (json['recentEntries'] as List<dynamic>?)
              ?.map((e) => RatingEntry.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      hasRated: json['hasRated'] as bool?,
      userRating: json['userRating'] as int?,
      tags: (json['tags'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'entityName': entityName,
      'entityType': entityType,
      'imageUrl': imageUrl,
      'averageRating': averageRating,
      'totalRatings': totalRatings,
      'viewCount': viewCount,
      'shareCount': shareCount,
      'isAnonymous': isAnonymous,
      'isFeatured': isFeatured,
      'creatorId': creatorId,
      'categoryId': categoryId,
      'category': category?.toJson(),
      'distribution': distribution.toJson(),
      'recentEntries': recentEntries.map((e) => e.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'hasRated': hasRated,
      'userRating': userRating,
      'tags': tags,
    };
  }

  Rating copyWith({
    String? id,
    String? title,
    String? description,
    String? entityName,
    String? entityType,
    String? imageUrl,
    double? averageRating,
    int? totalRatings,
    int? viewCount,
    int? shareCount,
    bool? isAnonymous,
    bool? isFeatured,
    String? creatorId,
    String? categoryId,
    Category? category,
    RatingDistribution? distribution,
    List<RatingEntry>? recentEntries,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? hasRated,
    int? userRating,
    List<String>? tags,
  }) {
    return Rating(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      entityName: entityName ?? this.entityName,
      entityType: entityType ?? this.entityType,
      imageUrl: imageUrl ?? this.imageUrl,
      averageRating: averageRating ?? this.averageRating,
      totalRatings: totalRatings ?? this.totalRatings,
      viewCount: viewCount ?? this.viewCount,
      shareCount: shareCount ?? this.shareCount,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      isFeatured: isFeatured ?? this.isFeatured,
      creatorId: creatorId ?? this.creatorId,
      categoryId: categoryId ?? this.categoryId,
      category: category ?? this.category,
      distribution: distribution ?? this.distribution,
      recentEntries: recentEntries ?? this.recentEntries,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      hasRated: hasRated ?? this.hasRated,
      userRating: userRating ?? this.userRating,
      tags: tags ?? this.tags,
    );
  }
}
