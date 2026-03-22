import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/vote.dart';
import '../models/contestant.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exceptions.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

final _now = DateTime.now();

final _sampleContests = [
  Vote(
    id: 'c1',
    title: 'Miss Tanzania 2026',
    description: 'Piga kura kumchagua Miss Tanzania mwaka huu',
    type: 'contest',
    imageUrl: null,
    totalVotes: 4520,
    isFeatured: true,
    boostEnabled: true,
    boostPrice: 500.0,
    contestRegistrationOpen: true,
    registrationSlug: 'miss-tanzania-2026',
    codePrefix: 'MT',
    contestants: [
      Contestant(
        id: 'ct1',
        voteId: 'c1',
        optionId: 'co1',
        code: 'MT001',
        fullName: 'Amina Juma',
        bio: 'Mwanafunzi wa Chuo Kikuu cha Dar es Salaam',
        registeredBy: 'creator',
        isApproved: true,
        voteCount: 1580,
        percentage: 34.9,
        rank: 1,
        createdAt: _now.subtract(const Duration(days: 5)),
        updatedAt: _now,
      ),
      Contestant(
        id: 'ct2',
        voteId: 'c1',
        optionId: 'co2',
        code: 'MT002',
        fullName: 'Fatma Hassan',
        bio: 'Mfanyabiashara kutoka Arusha',
        registeredBy: 'creator',
        isApproved: true,
        voteCount: 1240,
        percentage: 27.4,
        rank: 2,
        createdAt: _now.subtract(const Duration(days: 5)),
        updatedAt: _now,
      ),
      Contestant(
        id: 'ct3',
        voteId: 'c1',
        optionId: 'co3',
        code: 'MT003',
        fullName: 'Grace Mwakasege',
        bio: 'Daktari kutoka Mbeya',
        registeredBy: 'self',
        isApproved: true,
        voteCount: 950,
        percentage: 21.0,
        rank: 3,
        createdAt: _now.subtract(const Duration(days: 4)),
        updatedAt: _now,
      ),
      Contestant(
        id: 'ct4',
        voteId: 'c1',
        optionId: 'co4',
        code: 'MT004',
        fullName: 'Rehema Kimaro',
        bio: 'Mwalimu kutoka Dodoma',
        registeredBy: 'creator',
        isApproved: true,
        voteCount: 750,
        percentage: 16.6,
        rank: 4,
        createdAt: _now.subtract(const Duration(days: 5)),
        updatedAt: _now,
      ),
    ],
    createdAt: _now.subtract(const Duration(days: 7)),
    updatedAt: _now,
    expiresAt: _now.add(const Duration(days: 14)),
  ),
  Vote(
    id: 'c2',
    title: 'Bongo Star Search 2026',
    description: 'Piga kura kwa msanii unaempenda zaidi',
    type: 'contest',
    imageUrl: null,
    totalVotes: 8900,
    isFeatured: true,
    boostEnabled: true,
    boostPrice: 1000.0,
    contestRegistrationOpen: false,
    codePrefix: 'BSS',
    contestants: [
      Contestant(
        id: 'ct5',
        voteId: 'c2',
        optionId: 'co5',
        code: 'BSS001',
        fullName: 'John Magufuli Jr.',
        bio: 'Mwimbaji wa R&B kutoka Dar',
        registeredBy: 'creator',
        isApproved: true,
        voteCount: 3200,
        percentage: 36.0,
        rank: 1,
        createdAt: _now.subtract(const Duration(days: 10)),
        updatedAt: _now,
      ),
      Contestant(
        id: 'ct6',
        voteId: 'c2',
        optionId: 'co6',
        code: 'BSS002',
        fullName: 'Saida Karoli',
        bio: 'Mwimbaji wa nyimbo za asili',
        registeredBy: 'creator',
        isApproved: true,
        voteCount: 2800,
        percentage: 31.5,
        rank: 2,
        createdAt: _now.subtract(const Duration(days: 10)),
        updatedAt: _now,
      ),
      Contestant(
        id: 'ct7',
        voteId: 'c2',
        optionId: 'co7',
        code: 'BSS003',
        fullName: 'Kelvin Mwamba',
        bio: 'Rapper kutoka Mwanza',
        registeredBy: 'self',
        isApproved: true,
        voteCount: 2900,
        percentage: 32.6,
        rank: 3,
        createdAt: _now.subtract(const Duration(days: 9)),
        updatedAt: _now,
      ),
    ],
    createdAt: _now.subtract(const Duration(days: 14)),
    updatedAt: _now,
    expiresAt: _now.add(const Duration(days: 7)),
  ),
];

