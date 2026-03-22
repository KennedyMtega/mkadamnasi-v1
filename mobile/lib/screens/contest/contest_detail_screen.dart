import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/contests_provider.dart';
import '../../widgets/mkd_loading.dart';
import '../../widgets/mkd_error_state.dart';
import '../../widgets/contestant_card.dart';
import '../../widgets/vote_by_code.dart';

class ContestDetailScreen extends ConsumerStatefulWidget {
  final String contestId;

  const ContestDetailScreen({super.key, required this.contestId});

  @override
  ConsumerState<ContestDetailScreen> createState() =>
      _ContestDetailScreenState();
}

class _ContestDetailScreenState extends ConsumerState<ContestDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(contestsProvider.notifier).fetchContestDetail(widget.contestId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(contestsProvider);
    final contest = state.selectedContest ??
        ref.read(contestsProvider.notifier).contestById(widget.contestId);

    return Scaffold(
      backgroundColor: AppColors.offWhite,
      body: contest == null
          ? state.isLoading
              ? const MkdLoading(message: 'Inapakia mashindano...')
              : MkdErrorState(
                  message: 'Mashindano hayajapatikana',
                  onRetry: () => ref
                      .read(contestsProvider.notifier)
                      .fetchContestDetail(widget.contestId),
                )
          : CustomScrollView(
              slivers: [
                // Cover image hero with gradient
                SliverAppBar(
                  expandedHeight: 220,
                  pinned: true,
                  backgroundColor: AppColors.white,
                  leading: IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.deepNavy.withValues(alpha: 0.4),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.arrow_back_rounded,
                        color: AppColors.white,
                        size: 20,
                      ),
                    ),
                    onPressed: () => Navigator.pop(context),
                  ),
                  actions: [
                    IconButton(
                      icon: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: AppColors.deepNavy.withValues(alpha: 0.4),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.share_rounded,
                          color: AppColors.white,
                          size: 20,
                        ),
                      ),
                      onPressed: () => _showShareSheet(context),
                    ),
                  ],
                  flexibleSpace: FlexibleSpaceBar(
                    background: Stack(
                      fit: StackFit.expand,
                      children: [
                        contest.imageUrl != null
                            ? Image.network(
                                contest.imageUrl!,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  color: AppColors.brandOrange
                                      .withValues(alpha: 0.1),
                                  child: const Center(
                                    child: Icon(
                                      Icons.emoji_events_rounded,
                                      color: AppColors.brandOrange,
                                      size: 64,
                                    ),
                                  ),
                                ),
                              )
                            : Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      AppColors.brandOrange,
                                      AppColors.darkOrange,
                                    ],
                                  ),
                                ),
                                child: const Center(
                                  child: Icon(
                                    Icons.emoji_events_rounded,
                                    color: AppColors.white,
                                    size: 64,
                                  ),
                                ),
                              ),
                        // Gradient overlay
                        Positioned(
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 100,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  AppColors.deepNavy.withValues(alpha: 0.7),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Content
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title
                        Text(contest.title, style: AppTypography.h2),
                        const SizedBox(height: 8),

                        // Description
                        if (contest.description != null &&
                            contest.description!.isNotEmpty)
                          Text(
                            contest.description!,
                            style: AppTypography.bodyLg,
                          ),
                        const SizedBox(height: 16),

                        // Stats row
                        Row(
                          children: [
                            _StatChip(
                              icon: Icons.how_to_vote_rounded,
                              label: 'Kura ${contest.totalVotes}',
                            ),
                            const SizedBox(width: 10),
                            _StatChip(
                              icon: Icons.people_outlined,
                              label:
                                  'Washiriki ${contest.contestants.length}',
                            ),
                            const SizedBox(width: 10),
                            _StatChip(
                              icon: Icons.access_time_rounded,
                              label: contest.timeRemainingText,
                              color: contest.isActive
                                  ? AppColors.successGreen
                                  : AppColors.errorRed,
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Vote by code section
                        VoteByCode(
                          codePrefix: contest.codePrefix,
                          isLoading: state.isVoting,
                          onSubmit: (code) async {
                            return ref
                                .read(contestsProvider.notifier)
                                .voteForContestant(
                                  contest.id,
                                  code: code,
                                );
                          },
                        ),
                        const SizedBox(height: 24),

                        // Leaderboard header
                        Row(
                          children: [
                            const Icon(
                              Icons.leaderboard_rounded,
                              color: AppColors.brandOrange,
                              size: 22,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Orodha ya Washiriki',
                              style: AppTypography.h4,
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                      ],
                    ),
                  ),
                ),

                // Contestants leaderboard
                if (contest.contestants.isNotEmpty)
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final sorted = List.of(contest.contestants)
                            ..sort(
                              (a, b) =>
                                  b.voteCount.compareTo(a.voteCount),
                            );
                          final contestant = sorted[index];
                          final isVoted =
                              contest.selectedOptionId ==
                              contestant.optionId;

                          return ContestantCard(
                            contestant: contestant,
                            isSelected: isVoted,
                            showVoteButton:
                                contest.hasVoted != true &&
                                contest.isActive,
                            isVoting: state.isVoting,
                            onVote: () {
                              ref
                                  .read(contestsProvider.notifier)
                                  .voteForContestant(
                                    contest.id,
                                    optionId: contestant.optionId,
                                    code: contestant.code,
                                  );
                            },
                          );
                        },
                        childCount: contest.contestants.length,
                      ),
                    ),
                  ),

                // Voted confirmation
                if (contest.hasVoted == true)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.successGreen
                              .withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: AppColors.successGreen
                                .withValues(alpha: 0.3),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.check_circle_rounded,
                              color: AppColors.successGreen,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Umeshapiga kura',
                              style: AppTypography.buttonSm.copyWith(
                                color: AppColors.successGreen,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                // Boost button
                if (contest.boostEnabled && contest.isActive)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
                      child: OutlinedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                'Boost inaendelezwa - TSh ${contest.boostPrice?.toStringAsFixed(0) ?? "0"}',
                                style: AppTypography.bodySm.copyWith(
                                  color: AppColors.white,
                                ),
                              ),
                              backgroundColor: AppColors.infoBlue,
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          );
                        },
                        icon: const Icon(
                          Icons.bolt_rounded,
                          color: AppColors.warningYellow,
                        ),
                        label: Text(
                          'Ongeza Kura (Boost) - TSh ${contest.boostPrice?.toStringAsFixed(0) ?? "0"}',
                          style: AppTypography.buttonSm.copyWith(
                            color: AppColors.brandOrange,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.brandOrange),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                            vertical: 14,
                            horizontal: 16,
                          ),
                        ),
                      ),
                    ),
                  ),

                // Registration link
                if (contest.contestRegistrationOpen)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
                      child: SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton.icon(
                          onPressed: () => context.push(
                            '/contest/${contest.id}/register',
                          ),
                          icon: const Icon(
                            Icons.person_add_rounded,
                            color: AppColors.white,
                          ),
                          label: Text(
                            'Jiandikishe Kushiriki',
                            style: AppTypography.button.copyWith(
                              color: AppColors.white,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.successGreen,
                            foregroundColor: AppColors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            elevation: 0,
                          ),
                        ),
                      ),
                    ),
                  ),

                const SliverToBoxAdapter(
                  child: SizedBox(height: 40),
                ),
              ],
            ),
    );
  }

  void _showShareSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.lightGray,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Text('Shiriki Mashindano', style: AppTypography.h3),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _ShareOption(
                    icon: Icons.copy_rounded,
                    label: 'Nakili',
                    onTap: () => Navigator.pop(context),
                  ),
                  _ShareOption(
                    icon: Icons.message_rounded,
                    label: 'Ujumbe',
                    onTap: () => Navigator.pop(context),
                  ),
                  _ShareOption(
                    icon: Icons.share_rounded,
                    label: 'Shiriki',
                    onTap: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _StatChip({
    required this.icon,
    required this.label,
    this.color = AppColors.mediumGray,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.lightGray),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: AppTypography.caption.copyWith(color: color),
          ),
        ],
      ),
    );
  }
}

class _ShareOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ShareOption({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: const BoxDecoration(
              color: AppColors.offWhite,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.brandOrange, size: 24),
          ),
          const SizedBox(height: 8),
          Text(label, style: AppTypography.caption),
        ],
      ),
    );
  }
}
