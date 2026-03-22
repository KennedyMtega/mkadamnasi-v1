enum ActivityType { voteCast, ratingGiven, badgeEarned, levelUp }

class Activity {
  final String id;
  final ActivityType type;
  final String title;
  final String description;
  final DateTime timestamp;

  const Activity({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.timestamp,
  });
}
