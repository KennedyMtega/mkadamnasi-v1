class VoteOption {
  final String id;
  final String label;
  final String? imageUrl;
  final int voteCount;
  final double percentage;
  final String voteId;

  const VoteOption({
    required this.id,
    required this.label,
    this.imageUrl,
    this.voteCount = 0,
    this.percentage = 0.0,
    required this.voteId,
  });

  factory VoteOption.fromJson(Map<String, dynamic> json) {
    return VoteOption(
      id: json['id'] as String,
      label: (json['title'] ?? json['label'] ?? '') as String,
      imageUrl: (json['imageUrl'] ?? json['image_url']) as String?,
      voteCount: (json['voteCount'] ?? json['vote_count'] ?? 0) as int,
      percentage: (json['percentage'] as num?)?.toDouble() ?? 0.0,
      voteId: (json['voteId'] ?? json['vote_id'] ?? '') as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': label,
      'label': label,
      'imageUrl': imageUrl,
      'voteCount': voteCount,
      'percentage': percentage,
      'voteId': voteId,
    };
  }

  VoteOption copyWith({
    String? id,
    String? label,
    String? imageUrl,
    int? voteCount,
    double? percentage,
    String? voteId,
  }) {
    return VoteOption(
      id: id ?? this.id,
      label: label ?? this.label,
      imageUrl: imageUrl ?? this.imageUrl,
      voteCount: voteCount ?? this.voteCount,
      percentage: percentage ?? this.percentage,
      voteId: voteId ?? this.voteId,
    );
  }
}
