class VoteOption {
  final String id;
  final String label;
  final int count;
  final double percentage;

  const VoteOption({
    required this.id,
    required this.label,
    this.count = 0,
    this.percentage = 0.0,
  });
}

enum VoteType { poll, versus, ranking }

class Vote {
  final String id;
  final String title;
  final String description;
  final String category;
  final String? imageUrl;
  final String creatorName;
  final bool isAnonymous;
  final VoteType type;
  final List<VoteOption> options;
  final int totalVotes;
  final DateTime createdAt;
  final DateTime endDate;
  final bool hasVoted;
  final String? selectedOptionId;

  const Vote({
    required this.id,
    required this.title,
    this.description = '',
    required this.category,
    this.imageUrl,
    this.creatorName = 'Anonymous',
    this.isAnonymous = true,
    this.type = VoteType.poll,
    this.options = const [],
    this.totalVotes = 0,
    required this.createdAt,
    required this.endDate,
    this.hasVoted = false,
    this.selectedOptionId,
  });

  bool get isActive => endDate.isAfter(DateTime.now());

  Duration get timeRemaining => endDate.difference(DateTime.now());

  String get timeRemainingText {
    final remaining = timeRemaining;
    if (remaining.isNegative) return 'Imekwisha';
    if (remaining.inDays > 0) return 'Siku ${remaining.inDays} zimebaki';
    if (remaining.inHours > 0) return 'Saa ${remaining.inHours} zimebaki';
    return 'Dakika ${remaining.inMinutes} zimebaki';
  }
}
