'use client';

import { useState } from 'react';
import { Heart, Reply, Trash2 } from 'lucide-react';
import { cn, formatDate, getAnonymousId } from '@/lib/utils';

interface CommentUser {
  id: string;
  username: string | null;
  avatarUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  isAnonymous: boolean;
  likesCount: number;
  createdAt: string;
  user: CommentUser;
  replies: Comment[];
}

interface CommentCardProps {
  comment: Comment;
  onLike: (id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onReply: (content: string, parentId: string) => Promise<boolean>;
  isReply?: boolean;
}

export default function CommentCard({ comment, onLike, onDelete, onReply, isReply = false }: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const displayName = comment.isAnonymous
    ? 'Mtumiaji wa Siri'
    : comment.user.username || 'Mtumiaji wa Siri';

  const avatarLetter = displayName.charAt(0).toUpperCase();

  // Check if this comment belongs to the current anonymous user
  // We compare by checking if the user's anonymousId hash matches
  const isOwnComment = (() => {
    if (typeof window === 'undefined') return false;
    const anonId = getAnonymousId();
    if (!anonId) return false;
    // We can't easily hash client-side the same way, so we store the userId mapping
    // Instead, we use localStorage to track our own comment IDs
    const ownComments = JSON.parse(localStorage.getItem('mkd_own_comments') || '[]');
    return ownComments.includes(comment.id);
  })();

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    const success = await onReply(replyContent.trim(), comment.id);
    if (success) {
      setReplyContent('');
      setShowReplyForm(false);
    }
    setIsSubmitting(false);
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(comment.id);
    setIsLiking(false);
  };

  const handleDelete = async () => {
    await onDelete(comment.id);
  };

  return (
    <div className={cn('group', isReply ? 'ml-8 mt-3' : '')}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={cn(
          'shrink-0 rounded-full flex items-center justify-center font-semibold text-white',
          isReply ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm',
          'bg-neutral-400'
        )}>
          {avatarLetter}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-neutral-900">{displayName}</span>
            <span className="text-xs text-neutral-400">{formatDate(comment.createdAt)}</span>
          </div>

          <p className="text-sm text-neutral-700 whitespace-pre-wrap break-words">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-1.5">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors"
            >
              <Heart size={14} className={isLiking ? 'animate-pulse' : ''} />
              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <Reply size={14} />
                <span>Jibu</span>
              </button>
            )}

            {isOwnComment && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
                <span>Futa</span>
              </button>
            )}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Andika jibu..."
                maxLength={500}
                className="flex-1 text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900 placeholder:text-neutral-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply();
                  }
                }}
              />
              <button
                onClick={handleReply}
                disabled={!replyContent.trim() || isSubmitting}
                className="px-3 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '...' : 'Tuma'}
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-2 space-y-2 border-l-2 border-neutral-100">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onDelete={onDelete}
                  onReply={onReply}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
