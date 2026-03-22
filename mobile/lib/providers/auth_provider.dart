import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_profile.dart';

class AuthState {
  final UserProfile? user;
  final bool isLoading;
  final bool isAuthenticated;
  final String? error;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.isAuthenticated = false,
    this.error,
  });

  AuthState copyWith({
    UserProfile? user,
    bool? isLoading,
    bool? isAuthenticated,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  Future<void> login(String emailOrPhone, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    await Future.delayed(const Duration(seconds: 1));
    state = state.copyWith(
      isLoading: false,
      isAuthenticated: true,
      user: const UserProfile(
        id: 'u1',
        username: 'Mtumiaji001',
        email: 'mtumiaji@mkadamnasi.co.tz',
        level: 5,
        points: 2450,
        totalVotes: 47,
        totalRatings: 23,
        streak: 7,
        referralCode: 'MKD-ABC123',
        referralCount: 3,
        badges: [
          Badge(id: 'b1', name: 'Mwanzo', description: 'Kura ya kwanza', iconEmoji: 'star', isEarned: true, progress: 1.0),
          Badge(id: 'b2', name: 'Mzalendo', description: 'Kura 10 za siasa', iconEmoji: 'flag', isEarned: true, progress: 1.0),
          Badge(id: 'b3', name: 'Mhakiki', description: 'Vipimo 25', iconEmoji: 'search', isEarned: false, progress: 0.6),
          Badge(id: 'b4', name: 'Mshawishi', description: 'Referral 10', iconEmoji: 'people', isEarned: false, progress: 0.3),
          Badge(id: 'b5', name: 'Moto', description: 'Streak ya siku 30', iconEmoji: 'fire', isEarned: false, progress: 0.23),
        ],
      ),
    );
  }

  Future<void> register(String username, String email, String phone, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    await Future.delayed(const Duration(seconds: 1));
    state = state.copyWith(isLoading: false, isAuthenticated: true);
  }

  void logout() {
    state = const AuthState();
  }

  void continueAsGuest() {
    state = state.copyWith(isAuthenticated: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
