export const APP_NAME = 'Mkadamnasi';
export const APP_TAGLINE = 'Sauti Yako, Siri Yako';
export const APP_DESCRIPTION = "Tanzania's First Anonymous Rating, Voting & Ranking Platform";

export const COLORS = {
  brandOrange: '#FF6B35',
  darkOrange: '#E85A2A',
  lightOrange: '#FFF4EE',
  deepNavy: '#1A2332',
  darkGray: '#4A5568',
  mediumGray: '#9CA3AF',
  lightGray: '#E5E7EB',
  offWhite: '#F8F9FA',
  successGreen: '#10B981',
  warningYellow: '#F59E0B',
  errorRed: '#EF4444',
  infoBlue: '#3B82F6',
} as const;

export const CATEGORIES = [
  { id: 'restaurants', name: 'Migahawa', nameEn: 'Restaurants', icon: '🍽️', color: '#FF6B35' },
  { id: 'schools', name: 'Shule', nameEn: 'Schools', icon: '🎓', color: '#3B82F6' },
  { id: 'hospitals', name: 'Hospitali', nameEn: 'Hospitals', icon: '🏥', color: '#10B981' },
  { id: 'salons', name: 'Saluni', nameEn: 'Salons', icon: '💇', color: '#EC4899' },
  { id: 'shops', name: 'Maduka', nameEn: 'Shops', icon: '🛍️', color: '#8B5CF6' },
  { id: 'transport', name: 'Usafiri', nameEn: 'Transport', icon: '🚌', color: '#F59E0B' },
  { id: 'entertainment', name: 'Burudani', nameEn: 'Entertainment', icon: '🎭', color: '#EF4444' },
  { id: 'sports', name: 'Michezo', nameEn: 'Sports', icon: '⚽', color: '#10B981' },
  { id: 'politics', name: 'Siasa', nameEn: 'Politics', icon: '🏛️', color: '#6B7280' },
  { id: 'influencers', name: 'Watu Mashuhuri', nameEn: 'Influencers', icon: '⭐', color: '#F59E0B' },
  { id: 'services', name: 'Huduma', nameEn: 'Services', icon: '🔧', color: '#3B82F6' },
  { id: 'custom', name: 'Mengine', nameEn: 'Custom', icon: '✨', color: '#8B5CF6' },
] as const;

export const REGIONS_TZ = [
  'Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Mbeya',
  'Morogoro', 'Tanga', 'Kilimanjaro', 'Zanzibar', 'Iringa',
  'Kagera', 'Kigoma', 'Lindi', 'Mara', 'Mtwara',
  'Njombe', 'Pemba', 'Rukwa', 'Ruvuma', 'Shinyanga',
  'Simiyu', 'Singida', 'Songwe', 'Tabora', 'Geita',
  'Katavi', 'Pwani',
] as const;

export const VOTE_TYPES = {
  POLL: 'poll',
  RANKING: 'ranking',
  VERSUS: 'versus',
  TOURNAMENT: 'tournament',
} as const;

export const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: '/icons/mpesa.svg', color: '#E60000' },
  { id: 'tigopesa', name: 'Tigo Pesa', icon: '/icons/tigopesa.svg', color: '#003DA5' },
  { id: 'airtelmoney', name: 'Airtel Money', icon: '/icons/airtel.svg', color: '#FF0000' },
  { id: 'halopesa', name: 'Halo Pesa', icon: '/icons/halopesa.svg', color: '#00A651' },
] as const;
