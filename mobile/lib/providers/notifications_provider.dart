import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_notification.dart';

class NotificationsState {
  final List<AppNotification> notifications;
  final bool isLoading;

  const NotificationsState({this.notifications = const [], this.isLoading = false});

  NotificationsState copyWith({List<AppNotification>? notifications, bool? isLoading}) {
    return NotificationsState(
      notifications: notifications ?? this.notifications,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  int get unreadCount => notifications.where((n) => !n.isRead).length;
}

class NotificationsNotifier extends StateNotifier<NotificationsState> {
  NotificationsNotifier() : super(const NotificationsState()) {
    load();
  }

  Future<void> load() async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(milliseconds: 500));
    state = state.copyWith(
      isLoading: false,
      notifications: [
        AppNotification(id: '1', title: 'Kura mpya ya Michezo', body: 'Mchezaji Bora wa Yanga SC - piga kura sasa!', timestamp: DateTime.now().subtract(const Duration(minutes: 30))),
        AppNotification(id: '2', title: 'Matokeo ya kura', body: 'Kura ya Muziki Bora imekwisha - angalia matokeo', timestamp: DateTime.now().subtract(const Duration(hours: 2)), isRead: true),
        AppNotification(id: '3', title: 'Tuzo mpya', body: 'Umepata tuzo ya "Mzalendo" - hongera!', timestamp: DateTime.now().subtract(const Duration(hours: 5))),
        AppNotification(id: '4', title: 'Streak ya siku 7!', body: 'Endelea hivyo - siku 7 mfululizo', timestamp: DateTime.now().subtract(const Duration(days: 1)), isRead: true),
        AppNotification(id: '5', title: 'Kipimo kipya', body: 'Uber Tanzania - toa maoni yako', timestamp: DateTime.now().subtract(const Duration(days: 1))),
      ],
    );
  }

  void markAsRead(String id) {
    final updated = state.notifications.map((n) {
      if (n.id == id) {
        return AppNotification(id: n.id, title: n.title, body: n.body, timestamp: n.timestamp, isRead: true, actionRoute: n.actionRoute);
      }
      return n;
    }).toList();
    state = state.copyWith(notifications: updated);
  }

  void markAllAsRead() {
    final updated = state.notifications.map((n) {
      return AppNotification(id: n.id, title: n.title, body: n.body, timestamp: n.timestamp, isRead: true, actionRoute: n.actionRoute);
    }).toList();
    state = state.copyWith(notifications: updated);
  }

  void dismiss(String id) {
    final updated = state.notifications.where((n) => n.id != id).toList();
    state = state.copyWith(notifications: updated);
  }
}

final notificationsProvider = StateNotifierProvider<NotificationsNotifier, NotificationsState>((ref) {
  return NotificationsNotifier();
});
