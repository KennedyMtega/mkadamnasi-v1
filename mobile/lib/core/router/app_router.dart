import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../screens/home/home_screen.dart';
import '../../screens/search/search_screen.dart';
import '../../screens/create/create_screen.dart';
import '../../screens/activity/activity_screen.dart';
import '../../screens/profile/profile_screen.dart';
import '../../screens/vote_detail/vote_detail_screen.dart';
import '../../screens/rating_detail/rating_detail_screen.dart';
import '../../screens/category/category_screen.dart';
import '../../screens/auth/login_screen.dart';
import '../../screens/auth/register_screen.dart';
import '../../screens/settings/settings_screen.dart';
import '../../screens/notifications/notifications_screen.dart';
import '../../screens/badges/badges_screen.dart';
import '../../screens/leaderboard/leaderboard_screen.dart';
import '../../screens/trending/trending_screen.dart';
import '../../screens/referral/referral_screen.dart';
import '../../widgets/mkd_bottom_nav.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'root');
final GlobalKey<NavigatorState> _shellNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'shell');

class AppRouter {
  AppRouter._();

  static final router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    debugLogDiagnostics: true,
    routes: [
      // Shell route for bottom navigation
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) {
          return ScaffoldWithBottomNav(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            name: 'home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HomeScreen(),
            ),
          ),
          GoRoute(
            path: '/search',
            name: 'search',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: SearchScreen(),
            ),
          ),
          GoRoute(
            path: '/create',
            name: 'create',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: CreateScreen(),
            ),
          ),
          GoRoute(
            path: '/activity',
            name: 'activity',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ActivityScreen(),
            ),
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ProfileScreen(),
            ),
          ),
        ],
      ),
      // Full screen routes (outside shell)
      GoRoute(
        path: '/vote/:id',
        name: 'voteDetail',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => VoteDetailScreen(
          voteId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/rating/:id',
        name: 'ratingDetail',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => RatingDetailScreen(
          ratingId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/category/:id',
        name: 'category',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => CategoryScreen(
          categoryId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/auth/login',
        name: 'login',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        name: 'register',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/notifications',
        name: 'notifications',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/badges',
        name: 'badges',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const BadgesScreen(),
      ),
      GoRoute(
        path: '/leaderboard',
        name: 'leaderboard',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const LeaderboardScreen(),
      ),
      GoRoute(
        path: '/trending',
        name: 'trending',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const TrendingScreen(),
      ),
      GoRoute(
        path: '/referral',
        name: 'referral',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const ReferralScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Color(0xFFFF6B35),
            ),
            const SizedBox(height: 16),
            Text(
              'Ukurasa haupatikani',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('Rudi Nyumbani'),
            ),
          ],
        ),
      ),
    ),
  );
}
