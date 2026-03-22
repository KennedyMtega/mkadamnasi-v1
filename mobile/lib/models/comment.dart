class Comment {
  final String id;
  final String content;
  final String userId;
  final String? voteId;
  final String? ratingId;
  final String? parentId;
  final bool isAnonymous;
  final int likesCount;
  final List<Comment> replies;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Comment({
    required this.id,
    required this.content,
    required this.userId,
    this.voteId,
    this.ratingId,
    this.parentId,
    this.isAnonymous = true,
    this.likesCount = 0,
    this.replies = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] as String,
      content: json['content'] as String,
      userId: json['userId'] as String? ?? json['user_id'] as String? ?? '',
      voteId: json['voteId'] as String? ?? json['vote_id'] as String?,
      ratingId: json['ratingId'] as String? ?? json['rating_id'] as String?,
      parentId: json['parentId'] as String? ?? json['parent_id'] as String?,
      isAnonymous: json['isAnonymous'] as bool? ?? json['is_anonymous'] as bool? ?? true,
      likesCount: json['likesCount'] as int? ?? json['likes_count'] as int? ?? 0,
      replies: (json['replies'] as List<dynamic>?)
              ?.map((e) => Comment.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': content,
      'userId': userId,
      'voteId': voteId,
      'ratingId': ratingId,
      'parentId': parentId,
      'isAnonymous': isAnonymous,
      'likesCount': likesCount,
      'replies': replies.map((e) => e.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Comment copyWith({
    String? id,
    String? content,
    String? userId,
    String? voteId,
    String? ratingId,
    String? parentId,
    bool? isAnonymous,
    int? likesCount,
    List<Comment>? replies,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Comment(
      id: id ?? this.id,
      content: content ?? this.content,
      userId: userId ?? this.userId,
      voteId: voteId ?? this.voteId,
      ratingId: ratingId ?? this.ratingId,
      parentId: parentId ?? this.parentId,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      likesCount: likesCount ?? this.likesCount,
      replies: replies ?? this.replies,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  String get displayName => isAnonymous ? 'Mtumiaji wa Siri' : 'Mtumiaji';

  String get timeAgoText {
    final now = DateTime.now();
    final diff = now.difference(createdAt);
    if (diff.inMinutes < 1) return 'Sasa hivi';
    if (diff.inMinutes < 60) return 'Dakika ${diff.inMinutes} zilizopita';
    if (diff.inHours < 24) return 'Saa ${diff.inHours} zilizopita';
    if (diff.inDays < 7) return 'Siku ${diff.inDays} zilizopita';
    return '${createdAt.day}/${createdAt.month}/${createdAt.year}';
  }
}
