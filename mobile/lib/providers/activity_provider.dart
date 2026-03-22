import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/activity.dart';

class ActivityState {
  final List<ActivityItem> activities;
  final bool isLoading;

  const ActivityState({this.activities = const [], this.isLoading = false});

  ActivityState copyWith({List<ActivityItem>? activities, bool? isLoading}) {
    return ActivityState(
      activities: activities ?? this.activities,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class ActivityNotifier extends StateNotifier<ActivityState> {
  ActivityNotifier() : super(const ActivityState()) {
    load();
  }

  Future<void> load() async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(milliseconds: 500));
    state = state.copyWith(
      isLoading: false,
      activities: [
        ActivityItem(id: '1', type: 'vote_cast', title: 'Umepiga kura', description: 'Mchezaji Bora wa Simba SC 2026', createdAt: DateTime.now().subtract(const Duration(hours: 1))),
        ActivityItem(id: '2', type: 'rating_given', title: 'Umetoa kipimo', description: 'Serengeti Premium Lager - Nyota 4', createdAt: DateTime.now().subtract(const Duration(hours: 3))),
        ActivityItem(id: '3', type: 'badge_earned', title: 'Tuzo mpya!', description: 'Umepata tuzo ya "Mwanzo"', createdAt: DateTime.now().subtract(const Duration(days: 1))),
        ActivityItem(id: '4', type: 'level_up', title: 'Level Up!', description: 'Umepanda hadi Level 5', createdAt: DateTime.now().subtract(const Duration(days: 2))),
        ActivityItem(id: '5', type: 'vote_cast', title: 'Umepiga kura', description: 'Muziki Bora wa Bongo Fleva 2026', createdAt: DateTime.now().subtract(const Duration(days: 2))),
      ],
    );
  }
}

final activityProvider = StateNotifierProvider<ActivityNotifier, ActivityState>((ref) {
  return ActivityNotifier();
});
