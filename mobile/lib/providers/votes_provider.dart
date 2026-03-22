import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/vote.dart';
import '../models/vote_option.dart';
import '../models/category.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exceptions.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

final _now = DateTime.now();

final _sampleVotes = [
  Vote(
    id: '1',
    title: 'Mchezaji Bora wa Simba SC 2026',
    description: 'Piga kura kwa mchezaji bora wa msimu huu',
    categoryId: 'michezo',
    category: Category(id: 'michezo', name: 'Michezo', nameSwahili: 'Michezo', createdAt: _now, updatedAt: _now),
    isAnonymous: true,
    type: 'standard',
    options: [
      const VoteOption(id: 'o1', label: 'John Bocco', voteCount: 342, percentage: 45.2, voteId: '1'),
      const VoteOption(id: 'o2', label: 'Clatous Chama', voteCount: 256, percentage: 33.8, voteId: '1'),
      const VoteOption(id: 'o3', label: 'Luis Miquissone', voteCount: 159, percentage: 21.0, voteId: '1'),
    ],
    totalVotes: 757,
    isFeatured: true,
    createdAt: _now.subtract(const Duration(days: 2)),
    updatedAt: _now,
    expiresAt: _now.add(const Duration(days: 5)),
  ),
  Vote(
    id: '2',
    title: 'Muziki Bora wa Bongo Fleva 2026',
    description: 'Wimbo upi unaongoza mwaka huu?',
    categoryId: 'burudani',
    category: Category(id: 'burudani', name: 'Burudani', nameSwahili: 'Burudani', createdAt: _now, updatedAt: _now),
    type: 'standard',
    options: [
      const VoteOption(id: 'o4', label: 'Diamond - Jeje', voteCount: 1200, percentage: 40.0, voteId: '2'),
      const VoteOption(id: 'o5', label: 'Harmonize - Matatizo', voteCount: 900, percentage: 30.0, voteId: '2'),
      const VoteOption(id: 'o6', label: 'Zuchu - Moyo', voteCount: 900, percentage: 30.0, voteId: '2'),
    ],
    totalVotes: 3000,
    createdAt: _now.subtract(const Duration(days: 1)),
    updatedAt: _now,
    expiresAt: _now.add(const Duration(days: 7)),
  ),
  Vote(
    id: '3',
    title: 'Huduma Bora ya Simu Tanzania',
    description: 'Mtandao upi una huduma bora zaidi?',
    categoryId: 'teknolojia',
    category: Category(id: 'teknolojia', name: 'Teknolojia', nameSwahili: 'Teknolojia', createdAt: _now, updatedAt: _now),
    type: 'versus',
    options: [
      const VoteOption(id: 'o7', label: 'Vodacom', voteCount: 520, percentage: 52.0, voteId: '3'),
      const VoteOption(id: 'o8', label: 'Airtel', voteCount: 300, percentage: 30.0, voteId: '3'),
      const VoteOption(id: 'o9', label: 'Tigo', voteCount: 180, percentage: 18.0, voteId: '3'),
    ],
    totalVotes: 1000,
    createdAt: _now.subtract(const Duration(hours: 6)),
    updatedAt: _now,
    expiresAt: _now.add(const Duration(days: 3)),
  ),
  Vote(
    id: '4',
    title: 'Chakula Bora cha Mitaani Dar',
    description: 'Chakula kipi cha mitaani unapenda zaidi?',
    categoryId: 'chakula',
    category: Category(id: 'chakula', name: 'Chakula', nameSwahili: 'Chakula', createdAt: _now, updatedAt: _now),
    type: 'standard',
    options: [
      const VoteOption(id: 'o10', label: 'Chips Mayai', voteCount: 450, percentage: 35.0, voteId: '4'),
      const VoteOption(id: 'o11', label: 'Mishkaki', voteCount: 380, percentage: 29.5, voteId: '4'),
      const VoteOption(id: 'o12', label: 'Zanzibar Pizza', voteCount: 290, percentage: 22.5, voteId: '4'),
      const VoteOption(id: 'o13', label: 'Vitumbua', voteCount: 168, percentage: 13.0, voteId: '4'),
    ],
    totalVotes: 1288,
    createdAt: _now.subtract(const Duration(days: 3)),
    updatedAt: _now,
    expiresAt: _now.add(const Duration(days: 10)),
  ),
];

class VotesState {
  final List<Vote> votes;
  final List<Vote> featuredVotes;
  final List<Vote> trendingVotes;
  final Vote? selectedVote;
  final bool isLoading;
  final bool isLoadingMore;
  final String? error;
  final int currentPage;
  final bool hasMore;

  const VotesState({
    this.votes = const [],
    this.featuredVotes = const [],
    this.trendingVotes = const [],
    this.selectedVote,
    this.isLoading = false,
    this.isLoadingMore = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
  });

