export interface User {
  id: string;
  anonymous_id: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  points: number;
  level: number;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  creator_id: string;
  type: 'poll' | 'ranking' | 'versus' | 'tournament';
  options: VoteOption[];
  total_votes: number;
  is_active: boolean;
  is_featured: boolean;
  is_anonymous: boolean;
  region?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface VoteOption {
  id: string;
  vote_id: string;
  title: string;
  description?: string;
  image_url?: string;
  vote_count: number;
  percentage: number;
  position: number;
}

export interface Rating {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  entity_name: string;
  entity_type: string;
  creator_id: string;
  average_rating: number;
  total_ratings: number;
  rating_distribution: Record<number, number>;
  is_active: boolean;
  is_featured: boolean;
  region?: string;
  created_at: string;
  updated_at: string;
}

export interface RatingEntry {
  id: string;
  rating_id: string;
  user_id: string;
  score: number;
  review?: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  color: string;
  vote_count: number;
  rating_count: number;
}

export interface ActivityItem {
  id: string;
  type: 'vote_created' | 'vote_cast' | 'rating_given' | 'badge_earned' | 'level_up';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Badge {
  id: string;
  name: string;
  name_en: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
  requirement: string;
  progress: number;
  target: number;
}

export interface LeaderboardEntry {
  position: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  points: number;
  votes_cast: number;
  ratings_given: number;
}

export interface SearchResult {
  id: string;
  type: 'vote' | 'rating' | 'category';
  title: string;
  description?: string;
  category: string;
  total_participants: number;
  created_at: string;
}
