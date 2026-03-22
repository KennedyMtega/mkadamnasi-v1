import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../core/network/api_client.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

class ProfileStats {
  final int totalVotes;
  final int totalRatings;
  final int totalPolls;
  final int reputationScore;
  final int currentStreak;
  final int longestStreak;
  final int badgesEarned;
  final int referralCount;
  final int level;
  final double levelProgress;

  const ProfileStats({
    this.totalVotes = 0,
    this.totalRatings = 0,
    this.totalPolls = 0,
    this.reputationScore = 0,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.badgesEarned = 0,
    this.referralCount = 0,
    this.level = 1,
    this.levelProgress = 0.0,
  });

  factory ProfileStats.fromJson(Map<String, dynamic> json) {
    return ProfileStats(
      totalVotes: json['totalVotes'] as int? ?? 0,
      totalRatings: json['totalRatings'] as int? ?? 0,
      totalPolls: json['totalPolls'] as int? ?? 0,
      reputationScore: json['reputationScore'] as int? ?? 0,
      currentStreak: json['currentStreak'] as int? ?? 0,
      longestStreak: json['longestStreak'] as int? ?? 0,
      badgesEarned: json['badgesEarned'] as int? ?? 0,
      referralCount: json['referralCount'] as int? ?? 0,
      level: json['level'] as int? ?? 1,
      levelProgress: (json['levelProgress'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class ProfileState {
  final User? user;
  final ProfileStats stats;
  final bool isLoading;
  final String? error;

  const ProfileState({
    this.user,
    this.stats = const ProfileStats(),
    this.isLoading = false,
    this.error,
  });

  ProfileState copyWith({
    User? user,
    ProfileStats? stats,
    bool? isLoading,
    String? error,
  }) {
    return ProfileState(
      user: user ?? this.user,
      stats: stats ?? this.stats,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class ProfileNotifier extends StateNotifier<ProfileState> {
  final ApiClient _apiClient;

  ProfileNotifier(this._apiClient) : super(const ProfileState());

  Future<void> loadProfile() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.userProfile,
      );
      final user = User.fromJson(response);
      state = state.copyWith(user: user, isLoading: false);
    } catch (_) {
      state = state.copyWith(
        isLoading: false,
        user: User(
          id: 'anonymous',
          anonymousId: 'anon-001',
          name: 'Mtumiaji',
          reputationScore: 2450,
          totalVotes: 47,
          totalRatings: 23,
          totalPolls: 5,
          createdAt: DateTime.now().subtract(const Duration(days: 60)),
          updatedAt: DateTime.now(),
        ),
      );
    }
  }

  Future<void> loadStats() async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.userStats,
      );
      final stats = ProfileStats.fromJson(response);
      state = state.copyWith(stats: stats);
    } catch (_) {
      state = state.copyWith(
        stats: const ProfileStats(
          totalVotes: 47,
          totalRatings: 23,
          totalPolls: 5,
          reputationScore: 2450,
          currentStreak: 7,
          longestStreak: 14,
          badgesEarned: 2,
          referralCount: 3,
          level: 5,
          levelProgress: 0.65,
        ),
      );
    }
  }

  Future<void> updateProfile({
    String? name,
    String? username,
    String? avatarUrl,
  }) async {
    try {
      final response = await _apiClient.patch<Map<String, dynamic>>(
        ApiConstants.userProfile,
        data: {
          if (name != null) 'name': name,
          if (username != null) 'username': username,
          if (avatarUrl != null) 'avatarUrl': avatarUrl,
        },
      );
      final user = User.fromJson(response);
      state = state.copyWith(user: user);
    } catch (_) {
      // Keep current state on error
    }
  }

  Future<void> refresh() async {
    await loadProfile();
    await loadStats();
  }
}

final profileProvider =
    StateNotifierProvider<ProfileNotifier, ProfileState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ProfileNotifier(apiClient);
});