  VotesState copyWith({
    List<Vote>? votes,
    List<Vote>? featuredVotes,
    List<Vote>? trendingVotes,
    Vote? selectedVote,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    int? currentPage,
    bool? hasMore,
  }) {
    return VotesState(
      votes: votes ?? this.votes,
      featuredVotes: featuredVotes ?? this.featuredVotes,
      trendingVotes: trendingVotes ?? this.trendingVotes,
      selectedVote: selectedVote ?? this.selectedVote,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

class VotesNotifier extends StateNotifier<VotesState> {
  final ApiClient _apiClient;

  VotesNotifier(this._apiClient) : super(const VotesState()) {
    loadVotes();
  }

  Future<void> loadVotes({String? categoryId}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.votes,
        queryParameters: {
          'page': 1,
          'limit': 20,
          if (categoryId != null) 'categoryId': categoryId,
        },
      );
      final votes = (response['data'] as List<dynamic>)
          .map((e) => Vote.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(
        votes: votes,
        isLoading: false,
        currentPage: 1,
        hasMore: votes.length >= 20,
      );
    } on ApiException catch (e) {
      // Fall back to sample data
      state = state.copyWith(
        votes: _sampleVotes,
        isLoading: false,
        error: e.message,
      );
    } catch (_) {
      state = state.copyWith(
        votes: _sampleVotes,
        isLoading: false,
      );
    }
  }

  Future<void> loadFeatured() async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.voteFeatured,
      );
      final votes = (response['data'] as List<dynamic>)
          .map((e) => Vote.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(featuredVotes: votes);
    } catch (_) {
      state = state.copyWith(
        featuredVotes: _sampleVotes.where((v) => v.isFeatured).toList(),
      );
    }
  }

  Future<void> loadTrending() async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.voteTrending,
      );
      final votes = (response['data'] as List<dynamic>)
          .map((e) => Vote.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(trendingVotes: votes);
    } catch (_) {
      final sorted = [..._sampleVotes];
      sorted.sort((a, b) => b.totalVotes.compareTo(a.totalVotes));
      state = state.copyWith(trendingVotes: sorted);
    }
  }

  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore) return;
    state = state.copyWith(isLoadingMore: true);
    try {
      final nextPage = state.currentPage + 1;
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.votes,
        queryParameters: {'page': nextPage, 'limit': 20},
      );
      final newVotes = (response['data'] as List<dynamic>)
          .map((e) => Vote.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(
        votes: [...state.votes, ...newVotes],
        isLoadingMore: false,
        currentPage: nextPage,
        hasMore: newVotes.length >= 20,
      );
    } catch (_) {
      state = state.copyWith(isLoadingMore: false, hasMore: false);
    }
  }

  Future<void> refresh() async {
    await loadVotes();
    await loadFeatured();
    await loadTrending();
  }

  Future<Vote?> getVoteById(String id) async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.voteById(id),
      );
      final vote = Vote.fromJson(response);
      state = state.copyWith(selectedVote: vote);
      return vote;
    } catch (_) {
      // Try local
      try {
        final vote = state.votes.firstWhere((v) => v.id == id);
        state = state.copyWith(selectedVote: vote);
        return vote;
      } catch (_) {
        return null;
      }
    }
  }

  Future<bool> castVote(String voteId, String optionId) async {
    try {
      await _apiClient.post(
        ApiConstants.castVote(voteId),
        data: {'optionId': optionId},
      );
      // Update local state
      final updatedVotes = state.votes.map((v) {
        if (v.id == voteId) {
          return v.copyWith(
            hasVoted: true,
            selectedOptionId: optionId,
            totalVotes: v.totalVotes + 1,
          );
        }
        return v;
      }).toList();
      state = state.copyWith(votes: updatedVotes);
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<Vote?> createVote({
    required String title,
    String? description,
    required List<String> optionLabels,
    String? categoryId,
    String type = 'standard',
    DateTime? expiresAt,
  }) async {
    try {
      final response = await _apiClient.post<Map<String, dynamic>>(
        ApiConstants.votes,
        data: {
          'title': title,
          'description': description,
          'options': optionLabels.map((l) => {'label': l}).toList(),
          'categoryId': categoryId,
          'type': type,
          'expiresAt': expiresAt?.toIso8601String(),
        },
      );
      final vote = Vote.fromJson(response);
      state = state.copyWith(votes: [vote, ...state.votes]);
      return vote;
    } catch (_) {
      return null;
    }
  }

  List<Vote> votesByCategory(String categoryId) {
    return state.votes.where((v) => v.categoryId == categoryId).toList();
  }

  Vote? voteById(String id) {
    try {
      return state.votes.firstWhere((v) => v.id == id);
    } catch (_) {
      return null;
    }
  }
}

final votesProvider = StateNotifierProvider<VotesNotifier, VotesState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return VotesNotifier(apiClient);
});
