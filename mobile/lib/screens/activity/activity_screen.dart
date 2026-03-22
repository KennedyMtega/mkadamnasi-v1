import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/activity_provider.dart';
import '../../providers/notifications_provider.dart';
import '../../widgets/mkd_loading.dart';
import '../../widgets/mkd_empty_state.dart';

class ActivityScreen extends ConsumerWidget {
  const ActivityScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: AppColors.offWhite,
        appBar: AppBar(
          backgroundColor: AppColors.white,
          elevation: 0,
          title: Text('Shughuli', style: AppTypography.h3),
          centerTitle: true,
          bottom: TabBar(
            labelColor: AppColors.brandOrange,
            unselectedLabelColor: AppColors.mediumGray,
            indicatorColor: AppColors.brandOrange,
            indicatorWeight: 3,
            labelStyle: AppTypography.buttonSm,
            tabs: const [
              Tab(text: 'Shughuli Zangu'),
              Tab(text: 'Arifa'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _ActivityTab(),
            _NotificationsTab(),
          ],
        ),
      ),
    );
  }
}

class _ActivityTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(activityProvider);

    if (state.isLoading) return const MkdLoading(message: 'Inapakia...');
    if (state.activities.isEmpty) {
      return const MkdEmptyState(
        icon: Icons.history_rounded,
        title: 'Hakuna shughuli bado',
        subtitle: 'Shughuli zako zitaonekana hapa',
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: state.activities.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final activity = state.activities[index];
        return _ActivityItemTile(activity: activity);
      },
    );
  }
}

class _ActivityItemTile extends StatelessWidget {
  final dynamic activity;

  const _ActivityItemTile({required this.activity});

  IconData _iconForType(String type) {
    switch (type) {
      case 'vote_cast': return Icons.how_to_vote_rounded;
      case 'rating_given': return Icons.star_rounded;
      case 'badge_earned': return Icons.emoji_events_rounded;
      case 'level_up': return Icons.trending_up_rounded;
      default: return Icons.circle;
    }
  }

  Color _colorForType(String type) {
    switch (type) {
      case 'vote_cast': return AppColors.brandOrange;
      case 'rating_given': return AppColors.warningYellow;
      case 'badge_earned': return AppColors.successGreen;
      case 'level_up': return AppColors.infoBlue;
      default: return AppColors.mediumGray;
    }
  }

  String _timeAgo(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 60) return 'Dakika ${diff.inMinutes} zilizopita';
    if (diff.inHours < 24) return 'Saa ${diff.inHours} zilizopita';
    return 'Siku ${diff.inDays} zilizopita';
  }

  @override
  Widget build(BuildContext context) {
    final color = _colorForType(activity.type);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.lightGray),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(_iconForType(activity.type), color: color, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(activity.title, style: AppTypography.buttonSm.copyWith(color: AppColors.deepNavy)),
                const SizedBox(height: 2),
                Text(activity.description ?? '', style: AppTypography.bodySm, maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(_timeAgo(activity.createdAt), style: AppTypography.caption),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NotificationsTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(notificationsProvider);

    if (state.isLoading) return const MkdLoading(message: 'Inapakia...');
    if (state.notifications.isEmpty) {
      return const MkdEmptyState(
        icon: Icons.notifications_off_rounded,
        title: 'Hakuna arifa',
        subtitle: 'Arifa zako zitaonekana hapa',
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: state.notifications.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final notif = state.notifications[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: notif.isRead ? AppColors.white : AppColors.lightOrange,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: notif.isRead ? AppColors.lightGray : AppColors.brandOrange.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  color: notif.isRead ? Colors.transparent : AppColors.brandOrange,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(notif.title, style: AppTypography.buttonSm.copyWith(color: AppColors.deepNavy)),
                    const SizedBox(height: 2),
                    Text(notif.body, style: AppTypography.bodySm, maxLines: 2, overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
