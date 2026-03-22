/// Push notification service for Firebase Cloud Messaging.
///
/// Handles FCM token registration, foreground message display,
/// and background/terminated message tap navigation.
///
/// NOTE: Requires firebase_messaging and firebase_core packages.
/// Add to pubspec.yaml when ready:
///   firebase_core: ^3.0.0
///   firebase_messaging: ^15.0.0
class PushService {
  static PushService? _instance;
  static PushService get instance => _instance ??= PushService._();
  PushService._();

  String? _token;

  /// The current FCM registration token, if available.
  String? get token => _token;

  /// Initialize push notifications.
  /// Call this in main.dart after Firebase.initializeApp().
  Future<void> initialize() async {
    // TODO: Uncomment when firebase packages are added
    // final messaging = FirebaseMessaging.instance;
    //
    // // Request permission (iOS requires explicit permission)
    // final settings = await messaging.requestPermission(
    //   alert: true,
    //   badge: true,
    //   sound: true,
    // );
    //
    // if (settings.authorizationStatus == AuthorizationStatus.authorized) {
    //   _token = await messaging.getToken();
    //   if (_token != null) {
    //     await _registerToken(_token!);
    //   }
    //
    //   // Listen for token refresh (happens periodically)
    //   messaging.onTokenRefresh.listen(_registerToken);
    //
    //   // Handle foreground messages
    //   FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    //
    //   // Handle background/terminated message tap
    //   FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageTap);
    // }
  }

  /// Register or refresh the FCM token with the backend.
  Future<void> _registerToken(String token) async {
    _token = token;
    // TODO: POST to /api/notifications/push with { "token": token }
    // Use ApiClient instance to send the request
  }

  /// Handle a message received while the app is in the foreground.
  void _handleForegroundMessage(dynamic message) {
    // TODO: Show local notification or in-app banner
    // Consider using flutter_local_notifications package
  }

  /// Handle a tap on a notification when the app was in background/terminated.
  void _handleMessageTap(dynamic message) {
    // TODO: Navigate to relevant screen based on message data
    // e.g., data['type'] == 'vote' → navigate to /vote/{data['targetId']}
    // e.g., data['type'] == 'badge' → navigate to /badges
  }
}
