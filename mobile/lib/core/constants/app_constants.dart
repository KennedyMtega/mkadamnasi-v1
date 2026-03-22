class AppConstants {
  AppConstants._();

  // App Info
  static const appName = 'Mkadamnasi';
  static const appTagline = "Tanzania's First Anonymous Rating, Voting & Ranking Platform";
  static const appTaglineSw = 'Jukwaa la Kwanza la Kupiga Kura, Kupima na Kupanga Bila Kujulikana Tanzania';
  static const appVersion = '1.0.0';

  // Storage Keys
  static const tokenKey = 'auth_token';
  static const refreshTokenKey = 'refresh_token';
  static const anonymousIdKey = 'anonymous_id';
  static const themeKey = 'theme_mode';
  static const localeKey = 'locale';
  static const onboardingCompleteKey = 'onboarding_complete';
  static const lastSyncKey = 'last_sync';

  // Pagination
  static const defaultPageSize = 20;
  static const maxPageSize = 50;

  // Validation
  static const minPasswordLength = 8;
  static const maxTitleLength = 200;
  static const maxDescriptionLength = 2000;
  static const maxOptionsCount = 10;
  static const minOptionsCount = 2;
  static const maxRatingScale = 5;

  // Animation Durations
  static const Duration animFast = Duration(milliseconds: 150);
  static const Duration animNormal = Duration(milliseconds: 300);
  static const Duration animSlow = Duration(milliseconds: 500);

  // Debounce
  static const Duration searchDebounce = Duration(milliseconds: 400);

  // Cache
  static const Duration cacheExpiry = Duration(minutes: 5);

  // Swahili Labels
  static const Map<String, String> swahiliLabels = {
    'home': 'Nyumbani',
    'search': 'Tafuta',
    'create': 'Unda',
    'activity': 'Shughuli',
    'profile': 'Wasifu',
    'vote': 'Piga Kura',
    'rating': 'Pima',
    'anonymous': 'Bado Siri',
    'trending': 'Inayovuma',
    'categories': 'Makundi',
    'settings': 'Mipangilio',
    'notifications': 'Arifa',
    'badges': 'Beji',
    'leaderboard': 'Ubao wa Viongozi',
    'referral': 'Mwaliko',
    'login': 'Ingia',
    'register': 'Jisajili',
    'logout': 'Toka',
  };
}
