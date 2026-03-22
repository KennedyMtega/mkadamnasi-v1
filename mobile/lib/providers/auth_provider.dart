import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exceptions.dart';
import '../core/storage/local_storage.dart';
import '../core/constants/api_constants.dart';

class AuthState {
  final User? user;
  final bool isLoading;
  final bool isAuthenticated;
  final bool isAnonymous;
  final String? error;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.isAuthenticated = false,
    this.isAnonymous = true,
    this.error,
  });

  AuthState copyWith({
    User? user,
    bool? isLoading,
    bool? isAuthenticated,
    bool? isAnonymous,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiClient _apiClient;
  final LocalStorage _storage;

  AuthNotifier(this._apiClient, this._storage) : super(const AuthState()) {
    _initAuth();
  }

  Future<void> _initAuth() async {
    state = state.copyWith(isLoading: true);
    try {
      final token = await _storage.getToken();
      if (token != null && token.isNotEmpty) {
        await _fetchProfile();
      } else {
        // Continue as anonymous
        state = state.copyWith(
          isLoading: false,
          isAnonymous: true,
          isAuthenticated: false,
        );
      }
    } catch (_) {
      state = state.copyWith(isLoading: false, isAnonymous: true);
    }
  }

  Future<void> _fetchProfile() async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.userProfile,
      );
      final user = User.fromJson(response);
      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isAnonymous: false,
        isLoading: false,
        error: null,
      );
    } on ApiException catch (e) {
      if (e.isUnauthorized) {
        await _storage.clearAuth();
      }
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: false,
        isAnonymous: true,
        error: e.message,
      );
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.post<Map<String, dynamic>>(
        ApiConstants.authLogin,
        data: {'email': email, 'password': password},
      );

      final token = response['token'] as String;
      final refreshToken = response['refreshToken'] as String?;
      await _storage.setToken(token);
      if (refreshToken != null) {
        await _storage.setRefreshToken(refreshToken);
      }

      final user = User.fromJson(response['user'] as Map<String, dynamic>);
      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isAnonymous: false,
        isLoading: false,
      );
    } on ApiException catch (e) {
      state = state.copyWith(isLoading: false, error: e.message);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'An unexpected error occurred',
      );
    }
  }

  Future<void> register({
    required String email,
    required String password,
    String? name,
    String? username,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.post<Map<String, dynamic>>(
        ApiConstants.authRegister,
        data: {
          'email': email,
          'password': password,
          if (name != null) 'name': name,
          if (username != null) 'username': username,
        },
      );

      final token = response['token'] as String;
      final refreshToken = response['refreshToken'] as String?;
      await _storage.setToken(token);
      if (refreshToken != null) {
        await _storage.setRefreshToken(refreshToken);
      }

      final user = User.fromJson(response['user'] as Map<String, dynamic>);
      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isAnonymous: false,
        isLoading: false,
      );
    } on ApiException catch (e) {
      state = state.copyWith(isLoading: false, error: e.message);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'An unexpected error occurred',
      );
    }
  }

  Future<void> continueAnonymously() async {
    state = state.copyWith(
      isAuthenticated: false,
      isAnonymous: true,
      isLoading: false,
    );
  }

  Future<void> logout() async {
    try {
      await _apiClient.post(ApiConstants.authLogout);
    } catch (_) {
      // Ignore logout API errors
    }
    await _storage.clearAuth();
    state = const AuthState(isAnonymous: true);
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

final localStorageProvider = Provider<LocalStorage>((ref) {
  return LocalStorage();
});

final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(localStorageProvider);
  return ApiClient(storage);
});

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final storage = ref.watch(localStorageProvider);
  return AuthNotifier(apiClient, storage);
});
