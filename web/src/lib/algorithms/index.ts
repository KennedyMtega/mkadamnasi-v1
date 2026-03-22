/**
 * Algorithm modules for the Mkadamnasi platform.
 *
 * All exported functions are pure — they accept data and return scored or
 * sorted results without performing any database or network calls.
 */

export {
  calculateTrendingScore,
  rankByTrending,
  getDefaultTrendingConfig,
  type TrendingItem,
  type TrendingConfig,
} from "./trending";

export { rankFeedItems, type FeedItem, type UserProfile } from "./feed";

export {
  getRecommendations,
  type RecommendableItem,
} from "./recommendations";

export {
  scoreSearchResults,
  type SearchableItem,
} from "./search";

export {
  calculateFraudRisk,
  type VoteAttempt,
  type ExistingVotes,
  type FraudResult,
} from "./fraud";
