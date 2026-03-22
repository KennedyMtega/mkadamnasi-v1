class ApiConstants {
  ApiConstants._();

  static const baseUrl = 'https://mkadamnasi.vercel.app/api';

  // Auth
  static const auth = '/auth';
  static const authLogin = '/auth/login';
  static const authRegister = '/auth/register';
  static const authLogout = '/auth/logout';
  static const authAnonymous = '/auth/anonymous';
  static const authRefresh = '/auth/refresh';

  // Votes
  static const votes = '/votes';
  static String voteById(String id) => '/votes/$id';
  static String castVote(String id) => '/votes/$id/cast';
  static const voteTrending = '/votes/trending';
  static const voteFeatured = '/votes/featured';

  // Ratings
  static const ratings = '/ratings';
  static String ratingById(String id) => '/ratings/$id';
  static String submitRating(String id) => '/ratings/$id/submit';
  static const ratingTop = '/ratings/top';

  // Categories
  static const categories = '/categories';
  static String categoryById(String id) => '/categories/$id';

  // Search
  static const search = '/search';

  // Badges
  static const badges = '/badges';
  static String badgeById(String id) => '/badges/$id';

  // Leaderboard
  static const leaderboard = '/leaderboard';

  // Activity
  static const activity = '/activity';

  // Notifications
  static const notifications = '/notifications';
  static String notificationById(String id) => '/notifications/$id';
  static const notificationsMarkAllRead = '/notifications/mark-all-read';

  // Referrals
  static const referrals = '/referrals';
  static const referralGenerate = '/referrals/generate';

  // Stats
  static const stats = '/stats';

  // Users
  static const users = '/users';
  static String userById(String id) => '/users/$id';
  static const userProfile = '/users/profile';
  static const userStats = '/users/stats';

  // Timeouts
  static const connectionTimeout = Duration(seconds: 30);
  static const receiveTimeout = Duration(seconds: 30);
  static const sendTimeout = Duration(seconds: 30);
}
