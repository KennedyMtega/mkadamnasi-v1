import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/vote.dart';

final _sampleVotes = [
  Vote(
    id: '1',
    title: 'Mchezaji Bora wa Simba SC 2026',
    description: 'Piga kura kwa mchezaji bora wa msimu huu',
    category: 'Michezo',
    creatorName: 'Anonymous',
    isAnonymous: true,
    type: VoteType.poll,
    options: [
      const VoteOption(id: 'o1', label: 'John Bocco', count: 342, percentage: 45.2),
      const VoteOption(id: 'o2', label: 'Clatous Chama', count: 256, percentage: 33.8),
      const VoteOption(id: 'o3', label: 'Luis Miquissone', count: 159, percentage: 21.0),
    ],
    totalVotes: 757,
    createdAt: DateTime.now().subtract(const Duration(days: 2)),
    endDate: DateTime.now().add(const Duration(days: 5)),
  ),
  Vote(
    id: '2',
    title: 'Muziki Bora wa Bongo Fleva 2026',
    description: 'Wimbo upi unaongoza mwaka huu?',
    category: 'Burudani',
    creatorName: 'Anonymous',
    type: VoteType.poll,
    options: [
      const VoteOption(id: 'o4', label: 'Diamond - Jeje', count: 1200, percentage: 40.0),
      const VoteOption(id: 'o5', label: 'Harmonize - Matatizo', count: 900, percentage: 30.0),
      const VoteOption(id: 'o6', label: 'Zuchu - Moyo', count: 900, percentage: 30.0),
    ],
    totalVotes: 3000,
    createdAt: DateTime.now().subtract(const Duration(days: 1)),
    endDate: DateTime.now().add(const Duration(days: 7)),
  ),
  Vote(
    id: '3',
    title: 'Huduma Bora ya Simu Tanzania',
    description: 'Mtandao upi una huduma bora zaidi?',
    category: 'Teknolojia',
    type: VoteType.versus,
    options: [
      const VoteOption(id: 'o7', label: 'Vodacom', count: 520, percentage: 52.0),
      const VoteOption(id: 'o8', label: 'Airtel', count: 300, percentage: 30.0),
      const VoteOption(id: 'o9', label: 'Tigo', count: 180, percentage: 18.0),
    ],
    totalVotes: 1000,
    createdAt: DateTime.now().subtract(const Duration(hours: 6)),
    endDate: DateTime.now().add(const Duration(days: 3)),
  ),
  Vote(
    id: '4',
    title: 'Chakula Bora cha Mitaani Dar',
    description: 'Chakula kipi cha mitaani unapenda zaidi?',
    category: 'Chakula',
    type: VoteType.poll,
    options: [
      const VoteOption(id: 'o10', label: 'Chips Mayai', count: 450, percentage: 35.0),
      const VoteOption(id: 'o11', label: 'Mishkaki', count: 380, percentage: 29.5),
      const VoteOption(id: 'o12', label: 'Zanzibar Pizza', count: 290, percentage: 22.5),
      const VoteOption(id: 'o13', label: 'Vitumbua', count: 168, percentage: 13.0),
    ],
    totalVotes: 1288,
    createdAt: DateTime.now().subtract(const Duration(days: 3)),
    endDate: DateTime.now().add(const Duration(days: 10)),
  ),
];

class VotesState {
  final List<Vote> votes;
  final bool isLoading;
  final String? error;

  const VotesState({
    this.votes = const [],
    this.isLoading = false,
    this.error,
  });

  VotesState copyWith({
    List<Vote>? votes,
    bool? isLoading,
    String? error,
  }) {
    return VotesState(
      votes: votes ?? this.votes,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class VotesNotifier extends StateNotifier<VotesState> {
  VotesNotifier() : super(const VotesState()) {
    loadVotes();
  }

  Future<void> loadVotes() async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(milliseconds: 500));
    state = state.copyWith(votes: _sampleVotes, isLoading: false);
  }

  Future<void> refresh() async {
    await loadVotes();
  }

  List<Vote> get trendingVotes {
    final sorted = [...state.votes];
    sorted.sort((a, b) => b.totalVotes.compareTo(a.totalVotes));
    return sorted;
  }

  List<Vote> get newVotes {
    final sorted = [...state.votes];
    sorted.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return sorted;
  }

  List<Vote> votesByCategory(String category) {
    return state.votes.where((v) => v.category == category).toList();
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
  return VotesNotifier();
});
