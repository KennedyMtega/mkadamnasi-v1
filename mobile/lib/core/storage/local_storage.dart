import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import '../constants/app_constants.dart';

class LocalStorage {
  late final SharedPreferences _prefs;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    await _ensureAnonymousId();
  }

  // Ensure anonymous ID exists
  Future<void> _ensureAnonymousId() async {
    final existing = await getAnonymousId();
    if (existing == null || existing.isEmpty) {
      final id = const Uuid().v4();
      await _secureStorage.write(
        key: AppConstants.anonymousIdKey,
        value: id,
      );
    }
  }

  // Auth Token
  Future<String?> getToken() async {
    return await _secureStorage.read(key: AppConstants.tokenKey);
  }

  Future<void> setToken(String token) async {
    await _secureStorage.write(key: AppConstants.tokenKey, value: token);
  }

  // Refresh Token
  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: AppConstants.refreshTokenKey);
  }

  Future<void> setRefreshToken(String token) async {
    await _secureStorage.write(
      key: AppConstants.refreshTokenKey,
      value: token,
    );
  }

  // Anonymous ID
  Future<String?> getAnonymousId() async {
    return await _secureStorage.read(key: AppConstants.anonymousIdKey);
  }

  // Clear auth data
  Future<void> clearAuth() async {
    await _secureStorage.delete(key: AppConstants.tokenKey);
    await _secureStorage.delete(key: AppConstants.refreshTokenKey);
  }

  // Theme Mode
  String? getThemeMode() {
    return _prefs.getString(AppConstants.themeKey);
  }

  Future<void> setThemeMode(String mode) async {
    await _prefs.setString(AppConstants.themeKey, mode);
  }

  // Locale
  String? getLocale() {
    return _prefs.getString(AppConstants.localeKey);
  }

  Future<void> setLocale(String locale) async {
    await _prefs.setString(AppConstants.localeKey, locale);
  }

  // Onboarding
  bool get isOnboardingComplete {
    return _prefs.getBool(AppConstants.onboardingCompleteKey) ?? false;
  }

  Future<void> setOnboardingComplete() async {
    await _prefs.setBool(AppConstants.onboardingCompleteKey, true);
  }

  // Last Sync
  DateTime? get lastSync {
    final ms = _prefs.getInt(AppConstants.lastSyncKey);
    return ms != null ? DateTime.fromMillisecondsSinceEpoch(ms) : null;
  }

  Future<void> setLastSync(DateTime dateTime) async {
    await _prefs.setInt(
      AppConstants.lastSyncKey,
      dateTime.millisecondsSinceEpoch,
    );
  }

  // Generic getters/setters
  Future<void> setString(String key, String value) async {
    await _prefs.setString(key, value);
  }

  String? getString(String key) {
    return _prefs.getString(key);
  }

  Future<void> setBool(String key, bool value) async {
    await _prefs.setBool(key, value);
  }

  bool? getBool(String key) {
    return _prefs.getBool(key);
  }

  Future<void> remove(String key) async {
    await _prefs.remove(key);
  }

  Future<void> clearAll() async {
    await _prefs.clear();
    await _secureStorage.deleteAll();
  }
}
