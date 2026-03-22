class Category {
  final String id;
  final String name;
  final String? nameSwahili;
  final String slug;
  final String? description;
  final String? iconName;
  final String? imageUrl;
  final String? color;
  final int itemCount;
  final int voteCount;
  final int ratingCount;
  final bool isActive;
  final int sortOrder;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Category({
    required this.id,
    required this.name,
    this.nameSwahili,
    this.slug = '',
    this.description,
    this.iconName,
    this.imageUrl,
    this.color,
    this.itemCount = 0,
    this.voteCount = 0,
    this.ratingCount = 0,
    this.isActive = true,
    this.sortOrder = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      nameSwahili: json['nameSwahili'] as String?,
      slug: json['slug'] as String? ?? '',
      description: json['description'] as String?,
      iconName: json['iconName'] as String?,
      imageUrl: json['imageUrl'] as String?,
      color: json['color'] as String?,
      itemCount: json['itemCount'] as int? ?? 0,
      voteCount: json['voteCount'] as int? ?? 0,
      ratingCount: json['ratingCount'] as int? ?? 0,
      isActive: json['isActive'] as bool? ?? true,
      sortOrder: json['sortOrder'] as int? ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameSwahili': nameSwahili,
      'slug': slug,
      'description': description,
      'iconName': iconName,
      'imageUrl': imageUrl,
      'color': color,
      'itemCount': itemCount,
      'voteCount': voteCount,
      'ratingCount': ratingCount,
      'isActive': isActive,
      'sortOrder': sortOrder,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Category copyWith({
    String? id,
    String? name,
    String? nameSwahili,
    String? slug,
    String? description,
    String? iconName,
    String? imageUrl,
    String? color,
    int? itemCount,
    int? voteCount,
    int? ratingCount,
    bool? isActive,
    int? sortOrder,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Category(
      id: id ?? this.id,
      name: name ?? this.name,
      nameSwahili: nameSwahili ?? this.nameSwahili,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      iconName: iconName ?? this.iconName,
      imageUrl: imageUrl ?? this.imageUrl,
      color: color ?? this.color,
      itemCount: itemCount ?? this.itemCount,
      voteCount: voteCount ?? this.voteCount,
      ratingCount: ratingCount ?? this.ratingCount,
      isActive: isActive ?? this.isActive,
      sortOrder: sortOrder ?? this.sortOrder,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  String get displayName => nameSwahili ?? name;
}
