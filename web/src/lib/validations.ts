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
  type: z.enum(['POLL', 'VERSUS', 'RANKING', 'TOURNAMENT']).default('POLL'),
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

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateVoteInput = z.infer<typeof createVoteSchema>;
export type CastVoteInput = z.infer<typeof castVoteSchema>;
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type SubmitRatingInput = z.infer<typeof submitRatingSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
