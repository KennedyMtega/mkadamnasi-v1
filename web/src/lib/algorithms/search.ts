/**
 * Search relevance scoring algorithm.
 *
 * Ranks search results by combining text-match signals (exact match, contains,
 * word-prefix match) with popularity, rating quality, and recency boosts.
 */

export interface SearchableItem {
  id: string;
  title: string;
  description?: string | null;
  entityName?: string | null;
  totalVotes?: number;
  totalRatings?: number;
  averageRating?: number;
  createdAt: Date;
  type: "vote" | "rating";
}

/**
 * Score and sort search results by relevance to `query`.
 *
 * Text-match signals:
 * - Title exact match (case-insensitive): **+10**
 * - Title contains query: **+5**
 * - A word in the title starts with the query: **+3**
 * - Description contains query: **+2**
 * - Entity name match: **+4**
 *
 * Quality / popularity signals:
 * - Popularity: **+log10(max(participants, 1))** where participants is
 *   `totalVotes` or `totalRatings`.
 * - Rating quality (ratings only): **+averageRating * 0.5**
 * - Recency: **+max(0, 1 - daysSinceCreation / 90) * 2**
 *
 * The original array is **not** mutated.
 */
export function scoreSearchResults(
  items: SearchableItem[],
  query: string,
): SearchableItem[] {
  if (!query || query.trim().length === 0) {
    return [...items];
  }

  const q = query.trim().toLowerCase();
  const now = Date.now();

  const scored = items.map((item) => {
    let score = 0;
    const titleLower = item.title.toLowerCase();

    // Title exact match
    if (titleLower === q) {
      score += 10;
    }

    // Title contains query
    if (titleLower.includes(q)) {
      score += 5;
    }

    // Title word starts with query
    const words = titleLower.split(/\s+/);
    if (words.some((w) => w.startsWith(q))) {
      score += 3;
    }

    // Description contains query
    if (item.description && item.description.toLowerCase().includes(q)) {
      score += 2;
    }

    // Entity name match
    if (item.entityName && item.entityName.toLowerCase().includes(q)) {
      score += 4;
    }

    // Popularity boost
    const participants =
      item.type === "rating"
        ? (item.totalRatings ?? 0)
        : (item.totalVotes ?? 0);
    score += Math.log10(Math.max(participants, 1));

    // Rating quality boost (ratings only)
    if (item.type === "rating" && item.averageRating != null) {
      score += item.averageRating * 0.5;
    }

    // Recency boost
    const daysSinceCreation =
      (now - item.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 1 - daysSinceCreation / 90) * 2;

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}
