import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/vote.dart';
import '../models/vote_option.dart';
import '../models/category.dart';

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
  return VotesNotifier();
});
