import 'vote_option.dart';
import 'category.dart';
import 'contestant.dart';

class Vote {
  final String id;
  final String title;
  final String? description;
  final String type;
  final String status;
  final bool isAnonymous;
  final bool isFeatured;
  final bool allowMultiple;
  final int totalVotes;
  final int viewCount;
  final int shareCount;
  final String? imageUrl;
  final String? creatorId;
  final String? categoryId;
  final Category? category;
  final List<VoteOption> options;
  final DateTime? expiresAt;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool? hasVoted;
  final String? selectedOptionId;
  final List<String> tags;
  final bool boostEnabled;
  final double? boostPrice;
  final bool contestRegistrationOpen;
  final String? registrationSlug;
  final String? codePrefix;
  final List<Contestant> contestants;

  const Vote({
    required this.id,
    required this.title,
    this.description,
    this.type = 'standard',
    this.status = 'active',
    this.isAnonymous = true,
    this.isFeatured = false,
    this.allowMultiple = false,
    this.totalVotes = 0,
    this.viewCount = 0,
    this.shareCount = 0,
    this.imageUrl,
    this.creatorId,
    this.categoryId,
    this.category,
    this.options = const [],
    this.expiresAt,
    required this.createdAt,
    required this.updatedAt,
    this.hasVoted,
    this.selectedOptionId,
    this.tags = const [],
    this.boostEnabled = false,
    this.boostPrice,
    this.contestRegistrationOpen = false,
    this.registrationSlug,
    this.codePrefix,
    this.contestants = const [],
  });

  factory Vote.fromJson(Map<String, dynamic> json) {
    return Vote(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      type: json['type'] as String? ?? 'standard',
      status: json['status'] as String? ?? 'active',
      isAnonymous: json['isAnonymous'] as bool? ?? true,
      isFeatured: json['isFeatured'] as bool? ?? false,
      allowMultiple: json['allowMultiple'] as bool? ?? false,
      totalVotes: json['totalVotes'] as int? ?? 0,
      viewCount: json['viewCount'] as int? ?? 0,
      shareCount: json['shareCount'] as int? ?? 0,
      imageUrl: json['imageUrl'] as String?,
      creatorId: json['creatorId'] as String?,
      categoryId: json['categoryId'] as String?,
      category: json['category'] != null
          ? Category.fromJson(json['category'] as Map<String, dynamic>)
          : null,
      options: (json['options'] as List<dynamic>?)
              ?.map((e) => VoteOption.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      expiresAt: json['expiresAt'] != null
          ? DateTime.parse(json['expiresAt'] as String)
          : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      hasVoted: json['hasVoted'] as bool?,
      selectedOptionId: json['selectedOptionId'] as String?,
      tags: (json['tags'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      boostEnabled: json['boostEnabled'] as bool? ?? false,
      boostPrice: (json['boostPrice'] as num?)?.toDouble(),
      contestRegistrationOpen: json['contestRegistrationOpen'] as bool? ?? false,
      registrationSlug: json['registrationSlug'] as String?,
      codePrefix: json['codePrefix'] as String?,
      contestants: (json['contestants'] as List<dynamic>?)
              ?.map((e) => Contestant.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type,
      'status': status,
      'isAnonymous': isAnonymous,
      'isFeatured': isFeatured,
      'allowMultiple': allowMultiple,
      'totalVotes': totalVotes,
      'viewCount': viewCount,
      'shareCount': shareCount,
      'imageUrl': imageUrl,
      'creatorId': creatorId,
      'categoryId': categoryId,
      'category': category?.toJson(),
      'options': options.map((e) => e.toJson()).toList(),
      'expiresAt': expiresAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'hasVoted': hasVoted,
      'selectedOptionId': selectedOptionId,
      'tags': tags,
      'boostEnabled': boostEnabled,
      'boostPrice': boostPrice,
      'contestRegistrationOpen': contestRegistrationOpen,
      'registrationSlug': registrationSlug,
      'codePrefix': codePrefix,
      'contestants': contestants.map((e) => e.toJson()).toList(),
    };
  }

  Vote copyWith({
    String? id,
    String? title,
    String? description,
    String? type,
    String? status,
    bool? isAnonymous,
    bool? isFeatured,
    bool? allowMultiple,
    int? totalVotes,
    int? viewCount,
    int? shareCount,
    String? imageUrl,
    String? creatorId,
    String? categoryId,
    Category? category,
    List<VoteOption>? options,
    DateTime? expiresAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? hasVoted,
    String? selectedOptionId,
    List<String>? tags,
    bool? boostEnabled,
    double? boostPrice,
    bool? contestRegistrationOpen,
    String? registrationSlug,
    String? codePrefix,
    List<Contestant>? contestants,
  }) {
    return Vote(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      isFeatured: isFeatured ?? this.isFeatured,
      allowMultiple: allowMultiple ?? this.allowMultiple,
      totalVotes: totalVotes ?? this.totalVotes,
      viewCount: viewCount ?? this.viewCount,
      shareCount: shareCount ?? this.shareCount,
      imageUrl: imageUrl ?? this.imageUrl,
      creatorId: creatorId ?? this.creatorId,
      categoryId: categoryId ?? this.categoryId,
      category: category ?? this.category,
      options: options ?? this.options,
      expiresAt: expiresAt ?? this.expiresAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      hasVoted: hasVoted ?? this.hasVoted,
      selectedOptionId: selectedOptionId ?? this.selectedOptionId,
      tags: tags ?? this.tags,
      boostEnabled: boostEnabled ?? this.boostEnabled,
      boostPrice: boostPrice ?? this.boostPrice,
      contestRegistrationOpen: contestRegistrationOpen ?? this.contestRegistrationOpen,
      registrationSlug: registrationSlug ?? this.registrationSlug,
      codePrefix: codePrefix ?? this.codePrefix,
      contestants: contestants ?? this.contestants,
    );
  }

  bool get isExpired =>
      expiresAt != null && expiresAt!.isBefore(DateTime.now());
  bool get isActive => status == 'active' && !isExpired;

  Duration get timeRemaining =>
      expiresAt?.difference(DateTime.now()) ?? Duration.zero;

  String get timeRemainingText {
    if (expiresAt == null) return 'No expiry';
    final remaining = timeRemaining;
    if (remaining.isNegative) return 'Imekwisha';
    if (remaining.inDays > 0) return 'Siku ${remaining.inDays} zimebaki';
    if (remaining.inHours > 0) return 'Saa ${remaining.inHours} zimebaki';
    return 'Dakika ${remaining.inMinutes} zimebaki';
  }
}
