import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/notification.dart';
import '../core/network/api_client.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

class NotificationsState {
  final List<AppNotification> notifications;
  final bool isLoading;
  final String? error;

  const NotificationsState({
    this.notifications = const [],
    this.isLoading = false,
    this.error,
  });

  NotificationsState copyWith({
    List<AppNotification>? notifications,
    bool? isLoading,
    String? error,
  }) {
    return NotificationsState(
      notifications: notifications ?? this.notifications,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  int get unreadCount => notifications.where((n) => !n.isRead).length;
}

class NotificationsNotifier extends StateNotifier<NotificationsState> {
  final ApiClient _apiClient;

  NotificationsNotifier(this._apiClient) : super(const NotificationsState()) {
    load();
  }

  Future<void> load() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.notifications,
      );
      final notifications = (response['data'] as List<dynamic>)
          .map((e) => AppNotification.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(notifications: notifications, isLoading: false);
    } catch (_) {
      final now = DateTime.now();
      state = state.copyWith(
        isLoading: false,
        notifications: [
          AppNotification(id: '1', type: 'new_vote', title: 'Kura mpya ya Michezo', body: 'Mchezaji Bora wa Yanga SC - piga kura sasa!', createdAt: now.subtract(const Duration(minutes: 30))),
          AppNotification(id: '2', type: 'vote_result', title: 'Matokeo ya kura', body: 'Kura ya Muziki Bora imekwisha - angalia matokeo', isRead: true, createdAt: now.subtract(const Duration(hours: 2))),
          AppNotification(id: '3', type: 'badge', title: 'Tuzo mpya!', body: 'Umepata tuzo ya "Mzalendo" - hongera!', entityType: 'badge', entityId: 'b2', createdAt: now.subtract(const Duration(hours: 5))),
          AppNotification(id: '4', type: 'streak', title: 'Streak ya siku 7!', body: 'Endelea hivyo - siku 7 mfululizo', isRead: true, createdAt: now.subtract(const Duration(days: 1))),
          AppNotification(id: '5', type: 'new_rating', title: 'Kipimo kipya', body: 'Uber Tanzania - toa maoni yako', entityType: 'rating', entityId: '3', createdAt: now.subtract(const Duration(days: 1))),
        ],
      );
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _apiClient.patch(ApiConstants.notificationById(id), data: {'isRead': true});
    } catch (_) {}
    final updated = state.notifications.map((n) {
      if (n.id == id) return n.copyWith(isRead: true);
      return n;
    }).toList();
    state = state.copyWith(notifications: updated);
  }

  Future<void> markAllAsRead() async {
    try {
      await _apiClient.post(ApiConstants.notificationsMarkAllRead);
    } catch (_) {}
    final updated = state.notifications.map((n) => n.copyWith(isRead: true)).toList();
    state = state.copyWith(notifications: updated);
  }

  void dismiss(String id) {
    final updated = state.notifications.where((n) => n.id != id).toList();
    state = state.copyWith(notifications: updated);
  }

  Future<void> refresh() async => await load();
}

final notificationsProvider =
    StateNotifierProvider<NotificationsNotifier, NotificationsState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return NotificationsNotifier(apiClient);
});
