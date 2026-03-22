import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/votes_provider.dart';
import '../../providers/ratings_provider.dart';
import '../../providers/notifications_provider.dart';
import '../../widgets/mkd_loading.dart';
import '../../widgets/mkd_error_state.dart';
import '../../widgets/mkd_section_header.dart';
import 'widgets/category_chips.dart';
import 'widgets/featured_poll_card.dart';
import 'widgets/trending_vote_card.dart';
import 'widgets/top_rating_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final votesState = ref.watch(votesProvider);
    final ratingsState = ref.watch(ratingsProvider);
    final notifState = ref.watch(notificationsProvider);

    return Scaffold(
      backgroundColor: AppColors.offWhite,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.brandOrange,
          onRefresh: () async {
            await ref.read(votesProvider.notifier).refresh();
            await ref.read(ratingsProvider.notifier).refresh();
          },
          child: CustomScrollView(
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Habari! 👋',
                              style: AppTypography.h1,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Piga kura, kadiria, shiriki maoni yako',
                              style: AppTypography.body,
                            ),
                          ],
                        ),
                      ),
                      // Notification bell
                      Stack(
                        children: [
                          IconButton(
                            onPressed: () {
                              Navigator.pushNamed(context, '/notifications');
                            },
                            icon: const Icon(
                              Icons.notifications_outlined,
                              color: AppColors.deepNavy,
                              size: 28,
                            ),
                          ),
                          if (notifState.unreadCount > 0)
                            Positioned(
                              right: 8,
                              top: 8,
                              child: Container(
                                padding: const EdgeInsets.all(4),
                                decoration: const BoxDecoration(
                                  color: AppColors.errorRed,
                                  shape: BoxShape.circle,
                                ),
                                child: Text(
                                  '${notifState.unreadCount}',
                                  style: AppTypography.caption.copyWith(
                                    color: AppColors.white,
                                    fontSize: 9,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Search bar
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
                  child: GestureDetector(
                    onTap: () => Navigator.pushNamed(context, '/search'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                      child: Row(
                        children: [
                          const Icon(Icons.search_rounded, color: AppColors.mediumGray, size: 22),
                          const SizedBox(width: 12),
                          Text(
                            'Tafuta kura, vipimo...',
                            style: AppTypography.body.copyWith(color: AppColors.mediumGray),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Category chips
              const SliverToBoxAdapter(
                child: CategoryChips(),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 20)),

              // Content
              if (votesState.isLoading && ratingsState.isLoading)
                const SliverFillRemaining(
                  child: MkdLoading(message: 'Inapakia...'),
                )
              else if (votesState.error != null)
                SliverFillRemaining(
                  child: MkdErrorState(
                    message: votesState.error!,
                    onRetry: () => ref.read(votesProvider.notifier).refresh(),
                  ),
                )
              else ...[
                // Kura Zinazovuma (Trending Votes)
                SliverToBoxAdapter(
                  child: MkdSectionHeader(
                    title: 'Kura Zinazovuma',
                    actionLabel: 'Zote',
                    onAction: () => Navigator.pushNamed(context, '/trending'),
                  ),
                ),
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 230,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: ref.read(votesProvider.notifier).trendingVotes.length,
                      itemBuilder: (context, index) {
                        final vote = ref.read(votesProvider.notifier).trendingVotes[index];
                        return FeaturedPollCard(
                          vote: vote,
                          onTap: () => Navigator.pushNamed(context, '/vote-detail', arguments: vote.id),
                        );
                      },
                    ),
                  ),
                ),

                const SliverToBoxAdapter(child: SizedBox(height: 20)),

                // Vipimo Bora (Top Ratings)
                SliverToBoxAdapter(
                  child: MkdSectionHeader(
                    title: 'Vipimo Bora',
                    actionLabel: 'Zote',
                    onAction: () => Navigator.pushNamed(context, '/trending'),
                  ),
                ),
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 190,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: ref.read(ratingsProvider.notifier).topRatings.length,
                      itemBuilder: (context, index) {
                        final rating = ref.read(ratingsProvider.notifier).topRatings[index];
                        return TopRatingCard(
                          rating: rating,
                          onTap: () => Navigator.pushNamed(context, '/rating-detail', arguments: rating.id),
                        );
                      },
                    ),
                  ),
                ),

                const SliverToBoxAdapter(child: SizedBox(height: 20)),

                // Kura Mpya (New Votes) - vertical list
                SliverToBoxAdapter(
                  child: MkdSectionHeader(
                    title: 'Kura Mpya',
                    actionLabel: 'Zote',
                    onAction: () => Navigator.pushNamed(context, '/trending'),
                  ),
                ),
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 140,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: ref.read(votesProvider.notifier).newVotes.length,
                      itemBuilder: (context, index) {
                        final vote = ref.read(votesProvider.notifier).newVotes[index];
                        return TrendingVoteCard(
                          vote: vote,
                          onTap: () => Navigator.pushNamed(context, '/vote-detail', arguments: vote.id),
                        );
                      },
                    ),
                  ),
                ),

                // New Votes vertical list
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final vote = ref.read(votesProvider.notifier).newVotes[index];
                      return _NewVoteListItem(
                        vote: vote,
                        onTap: () => Navigator.pushNamed(context, '/vote-detail', arguments: vote.id),
                      );
                    },
                    childCount: ref.read(votesProvider.notifier).newVotes.length,
                  ),
                ),

                const SliverToBoxAdapter(child: SizedBox(height: 100)),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _NewVoteListItem extends StatelessWidget {
  final dynamic vote;
  final VoidCallback? onTap;

  const _NewVoteListItem({required this.vote, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.lightGray),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.brandOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.how_to_vote_rounded, color: AppColors.brandOrange, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    vote.title,
                    style: AppTypography.buttonSm.copyWith(color: AppColors.deepNavy),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text(vote.category, style: AppTypography.caption),
                      const SizedBox(width: 8),
                      Container(
                        width: 3,
                        height: 3,
                        decoration: const BoxDecoration(
                          color: AppColors.mediumGray,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text('Kura ${vote.totalVotes}', style: AppTypography.caption),
                    ],
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: AppColors.mediumGray),
          ],
        ),
      ),
    );
  }
}
