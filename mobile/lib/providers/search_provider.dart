import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/search_result.dart';
import '../core/network/api_client.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

enum SearchFilter { all, votes, ratings, categories }

class SearchState {
  final String query;
  final SearchFilter filter;
  final List<String> recentSearches;
  final bool isSearching;
  final List<SearchResult> results;
  final int totalCount;
  final bool hasMore;
  final String? error;

  const SearchState({
    this.query = '',
    this.filter = SearchFilter.all,
    this.recentSearches = const [
      'Simba SC',
      'Bongo Fleva',
      'Dar es Salaam',
      'Vodacom',
    ],
    this.isSearching = false,
    this.results = const [],
    this.totalCount = 0,
    this.hasMore = false,
    this.error,
  });

  SearchState copyWith({
    String? query,
    SearchFilter? filter,
    List<String>? recentSearches,
    bool? isSearching,
    List<SearchResult>? results,
    int? totalCount,
    bool? hasMore,
    String? error,
  }) {
    return SearchState(
      query: query ?? this.query,
      filter: filter ?? this.filter,
      recentSearches: recentSearches ?? this.recentSearches,
      isSearching: isSearching ?? this.isSearching,
      results: results ?? this.results,
      totalCount: totalCount ?? this.totalCount,
      hasMore: hasMore ?? this.hasMore,
      error: error,
    );
  }
}

class SearchNotifier extends StateNotifier<SearchState> {
  final ApiClient _apiClient;

  SearchNotifier(this._apiClient) : super(const SearchState());

  void setQuery(String query) {
    state = state.copyWith(query: query);
    if (query.isNotEmpty && query.length >= 2) {
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
    state = state.copyWith(isSearching: true, error: null);
    try {
      final filterType = state.filter == SearchFilter.all
          ? null
          : state.filter.name;
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.search,
        queryParameters: {
          'q': state.query,
          if (filterType != null) 'type': filterType,
          'page': 1,
          'limit': 20,
        },
      );
      final searchResults = SearchResults.fromJson(response);
      state = state.copyWith(
        isSearching: false,
        results: searchResults.items,
        totalCount: searchResults.totalCount,
        hasMore: searchResults.hasMore,
      );
    } catch (_) {
      state = state.copyWith(
        isSearching: false,
        results: [],
        error: 'Search failed. Please try again.',
      );
    }
  }

  void addRecentSearch(String query) {
    if (query.isEmpty) return;
    final updated = [
      query,
      ...state.recentSearches.where((s) => s != query),
    ].take(10).toList();
    state = state.copyWith(recentSearches: updated);
  }

  void removeRecentSearch(String query) {
    final updated = state.recentSearches.where((s) => s != query).toList();
    state = state.copyWith(recentSearches: updated);
  }

  void clearRecentSearches() {
    state = state.copyWith(recentSearches: []);
  }

  void clear() {
    state = state.copyWith(
      query: '',
      results: [],
      isSearching: false,
      error: null,
    );
  }
}

final searchProvider =
    StateNotifierProvider<SearchNotifier, SearchState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return SearchNotifier(apiClient);
});
