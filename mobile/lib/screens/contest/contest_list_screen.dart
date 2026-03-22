import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/contests_provider.dart';
import '../../widgets/mkd_loading.dart';
import '../../widgets/mkd_empty_state.dart';
import '../../widgets/mkd_error_state.dart';

class ContestListScreen extends ConsumerStatefulWidget {
  const ContestListScreen({super.key});

  @override
  ConsumerState<ContestListScreen> createState() => _ContestListScreenState();
}

class _ContestListScreenState extends ConsumerState<ContestListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(contestsProvider.notifier).fetchContests();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(contestsProvider);

    return Scaffold(
      backgroundColor: AppColors.offWhite,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Text('Mashindano', style: AppTypography.h3),
        centerTitle: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.deepNavy),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: state.isLoading
          ? const MkdLoading(message: 'Inapakia mashindano...')
          : state.error != null && state.contests.isEmpty
              ? MkdErrorState(
                  message: state.error!,
                  onRetry: () =>
                      ref.read(contestsProvider.notifier).fetchContests(),
                )
              : state.contests.isEmpty
                  ? const MkdEmptyState(
                      icon: Icons.emoji_events_outlined,
                      title: 'Hakuna mashindano',
                      subtitle:
                          'Mashindano mapya yataonekana hapa yanapoundwa',
                    )
                  : RefreshIndicator(
                      color: AppColors.brandOrange,
                      onRefresh: () =>
                          ref.read(contestsProvider.notifier).refresh(),
                      child: GridView.builder(
                        padding: const EdgeInsets.all(20),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                          childAspectRatio: 0.75,
                        ),
                        itemCount: state.contests.length,
                        itemBuilder: (context, index) {
                          final contest = state.contests[index];
                          return _ContestGridCard(
                            title: contest.title,
                            imageUrl: contest.imageUrl,
                            totalVotes: contest.totalVotes,
                            contestantCount: contest.contestants.length,
                            timeRemainingText: contest.timeRemainingText,
                            isActive: contest.isActive,
                            onTap: () =>
                                context.push('/contest/${contest.id}'),
                          );
                        },
                      ),
                    ),
    );
  }
}

class _ContestGridCard extends StatelessWidget {
  final String title;
  final String? imageUrl;
  final int totalVotes;
  final int contestantCount;
  final String timeRemainingText;
  final bool isActive;
  final VoidCallback? onTap;

  const _ContestGridCard({
    required this.title,
    this.imageUrl,
    required this.totalVotes,
    required this.contestantCount,
    required this.timeRemainingText,
    required this.isActive,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.lightGray),
          boxShadow: [
            BoxShadow(
              color: AppColors.deepNavy.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover image
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.brandOrange.withValues(alpha: 0.1),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(14),
                  ),
                ),
                child: imageUrl != null
                    ? ClipRRect(
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(14),
                        ),
                        child: Image.network(
                          imageUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Center(
                            child: Icon(
                              Icons.emoji_events_rounded,
                              color: AppColors.brandOrange,
                              size: 36,
                            ),
                          ),
                        ),
                      )
                    : const Center(
                        child: Icon(
                          Icons.emoji_events_rounded,
                          color: AppColors.brandOrange,
                          size: 36,
                        ),
                      ),
              ),
            ),

            // Info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTypography.buttonSm.copyWith(
                        color: AppColors.deepNavy,
                        fontSize: 12,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        const Icon(
                          Icons.how_to_vote_rounded,
                          size: 12,
                          color: AppColors.mediumGray,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '$totalVotes',
                          style: AppTypography.caption,
                        ),
                        const SizedBox(width: 8),
                        const Icon(
                          Icons.people_outlined,
                          size: 12,
                          color: AppColors.mediumGray,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '$contestantCount',
                          style: AppTypography.caption,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: isActive
                            ? AppColors.successGreen.withValues(alpha: 0.1)
                            : AppColors.errorRed.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        timeRemainingText,
                        style: AppTypography.caption.copyWith(
                          color: isActive
                              ? AppColors.successGreen
                              : AppColors.errorRed,
                          fontSize: 9,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
