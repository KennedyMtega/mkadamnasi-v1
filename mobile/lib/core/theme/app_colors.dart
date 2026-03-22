import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary
  static const brandOrange = Color(0xFFFF6B35);
  static const darkOrange = Color(0xFFE85A2A);
  static const lightOrange = Color(0xFFFFF4EE);

  // Neutral
  static const deepNavy = Color(0xFF1A2332);
  static const darkGray = Color(0xFF4A5568);
  static const mediumGray = Color(0xFF9CA3AF);
  static const lightGray = Color(0xFFE5E7EB);
  static const offWhite = Color(0xFFF8F9FA);
  static const white = Color(0xFFFFFFFF);

  // Semantic
  static const successGreen = Color(0xFF10B981);
  static const warningYellow = Color(0xFFF59E0B);
  static const errorRed = Color(0xFFEF4444);
  static const infoBlue = Color(0xFF3B82F6);

  // Rating colors
  static const rating5 = Color(0xFF10B981);
  static const rating4 = Color(0xFF34D399);
  static const rating3 = Color(0xFFF59E0B);
  static const rating2 = Color(0xFFF97316);
  static const rating1 = Color(0xFFEF4444);

  // Dark mode variants
  static const darkBackground = Color(0xFF0F1419);
  static const darkSurface = Color(0xFF1E2630);
  static const darkCard = Color(0xFF252D38);
  static const darkBorder = Color(0xFF374151);
  static const darkTextPrimary = Color(0xFFF9FAFB);
  static const darkTextSecondary = Color(0xFF9CA3AF);

  static Color ratingColor(int rating) {
    switch (rating) {
      case 5:
        return rating5;
      case 4:
        return rating4;
      case 3:
        return rating3;
      case 2:
        return rating2;
      case 1:
        return rating1;
      default:
        return mediumGray;
    }
  }
}
