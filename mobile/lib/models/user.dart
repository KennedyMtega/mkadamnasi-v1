class User {
  final String id;
  final String? email;
  final String? name;
  final String? username;
  final String? avatarUrl;
  final String anonymousId;
  final bool isAnonymous;
  final String role;
  final int reputationScore;
  final int totalVotes;
  final int totalRatings;
  final int totalPolls;
  final String? referralCode;
  final int referralCount;
  final List<String> badgeIds;
  final DateTime createdAt;
  final DateTime updatedAt;

  const User({
    required this.id,
    this.email,
    this.name,
    this.username,
    this.avatarUrl,
    required this.anonymousId,
    this.isAnonymous = true,
    this.role = 'user',
    this.reputationScore = 0,
    this.totalVotes = 0,
    this.totalRatings = 0,
    this.totalPolls = 0,
    this.referralCode,
    this.referralCount = 0,
    this.badgeIds = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String?,
      name: json['name'] as String?,
      username: json['username'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      anonymousId: json['anonymousId'] as String? ?? '',
      isAnonymous: json['isAnonymous'] as bool? ?? true,
      role: json['role'] as String? ?? 'user',
      reputationScore: (json['points'] ?? json['reputationScore'] ?? 0) as int,
      totalVotes: json['totalVotes'] as int? ?? 0,
      totalRatings: json['totalRatings'] as int? ?? 0,
      totalPolls: json['totalPolls'] as int? ?? 0,
      referralCode: json['referralCode'] as String?,
      referralCount: json['referralCount'] as int? ?? 0,
      badgeIds: (json['badgeIds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'username': username,
      'avatarUrl': avatarUrl,
      'anonymousId': anonymousId,
      'isAnonymous': isAnonymous,
      'role': role,
      'reputationScore': reputationScore,
      'totalVotes': totalVotes,
      'totalRatings': totalRatings,
      'totalPolls': totalPolls,
      'referralCode': referralCode,
      'referralCount': referralCount,
      'badgeIds': badgeIds,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? name,
    String? username,
    String? avatarUrl,
    String? anonymousId,
    bool? isAnonymous,
    String? role,
    int? reputationScore,
    int? totalVotes,
    int? totalRatings,
    int? totalPolls,
    String? referralCode,
    int? referralCount,
    List<String>? badgeIds,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      username: username ?? this.username,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      anonymousId: anonymousId ?? this.anonymousId,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      role: role ?? this.role,
      reputationScore: reputationScore ?? this.reputationScore,
      totalVotes: totalVotes ?? this.totalVotes,
      totalRatings: totalRatings ?? this.totalRatings,
      totalPolls: totalPolls ?? this.totalPolls,
      referralCode: referralCode ?? this.referralCode,
      referralCount: referralCount ?? this.referralCount,
      badgeIds: badgeIds ?? this.badgeIds,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  String get displayName => name ?? username ?? 'Anonymous';
}
