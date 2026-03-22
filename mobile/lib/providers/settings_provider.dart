import 'package:flutter_riverpod/flutter_riverpod.dart';

class SettingsState {
  final String language;
  final bool isDarkMode;
  final bool notificationsEnabled;

  const SettingsState({
    this.language = 'sw',
    this.isDarkMode = false,
    this.notificationsEnabled = true,
  });

  SettingsState copyWith({String? language, bool? isDarkMode, bool? notificationsEnabled}) {
    return SettingsState(
      language: language ?? this.language,
      isDarkMode: isDarkMode ?? this.isDarkMode,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
    );
  }
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier() : super(const SettingsState());

  void toggleLanguage() {
    state = state.copyWith(language: state.language == 'sw' ? 'en' : 'sw');
  }

  void toggleDarkMode() {
    state = state.copyWith(isDarkMode: !state.isDarkMode);
  }

  void toggleNotifications() {
    state = state.copyWith(notificationsEnabled: !state.notificationsEnabled);
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  return SettingsNotifier();
});
