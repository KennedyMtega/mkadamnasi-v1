import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/search_provider.dart';
import '../../providers/votes_provider.dart';
import '../../providers/ratings_provider.dart';
import '../../widgets/mkd_empty_state.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final searchState = ref.watch(searchProvider);
    final votesState = ref.watch(votesProvider);
    final ratingsState = ref.watch(ratingsProvider);

    return Scaffold(
      backgroundColor: AppColors.offWhite,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.deepNavy),
          onPressed: () => Navigator.pop(context),
        ),
        title: TextField(
          controller: _controller,
          focusNode: _focusNode,
          onChanged: (val) => ref.read(searchProvider.notifier).setQuery(val),
          onSubmitted: (val) {
            ref.read(searchProvider.notifier).addRecentSearch(val);
          },
          decoration: InputDecoration(
            hintText: 'Tafuta kura, vipimo...',
            hintStyle: AppTypography.body.copyWith(color: AppColors.mediumGray),
            border: InputBorder.none,
          ),
          style: AppTypography.body.copyWith(color: AppColors.deepNavy),
        ),
        actions: [
          if (_controller.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.close_rounded, color: AppColors.mediumGray),
              onPressed: () {
                _controller.clear();
                ref.read(searchProvider.notifier).setQuery('');
              },
            ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Filter chips
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            color: AppColors.white,
            child: Row(
              children: [
                _FilterChip(
                  label: 'Zote',
                  isSelected: searchState.filter == SearchFilter.all,
                  onTap: () => ref.read(searchProvider.notifier).setFilter(SearchFilter.all),
                ),
                const SizedBox(width: 8),
                _FilterChip(
                  label: 'Kura',
                  isSelected: searchState.filter == SearchFilter.votes,
                  onTap: () => ref.read(searchProvider.notifier).setFilter(SearchFilter.votes),
                ),
                const SizedBox(width: 8),
                _FilterChip(
                  label: 'Vipimo',
                  isSelected: searchState.filter == SearchFilter.ratings,
                  onTap: () => ref.read(searchProvider.notifier).setFilter(SearchFilter.ratings),
                ),
              ],
            ),
          ),

          const Divider(height: 1, color: AppColors.lightGray),

          // Content
          Expanded(
            child: searchState.query.isEmpty
                ? _buildRecentSearches(searchState)
                : searchState.isSearching
                    ? const Center(
                        child: CircularProgressIndicator(color: AppColors.brandOrange),
                      )
                    : _buildSearchResults(votesState, ratingsState, searchState),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSearches(SearchState searchState) {
    if (searchState.recentSearches.isEmpty) {
      return const MkdEmptyState(
        icon: Icons.search_rounded,
        title: 'Tafuta kura na vipimo',
        subtitle: 'Andika neno lolote kutafuta',
      );
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Tafuta za Hivi Karibuni', style: AppTypography.h4),
            GestureDetector(
              onTap: () => ref.read(searchProvider.notifier).clearRecentSearches(),
              child: Text(
                'Futa',
                style: AppTypography.buttonSm.copyWith(color: AppColors.brandOrange),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ...searchState.recentSearches.map(
          (search) => ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.history_rounded, color: AppColors.mediumGray),
            title: Text(search, style: AppTypography.body),
            trailing: const Icon(Icons.north_west_rounded, size: 16, color: AppColors.mediumGray),
            onTap: () {
              _controller.text = search;
              ref.read(searchProvider.notifier).setQuery(search);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSearchResults(VotesState votesState, RatingsState ratingsState, SearchState searchState) {
    final query = searchState.query.toLowerCase();
    final matchingVotes = votesState.votes
        .where((v) => v.title.toLowerCase().contains(query) || v.category.toLowerCase().contains(query))
        .toList();
    final matchingRatings = ratingsState.ratings
        .where((r) => r.title.toLowerCase().contains(query) || r.entityName.toLowerCase().contains(query))
        .toList();

    final showVotes = searchState.filter != SearchFilter.ratings;
    final showRatings = searchState.filter != SearchFilter.votes;

    if ((showVotes && matchingVotes.isEmpty && !showRatings) ||
        (showRatings && matchingRatings.isEmpty && !showVotes) ||
        (matchingVotes.isEmpty && matchingRatings.isEmpty)) {
      return const MkdEmptyState(
        icon: Icons.search_off_rounded,
        title: 'Hakuna matokeo',
        subtitle: 'Jaribu neno lingine',
      );
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        if (showVotes && matchingVotes.isNotEmpty) ...[
          Text('Kura', style: AppTypography.h4),
          const SizedBox(height: 8),
          ...matchingVotes.map((vote) => _SearchResultItem(
                icon: Icons.how_to_vote_rounded,
                iconColor: AppColors.brandOrange,
                title: vote.title,
                subtitle: '${vote.category} - Kura ${vote.totalVotes}',
                onTap: () => Navigator.pushNamed(context, '/vote-detail', arguments: vote.id),
              )),
          const SizedBox(height: 20),
        ],
        if (showRatings && matchingRatings.isNotEmpty) ...[
          Text('Vipimo', style: AppTypography.h4),
          const SizedBox(height: 8),
          ...matchingRatings.map((rating) => _SearchResultItem(
                icon: Icons.star_rounded,
                iconColor: AppColors.warningYellow,
                title: rating.title,
                subtitle: '${rating.category} - ${rating.averageRating.toStringAsFixed(1)} nyota',
                onTap: () => Navigator.pushNamed(context, '/rating-detail', arguments: rating.id),
              )),
        ],
      ],
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.brandOrange : AppColors.offWhite,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? AppColors.brandOrange : AppColors.lightGray),
        ),
        child: Text(
          label,
          style: AppTypography.buttonSm.copyWith(
            color: isSelected ? AppColors.white : AppColors.darkGray,
          ),
        ),
      ),
    );
  }
}

class _SearchResultItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  const _SearchResultItem({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.lightGray),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTypography.buttonSm.copyWith(color: AppColors.deepNavy), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 2),
                  Text(subtitle, style: AppTypography.caption),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: AppColors.mediumGray, size: 20),
          ],
        ),
      ),
    );
  }
}
