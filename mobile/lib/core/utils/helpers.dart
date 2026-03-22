import 'dart:async';
import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class Helpers {
  Helpers._();

  /// Debounce helper for search and other frequent operations
  static Timer? _debounceTimer;

  static void debounce(
    VoidCallback callback, {
    Duration duration = const Duration(milliseconds: 400),
  }) {
    _debounceTimer?.cancel();
    _debounceTimer = Timer(duration, callback);
  }

  static void cancelDebounce() {
    _debounceTimer?.cancel();
  }

  /// Launch a URL in the browser
  static Future<bool> launchURL(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
    return false;
  }

  /// Share content
  static Future<void> shareContent({
    required String text,
    String? subject,
  }) async {
    await SharePlus.instance.share(
      ShareParams(text: text, subject: subject),
    );
  }

  /// Share a vote link
  static Future<void> shareVote(String voteId, String title) async {
    await shareContent(
      text: 'Check out this vote on Mkadamnasi: $title\nhttps://mkadamnasi.vercel.app/vote/$voteId',
      subject: 'Vote: $title',
    );
  }

  /// Share a rating link
  static Future<void> shareRating(String ratingId, String title) async {
    await shareContent(
      text: 'Check out this rating on Mkadamnasi: $title\nhttps://mkadamnasi.vercel.app/rating/$ratingId',
      subject: 'Rating: $title',
    );
  }

  /// Share referral link
  static Future<void> shareReferral(String code) async {
    await shareContent(
      text: 'Join Mkadamnasi - Tanzania\'s First Anonymous Rating & Voting Platform! Use my referral code: $code\nhttps://mkadamnasi.vercel.app/register?ref=$code',
      subject: 'Join Mkadamnasi!',
    );
  }

  /// Format a number with commas
  static String formatNumber(int number) {
    return number.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (match) => '${match[1]},',
    );
  }

  /// Get greeting based on time of day (in Swahili)
  static String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'Habari za Asubuhi';
    } else if (hour < 17) {
      return 'Habari za Mchana';
    } else {
      return 'Habari za Jioni';
    }
  }

  /// Validate email
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    if (!RegExp(r'^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
      return 'Please enter a valid email';
    }
    return null;
  }

  /// Validate password
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return null;
  }

  /// Validate required field
  static String? validateRequired(String? value, {String field = 'This field'}) {
    if (value == null || value.trim().isEmpty) {
      return '$field is required';
    }
    return null;
  }

  /// Get color for vote percentage
  static Color getPercentageColor(double percentage) {
    if (percentage >= 60) return const Color(0xFF10B981);
    if (percentage >= 40) return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }

  /// Generate initials from a name
  static String getInitials(String name) {
    final words = name.trim().split(RegExp(r'\s+'));
    if (words.isEmpty) return '?';
    if (words.length == 1) return words[0][0].toUpperCase();
    return '${words[0][0]}${words[words.length - 1][0]}'.toUpperCase();
  }
}

/// Debouncer class for more controlled debouncing
class Debouncer {
  final Duration delay;
  Timer? _timer;

  Debouncer({this.delay = const Duration(milliseconds: 400)});

  void run(VoidCallback action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }

  void dispose() {
    _timer?.cancel();
  }
}
