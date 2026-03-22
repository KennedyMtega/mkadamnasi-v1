/**
 * Personalised feed ranking algorithm.
 *
 * Combines trending score with user-specific signals (category affinity,
 * region match, voting history) and applies diversity heuristics so the
 * feed doesn't become a wall of identical content.
 */

import { calculateTrendingScore, type TrendingConfig } from "./trending";

export interface FeedItem {
  id: string;
  categoryId: string;
  region?: string | null;
  totalVotes: number;
  viewCount: number;
  shareCount: number;
  createdAt: Date;
  isFeatured: boolean;
  type: string; // 'POLL' | 'VERSUS' | 'RANKING' | 'TOURNAMENT' | 'CONTEST'
}

export interface UserProfile {
  region?: string | null;
  /** Map of categoryId to an affinity score between 0 and 1. */
  categoryAffinities: Record<string, number>;
  /** IDs of items the user has already voted on. */
  votedItemIds: Set<string>;
}

/**
 * Rank feed items for a specific user (or anonymously when no profile is
 * provided).
 *
 * Scoring factors:
 * - **Base score** — reuses `calculateTrendingScore`.
 * - **Category affinity** — `+2 * affinity` when the user has affinity for
 *   the item's category.
 * - **Region match** — `+1.5` when item region matches user region.
 * - **Already voted** — `-3` to push voted items down (but not hidden).
 * - **Diversity penalty** — `-0.5` per consecutive duplicate category.
 * - **Type variety bonus** — `+0.3` for a type not seen in the previous 5
 *   items.
 *
 * The original array is **not** mutated.
 */
export function rankFeedItems(
  items: FeedItem[],
  userProfile?: UserProfile | null,
  trendingConfig?: Partial<TrendingConfig>,
): FeedItem[] {
  // --- Phase 1: compute a per-item base score (independent of ordering) ---

  interface ScoredFeedItem {
    item: FeedItem;
    baseScore: number;
  }

  const scored: ScoredFeedItem[] = items.map((item) => {
    let score = calculateTrendingScore(
      {
        id: item.id,
        totalVotes: item.totalVotes,
        viewCount: item.viewCount,
        shareCount: item.shareCount,
        createdAt: item.createdAt,
        isFeatured: item.isFeatured,
      },
      trendingConfig,
    );

    if (userProfile) {
      // Category affinity
      const affinity = userProfile.categoryAffinities[item.categoryId];
      if (affinity !== undefined) {
        score += 2 * affinity;
      }

      // Region match
      if (
        item.region &&
        userProfile.region &&
        item.region === userProfile.region
      ) {
        score += 1.5;
      }

      // Already voted penalty
      if (userProfile.votedItemIds.has(item.id)) {
        score -= 3;
      }
    }

    return { item, baseScore: score };
  });

  // --- Phase 2: sort by base score first ---
  scored.sort((a, b) => b.baseScore - a.baseScore);

  // --- Phase 3: apply ordering-dependent diversity adjustments ---
  const recentCategories: string[] = [];
  const recentTypes: string[] = [];

  const finalScored: { item: FeedItem; finalScore: number }[] = scored.map(
    ({ item, baseScore }) => {
      let score = baseScore;

      // Diversity penalty — count how many of the immediately preceding items
      // share the same category.
      const consecutiveDuplicates = countTrailingMatches(
        recentCategories,
        item.categoryId,
      );
      if (consecutiveDuplicates > 0) {
        score -= 0.5 * consecutiveDuplicates;
      }

      // Type variety bonus — reward types not seen in last 5 items.
      const last5Types = recentTypes.slice(-5);
      if (!last5Types.includes(item.type)) {
        score += 0.3;
      }

      recentCategories.push(item.categoryId);
      recentTypes.push(item.type);

      return { item, finalScore: score };
    },
  );

  // Re-sort after diversity adjustments
  finalScored.sort((a, b) => b.finalScore - a.finalScore);

  return finalScored.map((s) => s.item);
}

/** Count how many trailing elements of `arr` equal `value`. */
function countTrailingMatches(arr: string[], value: string): number {
  let count = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === value) {
      count++;
    } else {
      break;
    }
  }
  return count;
}
