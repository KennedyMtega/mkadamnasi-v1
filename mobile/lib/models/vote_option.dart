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
      label: json['label'] as String,
      imageUrl: json['imageUrl'] as String?,
      voteCount: json['voteCount'] as int? ?? 0,
      percentage: (json['percentage'] as num?)?.toDouble() ?? 0.0,
      voteId: json['voteId'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
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
