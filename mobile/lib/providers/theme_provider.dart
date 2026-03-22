import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/storage/local_storage.dart';
import 'auth_provider.dart';

class ThemeNotifier extends StateNotifier<ThemeMode> {
  final LocalStorage _storage;

  ThemeNotifier(this._storage) : super(ThemeMode.system) {
    _loadTheme();
  }

  void _loadTheme() {
    final stored = _storage.getThemeMode();
    if (stored != null) {
      switch (stored) {
        case 'light':
          state = ThemeMode.light;
          break;
        case 'dark':
          state = ThemeMode.dark;
          break;
        default:
          state = ThemeMode.system;
      }
    }
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    state = mode;
    await _storage.setThemeMode(mode.name);
  }

  Future<void> toggleTheme() async {
    if (state == ThemeMode.light) {
      await setThemeMode(ThemeMode.dark);
    } else {
      await setThemeMode(ThemeMode.light);
    }
  }

  bool get isDark => state == ThemeMode.dark;
  bool get isLight => state == ThemeMode.light;
  bool get isSystem => state == ThemeMode.system;
}

final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  final storage = ref.watch(localStorageProvider);
  return ThemeNotifier(storage);
});
