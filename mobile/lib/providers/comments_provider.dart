import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/comment.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exceptions.dart';
import '../core/constants/api_constants.dart';
import 'auth_provider.dart';

class CommentsState {
  final List<Comment> comments;
  final int total;
  final bool isLoading;
  final bool isLoadingMore;
  final bool isSubmitting;
  final String? error;
  final bool hasMore;

  const CommentsState({
    this.comments = const [],
    this.total = 0,
    this.isLoading = false,
    this.isLoadingMore = false,
    this.isSubmitting = false,
    this.error,
    this.hasMore = false,
  });

  CommentsState copyWith({
    List<Comment>? comments,
    int? total,
    bool? isLoading,
    bool? isLoadingMore,
    bool? isSubmitting,
    String? error,
    bool? hasMore,
  }) {
    return CommentsState(
      comments: comments ?? this.comments,
      total: total ?? this.total,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: error,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

class CommentsNotifier extends StateNotifier<CommentsState> {
  final ApiClient _apiClient;
  final String targetId;
  final String targetType; // 'vote' or 'rating'
  static const int _limit = 20;
  int _offset = 0;

  CommentsNotifier(this._apiClient, this.targetId, this.targetType)
      : super(const CommentsState()) {
    loadComments();
  }

  Future<void> loadComments() async {
    state = state.copyWith(isLoading: true, error: null);
    _offset = 0;
    try {
      final paramKey = targetType == 'vote' ? 'voteId' : 'ratingId';
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.comments,
        queryParameters: {
          paramKey: targetId,
          'limit': _limit,
          'offset': 0,
        },
      );
      final comments = (response['data'] as List<dynamic>)
          .map((e) => Comment.fromJson(e as Map<String, dynamic>))
          .toList();
      final total = response['total'] as int? ?? 0;
      state = state.copyWith(
        comments: comments,
        total: total,
        isLoading: false,
        hasMore: comments.length < total,
      );
    } on ApiException catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.message,
      );
    } catch (_) {
      state = state.copyWith(
        isLoading: false,
        error: 'Tatizo la kupakia maoni.',
      );
    }
  }

  Future<void> loadMore() async {
    if (state.isLoadingMore || !state.hasMore) return;
    state = state.copyWith(isLoadingMore: true);
    _offset += _limit;
    try {
      final paramKey = targetType == 'vote' ? 'voteId' : 'ratingId';
      final response = await _apiClient.get<Map<String, dynamic>>(
        ApiConstants.comments,
        queryParameters: {
          paramKey: targetId,
          'limit': _limit,
          'offset': _offset,
        },
      );
      final newComments = (response['data'] as List<dynamic>)
          .map((e) => Comment.fromJson(e as Map<String, dynamic>))
          .toList();
      state = state.copyWith(
        comments: [...state.comments, ...newComments],
        isLoadingMore: false,
        hasMore: state.comments.length + newComments.length < state.total,
      );
    } catch (_) {
      state = state.copyWith(isLoadingMore: false, hasMore: false);
    }
  }

  Future<bool> addComment(String content, {String? parentId}) async {
    state = state.copyWith(isSubmitting: true, error: null);
    try {
      final data = <String, dynamic>{
        'content': content,
        'isAnonymous': true,
      };
      if (targetType == 'vote') {
        data['voteId'] = targetId;
      } else {
        data['ratingId'] = targetId;
      }
      if (parentId != null) data['parentId'] = parentId;

      final response = await _apiClient.post<Map<String, dynamic>>(
        ApiConstants.comments,
        data: data,
      );

      final newComment = Comment.fromJson(
        response['data'] as Map<String, dynamic>,
      );

      if (parentId != null) {
        // Add reply to parent
        final updatedComments = state.comments.map((c) {
          if (c.id == parentId) {
            return c.copyWith(replies: [...c.replies, newComment]);
          }
          return c;
        }).toList();
        state = state.copyWith(
          comments: updatedComments,
          isSubmitting: false,
          total: state.total + 1,
        );
      } else {
        state = state.copyWith(
          comments: [newComment, ...state.comments],
          isSubmitting: false,
          total: state.total + 1,
        );
      }
      return true;
    } on ApiException catch (e) {
      state = state.copyWith(isSubmitting: false, error: e.message);
      return false;
    } catch (_) {
      state = state.copyWith(
        isSubmitting: false,
        error: 'Tatizo la kutuma maoni.',
      );
      return false;
    }
  }

  Future<bool> deleteComment(String commentId) async {
    try {
      await _apiClient.delete<Map<String, dynamic>>(
        ApiConstants.commentById(commentId),
      );
      final updatedComments = state.comments
          .where((c) => c.id != commentId)
          .map((c) => c.copyWith(
                replies: c.replies.where((r) => r.id != commentId).toList(),
              ))
          .toList();
      state = state.copyWith(
        comments: updatedComments,
        total: state.total - 1,
      );
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> likeComment(String commentId) async {
    try {
      await _apiClient.patch<Map<String, dynamic>>(
        ApiConstants.commentById(commentId),
        data: {'action': 'like'},
      );
      final updatedComments = state.comments.map((c) {
        if (c.id == commentId) {
          return c.copyWith(likesCount: c.likesCount + 1);
        }
        return c.copyWith(
          replies: c.replies.map((r) {
            if (r.id == commentId) {
              return r.copyWith(likesCount: r.likesCount + 1);
            }
            return r;
          }).toList(),
        );
      }).toList();
      state = state.copyWith(comments: updatedComments);
      return true;
    } catch (_) {
      return false;
    }
  }
}

final commentsProvider = StateNotifierProvider.family<CommentsNotifier,
    CommentsState, ({String targetId, String targetType})>((ref, params) {
  final apiClient = ref.watch(apiClientProvider);
  return CommentsNotifier(apiClient, params.targetId, params.targetType);
});
