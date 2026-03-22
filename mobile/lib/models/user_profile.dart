class Badge {
  final String id;
  final String name;
  final String description;
  final String iconEmoji;
  final bool isEarned;
  final double progress;

  const Badge({
    required this.id,
    required this.name,
    required this.description,
    this.iconEmoji = '',
    this.isEarned = false,
    this.progress = 0.0,
  });
}

class UserProfile {
  final String id;
  final String username;
  final String? email;
  final String? phone;
  final String? avatarUrl;
  final int level;
  final int points;
  final int totalVotes;
  final int totalRatings;
  final int streak;
  final List<Badge> badges;
  final String referralCode;
  final int referralCount;

  const UserProfile({
    required this.id,
    required this.username,
    this.email,
    this.phone,
    this.avatarUrl,
    this.level = 1,
    this.points = 0,
    this.totalVotes = 0,
    this.totalRatings = 0,
    this.streak = 0,
    this.badges = const [],
    this.referralCode = '',
    this.referralCount = 0,
  });
}
