/**
 * Trending algorithm for ranking votes, polls, and contests by engagement velocity.
 *
 * The score combines vote volume (logarithmic), view/share engagement, and a
 * time-decay recency boost so that fresh content surfaces naturally while
 * high-engagement items remain visible.
 */

export interface TrendingItem {
  id: string;
  totalVotes: number;
  viewCount: number;
  shareCount: number;
  createdAt: Date;
  isFeatured: boolean;
  isPinned?: boolean;
}

export interface TrendingConfig {
  /** Weight applied to the log10 vote component. @default 1.0 */
  voteWeight: number;
  /** Per-view contribution before normalisation. @default 0.1 */
  viewWeight: number;
  /** Per-share contribution before normalisation. @default 0.5 */
  shareWeight: number;
  /** Number of days over which the recency boost decays to zero. @default 7 */
  recencyDecayDays: number;
  /** Flat score boost for featured items. @default 10 */
  featuredBoost: number;
  /** Flat score boost for pinned items. @default 20 */
  pinnedBoost: number;
}

/** Returns the default trending configuration. */
export function getDefaultTrendingConfig(): TrendingConfig {
  return {
    voteWeight: 1.0,
    viewWeight: 0.1,
    shareWeight: 0.5,
    recencyDecayDays: 7,
    featuredBoost: 10,
    pinnedBoost: 20,
  };
}

/**
 * Calculate a trending score for a single item.
 *
 * Formula:
 * ```
 * score = log10(max(totalVotes, 1)) * voteWeight
 *       + (viewCount * viewWeight + shareCount * shareWeight) / 100
 *       + recencyBoost
 * ```
 * where `recencyBoost = max(0, 1 - hoursSinceCreation / (24 * recencyDecayDays)) * 2`.
 *
 * Featured items receive `+featuredBoost` and pinned items receive `+pinnedBoost`.
 */
export function calculateTrendingScore(
  item: TrendingItem,
  config?: Partial<TrendingConfig>,
): number {
  const cfg: TrendingConfig = { ...getDefaultTrendingConfig(), ...config };

  const voteScore = Math.log10(Math.max(item.totalVotes, 1)) * cfg.voteWeight;

  const engagementScore =
    (item.viewCount * cfg.viewWeight + item.shareCount * cfg.shareWeight) / 100;

  const hoursSinceCreation =
    (Date.now() - item.createdAt.getTime()) / (1000 * 60 * 60);

  const recencyBoost =
    Math.max(0, 1 - hoursSinceCreation / (24 * cfg.recencyDecayDays)) * 2;

  let score = voteScore + engagementScore + recencyBoost;

  if (item.isFeatured) {
    score += cfg.featuredBoost;
  }

  if (item.isPinned) {
    score += cfg.pinnedBoost;
  }

  return score;
}

/**
 * Sort an array of items by their trending score in descending order.
 *
 * The original array is **not** mutated; a new sorted array is returned.
 */
export function rankByTrending(
  items: TrendingItem[],
  config?: Partial<TrendingConfig>,
): TrendingItem[] {
  return [...items].sort(
    (a, b) =>
      calculateTrendingScore(b, config) - calculateTrendingScore(a, config),
  );
}
