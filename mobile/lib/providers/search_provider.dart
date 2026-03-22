import 'package:flutter_riverpod/flutter_riverpod.dart';

enum SearchFilter { all, votes, ratings }

class SearchState {
  final String query;
  final SearchFilter filter;
  final List<String> recentSearches;
  final bool isSearching;
  final List<dynamic> results;

  const SearchState({
    this.query = '',
    this.filter = SearchFilter.all,
    this.recentSearches = const ['Simba SC', 'Bongo Fleva', 'Dar es Salaam', 'Vodacom'],
    this.isSearching = false,
    this.results = const [],
  });

  SearchState copyWith({
    String? query,
    SearchFilter? filter,
    List<String>? recentSearches,
    bool? isSearching,
    List<dynamic>? results,
  }) {
    return SearchState(
      query: query ?? this.query,
      filter: filter ?? this.filter,
      recentSearches: recentSearches ?? this.recentSearches,
      isSearching: isSearching ?? this.isSearching,
      results: results ?? this.results,
    );
  }
}

class SearchNotifier extends StateNotifier<SearchState> {
  SearchNotifier() : super(const SearchState());

  void setQuery(String query) {
    state = state.copyWith(query: query);
    if (query.isNotEmpty) {
      search();
    } else {
      state = state.copyWith(results: [], isSearching: false);
    }
  }

  void setFilter(SearchFilter filter) {
    state = state.copyWith(filter: filter);
    if (state.query.isNotEmpty) search();
  }

  Future<void> search() async {
    state = state.copyWith(isSearching: true);
    await Future.delayed(const Duration(milliseconds: 300));
    state = state.copyWith(isSearching: false, results: []);
  }

  void addRecentSearch(String query) {
    if (query.isEmpty) return;
    final updated = [query, ...state.recentSearches.where((s) => s != query)].take(10).toList();
    state = state.copyWith(recentSearches: updated);
  }

  void clearRecentSearches() {
    state = state.copyWith(recentSearches: []);
  }
}

final searchProvider = StateNotifierProvider<SearchNotifier, SearchState>((ref) {
  return SearchNotifier();
});
