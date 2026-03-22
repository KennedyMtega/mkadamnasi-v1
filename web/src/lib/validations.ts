import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  login: z.string().min(1, 'Tafadhali ingiza barua pepe au nambari ya simu'),
  password: z.string().min(6, 'Nywila lazima iwe na herufi 6 au zaidi'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Jina la mtumiaji lazima liwe na herufi 3+').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Herufi, nambari na _ tu'),
  email: z.string().email('Barua pepe si sahihi').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?255\d{9}$/, 'Nambari ya simu si sahihi (mfano: 255712345678)').optional().or(z.literal('')),
  password: z.string().min(6, 'Nywila lazima iwe na herufi 6 au zaidi'),
}).refine(data => data.email || data.phone, {
  message: 'Barua pepe au nambari ya simu inahitajika',
  path: ['email'],
});

// Votes
export const createVoteSchema = z.object({
  title: z.string().min(5, 'Kichwa lazima kiwe na herufi 5+').max(200),
  description: z.string().max(1000).optional(),
  categoryId: z.string().uuid('Chagua kategoria'),
  type: z.enum(['POLL', 'VERSUS', 'RANKING', 'TOURNAMENT', 'CONTEST']).default('POLL'),
  imageUrl: z.string().url().optional().or(z.literal('')), // Poll/contest cover image
  businessId: z.string().uuid().optional().or(z.literal('')), // Business that owns this poll
  options: z.array(z.object({
    title: z.string().min(1, 'Chaguo linahitaji jina'),
    description: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
  })).min(2, 'Chaguzi 2 au zaidi zinahitajika'),
  isAnonymous: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  endDate: z.string().datetime().optional().or(z.literal('')),
  region: z.string().optional(),
});

// Contests (extends vote with contestant data)
export const createContestSchema = z.object({
  title: z.string().min(5, 'Kichwa lazima kiwe na herufi 5+').max(200),
  description: z.string().max(2000).optional(),
  categoryId: z.string().uuid('Chagua kategoria'),
  imageUrl: z.string().url().optional().or(z.literal('')), // Contest cover image
  businessId: z.string().uuid().optional().or(z.literal('')),
  codePrefix: z.string().min(1).max(10).regex(/^[A-Z0-9]+$/, 'Herufi kubwa na nambari tu').default('C'),
  contestants: z.array(z.object({
    fullName: z.string().min(2, 'Jina kamili linahitajika'),
    bio: z.string().max(500).optional(),
    photoUrl: z.string().url().optional().or(z.literal('')),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })).min(2, 'Washiriki 2 au zaidi wanahitajika'),
  isAnonymous: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  endDate: z.string().datetime().optional().or(z.literal('')),
  region: z.string().optional(),
  registrationOpen: z.boolean().default(false), // Allow self-registration
  boostEnabled: z.boolean().default(false),
  boostPrice: z.number().positive().optional(), // Price per boost vote in TZS
});

// Contest self-registration
export const contestRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Jina kamili linahitajika').max(100),
  bio: z.string().max(500).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Boost vote purchase
export const boostVoteSchema = z.object({
  optionId: z.string().uuid('Chagua mshiriki'),
  amount: z.number().int().min(1).max(1000),
  phoneNumber: z.string().regex(/^\+?255\d{9}$/, 'Nambari ya simu si sahihi'),
});

export const castVoteSchema = z.object({
  optionId: z.string().uuid('Chagua jibu'),
});

// Ratings
export const createRatingSchema = z.object({
  title: z.string().min(5, 'Kichwa lazima kiwe na herufi 5+').max(200),
  description: z.string().max(1000).optional(),
  categoryId: z.string().uuid('Chagua kategoria'),
  entityName: z.string().min(2, 'Jina la biashara/huduma linahitajika'),
  entityType: z.enum(['business', 'person', 'place', 'service']),
  isAnonymous: z.boolean().default(true),
  region: z.string().optional(),
});

export const submitRatingSchema = z.object({
  score: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
  isAnonymous: z.boolean().default(true),
});

// Search
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(['all', 'votes', 'ratings']).default('all'),
  category: z.string().optional(),
  page: z.number().int().positive().default(1),
});

// Report
export const reportSchema = z.object({
  targetType: z.enum(['vote', 'rating', 'user']),
  targetId: z.string().uuid(),
  reason: z.string().min(1, 'Sababu inahitajika'),
  description: z.string().max(500).optional(),
});

// Profile update
export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  bio: z.string().max(300).optional(),
  region: z.string().optional(),
  language: z.enum(['sw', 'en']).optional(),
});

// Comments
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Maoni yanahitajika').max(500, 'Maoni mengi mno (500 max)'),
  voteId: z.string().uuid().optional(),
  ratingId: z.string().uuid().optional(),
  parentId: z.string().uuid().optional(),
  isAnonymous: z.boolean().default(true),
}).refine(data => data.voteId || data.ratingId, {
  message: 'voteId au ratingId inahitajika',
  path: ['voteId'],
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateVoteInput = z.infer<typeof createVoteSchema>;
export type CastVoteInput = z.infer<typeof castVoteSchema>;
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type SubmitRatingInput = z.infer<typeof submitRatingSchema>;
export type CreateContestInput = z.infer<typeof createContestSchema>;
export type ContestRegistrationInput = z.infer<typeof contestRegistrationSchema>;
export type BoostVoteInput = z.infer<typeof boostVoteSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
