class Badge {
  final String id;
  final String name;
  final String? nameSwahili;
  final String description;
  final String? descriptionSwahili;
  final String iconUrl;
  final String tier;
  final String category;
  final int requiredPoints;
  final bool isEarned;
  final DateTime? earnedAt;
  final double progress;
  final DateTime createdAt;

  const Badge({
    required this.id,
    required this.name,
    this.nameSwahili,
    required this.description,
    this.descriptionSwahili,
    this.iconUrl = '',
    this.tier = 'bronze',
    this.category = 'general',
    this.requiredPoints = 0,
    this.isEarned = false,
    this.earnedAt,
    this.progress = 0.0,
    required this.createdAt,
  });

  factory Badge.fromJson(Map<String, dynamic> json) {
    return Badge(
      id: json['id'] as String,
      name: json['name'] as String,
      nameSwahili: json['nameSwahili'] as String?,
      description: json['description'] as String? ?? '',
      descriptionSwahili: json['descriptionSwahili'] as String?,
      iconUrl: json['iconUrl'] as String? ?? '',
      tier: json['tier'] as String? ?? 'bronze',
      category: json['category'] as String? ?? 'general',
      requiredPoints: json['requiredPoints'] as int? ?? 0,
      isEarned: json['isEarned'] as bool? ?? false,
      earnedAt: json['earnedAt'] != null
          ? DateTime.parse(json['earnedAt'] as String)
          : null,
      progress: (json['progress'] as num?)?.toDouble() ?? 0.0,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameSwahili': nameSwahili,
      'description': description,
      'descriptionSwahili': descriptionSwahili,
      'iconUrl': iconUrl,
      'tier': tier,
      'category': category,
      'requiredPoints': requiredPoints,
      'isEarned': isEarned,
      'earnedAt': earnedAt?.toIso8601String(),
      'progress': progress,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  Badge copyWith({
    String? id,
    String? name,
    String? nameSwahili,
    String? description,
    String? descriptionSwahili,
    String? iconUrl,
    String? tier,
    String? category,
    int? requiredPoints,
    bool? isEarned,
    DateTime? earnedAt,
    double? progress,
    DateTime? createdAt,
  }) {
    return Badge(
      id: id ?? this.id,
      name: name ?? this.name,
      nameSwahili: nameSwahili ?? this.nameSwahili,
      description: description ?? this.description,
      descriptionSwahili: descriptionSwahili ?? this.descriptionSwahili,
      iconUrl: iconUrl ?? this.iconUrl,
      tier: tier ?? this.tier,
      category: category ?? this.category,
      requiredPoints: requiredPoints ?? this.requiredPoints,
      isEarned: isEarned ?? this.isEarned,
      earnedAt: earnedAt ?? this.earnedAt,
      progress: progress ?? this.progress,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  String get displayName => nameSwahili ?? name;
}
