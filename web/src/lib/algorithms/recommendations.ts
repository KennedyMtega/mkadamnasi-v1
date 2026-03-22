/**
 * Recommendation algorithm for "You might also like" suggestions.
 *
 * Scores candidate items by similarity to a reference item (category, region,
 * type, tags) combined with popularity and recency signals, then returns the
 * top N.
 */

export interface RecommendableItem {
  id: string;
  categoryId: string;
  region?: string | null;
  totalVotes: number;
  viewCount: number;
  createdAt: Date;
  type: string;
  tags?: string[];
}

/**
 * Return up to `limit` recommended items based on similarity to
 * `currentItem`.
 *
 * Scoring breakdown:
 * - Same category: **+3**
 * - Same region: **+1.5**
 * - Same type: **+0.5**
 * - Tag overlap: **+1** per shared tag (up to 3)
 * - Popularity: **+log10(max(totalVotes, 1))**
 * - Recency: **+max(0, 1 - daysSinceCreation / 30)**
 * - Already voted: **-10**
 *
 * The `currentItem` itself is always excluded from results.
 */
export function getRecommendations(
  currentItem: RecommendableItem,
  allItems: RecommendableItem[],
  userVotedIds?: Set<string>,
  limit: number = 6,
): RecommendableItem[] {
  const now = Date.now();
  const currentTags = new Set(currentItem.tags ?? []);

  const scored = allItems
    .filter((item) => item.id !== currentItem.id)
    .map((item) => {
      let score = 0;

      // Category match
      if (item.categoryId === currentItem.categoryId) {
        score += 3;
      }

      // Region match
      if (
        item.region &&
        currentItem.region &&
        item.region === currentItem.region
      ) {
        score += 1.5;
      }

      // Type match
      if (item.type === currentItem.type) {
        score += 0.5;
      }

      // Tag overlap (capped at 3)
      if (currentTags.size > 0 && item.tags && item.tags.length > 0) {
        let tagOverlap = 0;
        for (const tag of item.tags) {
          if (currentTags.has(tag)) {
            tagOverlap++;
            if (tagOverlap >= 3) break;
          }
        }
        score += tagOverlap;
      }

      // Popularity
      score += Math.log10(Math.max(item.totalVotes, 1));

      // Recency
      const daysSinceCreation =
        (now - item.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 1 - daysSinceCreation / 30);

      // Already voted penalty
      if (userVotedIds && userVotedIds.has(item.id)) {
        score -= 10;
      }

      return { item, score };
    });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.item);
}
