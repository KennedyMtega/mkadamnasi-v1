class AppNotification {
  final String id;
  final String type;
  final String title;
  final String body;
  final String? entityId;
  final String? entityType;
  final String? actionUrl;
  final String? userId;
  final bool isRead;
  final Map<String, dynamic>? metadata;
  final DateTime createdAt;

  const AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    this.entityId,
    this.entityType,
    this.actionUrl,
    this.userId,
    this.isRead = false,
    this.metadata,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as String,
      type: json['type'] as String? ?? 'general',
      title: json['title'] as String,
      body: json['body'] as String,
      entityId: json['entityId'] as String?,
      entityType: json['entityType'] as String?,
      actionUrl: json['actionUrl'] as String?,
      userId: json['userId'] as String?,
      isRead: json['isRead'] as bool? ?? false,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'body': body,
      'entityId': entityId,
      'entityType': entityType,
      'actionUrl': actionUrl,
      'userId': userId,
      'isRead': isRead,
      'metadata': metadata,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  AppNotification copyWith({
    String? id,
    String? type,
    String? title,
    String? body,
    String? entityId,
    String? entityType,
    String? actionUrl,
    String? userId,
    bool? isRead,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
  }) {
    return AppNotification(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      body: body ?? this.body,
      entityId: entityId ?? this.entityId,
      entityType: entityType ?? this.entityType,
      actionUrl: actionUrl ?? this.actionUrl,
      userId: userId ?? this.userId,
      isRead: isRead ?? this.isRead,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  String get notificationRoute {
    if (actionUrl != null) return actionUrl!;
    if (entityId != null && entityType != null) {
      switch (entityType) {
        case 'vote':
          return '/vote/$entityId';
        case 'rating':
          return '/rating/$entityId';
        case 'badge':
          return '/badges';
        default:
          return '/notifications';
      }
    }
    return '/notifications';
  }
}
