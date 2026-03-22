class Contestant {
  final String id;
  final String voteId;
  final String optionId;
  final String code;
  final String fullName;
  final String? bio;
  final String? photoUrl;
  final String registeredBy;
  final bool isApproved;
  final int voteCount;
  final double percentage;
  final int rank;
  final Map<String, dynamic>? metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Contestant({
    required this.id,
    required this.voteId,
    required this.optionId,
    required this.code,
    required this.fullName,
    this.bio,
    this.photoUrl,
    this.registeredBy = 'creator',
    this.isApproved = false,
    this.voteCount = 0,
    this.percentage = 0.0,
    this.rank = 0,
    this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Contestant.fromJson(Map<String, dynamic> json) {
    return Contestant(
      id: json['id'] as String,
      voteId: json['voteId'] as String? ?? '',
      optionId: json['optionId'] as String? ?? '',
      code: json['code'] as String? ?? '',
      fullName: json['fullName'] as String,
      bio: json['bio'] as String?,
      photoUrl: json['photoUrl'] as String?,
      registeredBy: json['registeredBy'] as String? ?? 'creator',
      isApproved: json['isApproved'] as bool? ?? false,
      voteCount: json['voteCount'] as int? ?? 0,
      percentage: (json['percentage'] as num?)?.toDouble() ?? 0.0,
      rank: json['rank'] as int? ?? 0,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'voteId': voteId,
      'optionId': optionId,
      'code': code,
      'fullName': fullName,
      'bio': bio,
      'photoUrl': photoUrl,
      'registeredBy': registeredBy,
      'isApproved': isApproved,
      'voteCount': voteCount,
      'percentage': percentage,
      'rank': rank,
      'metadata': metadata,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Contestant copyWith({
    String? id,
    String? voteId,
    String? optionId,
    String? code,
    String? fullName,
    String? bio,
    String? photoUrl,
    String? registeredBy,
    bool? isApproved,
    int? voteCount,
    double? percentage,
    int? rank,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Contestant(
      id: id ?? this.id,
      voteId: voteId ?? this.voteId,
      optionId: optionId ?? this.optionId,
      code: code ?? this.code,
      fullName: fullName ?? this.fullName,
      bio: bio ?? this.bio,
      photoUrl: photoUrl ?? this.photoUrl,
      registeredBy: registeredBy ?? this.registeredBy,
      isApproved: isApproved ?? this.isApproved,
      voteCount: voteCount ?? this.voteCount,
      percentage: percentage ?? this.percentage,
      rank: rank ?? this.rank,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  String get initials {
    final parts = fullName.split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return fullName.isNotEmpty ? fullName[0].toUpperCase() : '?';
  }
}
