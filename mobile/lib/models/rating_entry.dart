class RatingEntry {
  final String id;
  final String ratingId;
  final String? userId;
  final String? anonymousId;
  final int score;
  final String? comment;
  final bool isAnonymous;
  final DateTime createdAt;
  final DateTime updatedAt;

  const RatingEntry({
    required this.id,
    required this.ratingId,
    this.userId,
    this.anonymousId,
    required this.score,
    this.comment,
    this.isAnonymous = true,
    required this.createdAt,
    required this.updatedAt,
  });

  factory RatingEntry.fromJson(Map<String, dynamic> json) {
    return RatingEntry(
      id: json['id'] as String,
      ratingId: json['ratingId'] as String? ?? '',
      userId: json['userId'] as String?,
      anonymousId: json['anonymousId'] as String?,
      score: json['score'] as int,
      comment: json['comment'] as String?,
      isAnonymous: json['isAnonymous'] as bool? ?? true,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ratingId': ratingId,
      'userId': userId,
      'anonymousId': anonymousId,
      'score': score,
      'comment': comment,
      'isAnonymous': isAnonymous,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  RatingEntry copyWith({
    String? id,
    String? ratingId,
    String? userId,
    String? anonymousId,
    int? score,
    String? comment,
    bool? isAnonymous,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return RatingEntry(
      id: id ?? this.id,
      ratingId: ratingId ?? this.ratingId,
      userId: userId ?? this.userId,
      anonymousId: anonymousId ?? this.anonymousId,
      score: score ?? this.score,
      comment: comment ?? this.comment,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