class ContestsState {
  final List<Vote> contests;
  final Vote? selectedContest;
  final bool isLoading;
  final bool isVoting;
  final bool isRegistering;
  final String? error;
  final String? votedContestantCode;

  const ContestsState({
    this.contests = const [],
    this.selectedContest,
    this.isLoading = false,
    this.isVoting = false,
    this.isRegistering = false,
    this.error,
    this.votedContestantCode,
  });

  ContestsState copyWith({
    List<Vote>? contests,
    Vote? selectedContest,
    bool? isLoading,
    bool? isVoting,
    bool? isRegistering,
    String? error,
    String? votedContestantCode,
  }) {
    return ContestsState(
      contests: contests ?? this.contests,
      selectedContest: selectedContest ?? this.selectedContest,
      isLoading: isLoading ?? this.isLoading,
      isVoting: isVoting ?? this.isVoting,
      isRegistering: isRegistering ?? this.isRegistering,
      error: error,
      votedContestantCode: votedContestantCode ?? this.votedContestantCode,
    );
  }
}

class ContestsNotifier extends StateNotifier<ContestsState> {
  final ApiClient _apiClient;

  ContestsNotifier(this._apiClient) : super(const ContestsState()) {
    fetchContests();
  }

  Future<void> fetchContests() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.contests,
        queryParameters: {'page': 1, 'limit': 20},
      );
      final contests = (response['data'] as List<dynamic>)
          .map((e) => Vote.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(
        contests: contests,
        isLoading: false,
      );
    } on ApiException catch (e) {
      state = state.copyWith(
        contests: _sampleContests,
        isLoading: false,
        error: e.message,
      );
    } catch (_) {
      state = state.copyWith(
        contests: _sampleContests,
        isLoading: false,
      );
    }
  }

  Future<Vote?> fetchContestDetail(String id) async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.contestById(id),
      );
      final contest = Vote.fromJson(response);
      state = state.copyWith(selectedContest: contest);
      return contest;
    } catch (_) {
      // Try local
      try {
        final contest = state.contests.firstWhere((c) => c.id == id);
        state = state.copyWith(selectedContest: contest);
        return contest;
      } catch (_) {
        return null;
      }
    }
  }

  Future<bool> voteForContestant(
    String contestId, {
    String? optionId,
    String? code,
  }) async {
    state = state.copyWith(isVoting: true, error: null);
    try {
      await _apiClient.post(
        ApiConstants.contestVote(contestId),
        data: {
          if (optionId != null) 'optionId': optionId,
          if (code != null) 'code': code,
        },
      );
      // Update local state
      final updatedContests = state.contests.map((c) {
        if (c.id == contestId) {
          return c.copyWith(
            hasVoted: true,
            selectedOptionId: optionId,
            totalVotes: c.totalVotes + 1,
          );
        }
        return c;
      }).toList();
      state = state.copyWith(
        contests: updatedContests,
        isVoting: false,
        votedContestantCode: code,
      );
      // Refresh detail if selected
      if (state.selectedContest?.id == contestId) {
        await fetchContestDetail(contestId);
      }
      return true;
    } on ApiException catch (e) {
      state = state.copyWith(isVoting: false, error: e.message);
      return false;
    } catch (_) {
      state = state.copyWith(isVoting: false, error: 'Imeshindikana kupiga kura');
      return false;
    }
  }

  Future<Map<String, dynamic>?> registerForContest(
    String contestId,
    Map<String, dynamic> data,
  ) async {
    state = state.copyWith(isRegistering: true, error: null);
    try {
      final response = await _apiClient.post<Map<String, dynamic>>(
        ApiConstants.contestRegister(contestId),
        data: data,
      );
      state = state.copyWith(isRegistering: false);
      // Refresh contest detail
      await fetchContestDetail(contestId);
      return response;
    } on ApiException catch (e) {
      state = state.copyWith(isRegistering: false, error: e.message);
      return null;
    } catch (_) {
      state = state.copyWith(isRegistering: false, error: 'Usajili umeshindikana');
      return null;
    }
  }

  Future<void> refresh() async {
    await fetchContests();
  }

  Vote? contestById(String id) {
    try {
      return state.contests.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }
}

final contestsProvider =
    StateNotifierProvider<ContestsNotifier, ContestsState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ContestsNotifier(apiClient);
});

final contestDetailProvider =
    FutureProvider.family<Vote?, String>((ref, id) async {
  final notifier = ref.watch(contestsProvider.notifier);
  return notifier.fetchContestDetail(id);
});
