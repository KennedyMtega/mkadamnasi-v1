'use client';

import { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import CommentCard from './CommentCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatNumber } from '@/lib/utils';

interface CommentSectionProps {
  targetId: string;
  targetType: 'vote' | 'rating';
}

export function CommentSection({ targetId, targetType }: CommentSectionProps) {
  const {
    comments,
    total,
    isLoading,
    error,
    addComment,
    deleteComment,
    likeComment,
    loadMore,
    hasMore,
  } = useComments(targetId, targetType);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const success = await addComment(newComment.trim());
    if (success) {
      setNewComment('');
      // Track this comment as own in localStorage
      // (will be done when we know the comment ID from response)
    }
    setIsSubmitting(false);
  };

  const handleAddComment = async (content: string, parentId?: string): Promise<boolean> => {
    const success = await addComment(content, parentId);
    return success;
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await loadMore();
    setIsLoadingMore(false);
  };

  const charCount = newComment.length;
  const charLimit = 500;

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={20} className="text-neutral-700" />
        <h3 className="text-lg font-semibold text-neutral-900">
          Maoni {total > 0 && <span className="text-neutral-400 font-normal">({formatNumber(total)})</span>}
        </h3>
      </div>

      {/* New comment form */}
      <div className="mb-6">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value.slice(0, charLimit))}
            placeholder="Andika maoni yako..."
            rows={3}
            maxLength={charLimit}
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:bg-white text-neutral-900 placeholder:text-neutral-400 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${charCount > charLimit * 0.9 ? 'text-red-500' : 'text-neutral-400'}`}>
              {charCount}/{charLimit}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              <span>Tuma</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments list */}
      {!isLoading && comments.length === 0 && (
        <EmptyState
          icon={<MessageCircle size={32} />}
          title="Hakuna maoni bado"
          description="Kuwa wa kwanza kutoa maoni!"
        />
      )}

      {!isLoading && comments.length > 0 && (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onLike={likeComment}
              onDelete={deleteComment}
              onReply={handleAddComment}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !isLoading && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-5 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Inapakia...
              </span>
            ) : (
              'Pakia zaidi'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
