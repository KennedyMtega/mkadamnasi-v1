import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface BadgeDefinition {
  slug: string;
  name: string;
  nameEn: string;
  icon: string;
  category: string;
  requirement: string;
  targetValue: number;
  pointsReward: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Voting badges
  { slug: 'first-vote', name: 'Kura ya Kwanza', nameEn: 'First Vote', icon: '🗳️', category: 'achievement', requirement: 'Cast your first vote', targetValue: 1, pointsReward: 5 },
  { slug: 'voter-10', name: 'Mpiga Kura', nameEn: 'Active Voter', icon: '✅', category: 'milestone', requirement: 'Cast 10 votes', targetValue: 10, pointsReward: 15 },
  { slug: 'voter-50', name: 'Mpiga Kura Hodari', nameEn: 'Dedicated Voter', icon: '🏆', category: 'milestone', requirement: 'Cast 50 votes', targetValue: 50, pointsReward: 50 },
  { slug: 'voter-100', name: 'Bingwa wa Kura', nameEn: 'Voting Champion', icon: '👑', category: 'milestone', requirement: 'Cast 100 votes', targetValue: 100, pointsReward: 100 },

  // Rating badges
  { slug: 'first-rating', name: 'Kadiria Kwanza', nameEn: 'First Rating', icon: '⭐', category: 'achievement', requirement: 'Submit your first rating', targetValue: 1, pointsReward: 5 },
  { slug: 'rater-10', name: 'Mkadiriaji', nameEn: 'Active Rater', icon: '🌟', category: 'milestone', requirement: 'Submit 10 ratings', targetValue: 10, pointsReward: 15 },
  { slug: 'rater-50', name: 'Mkadiriaji Hodari', nameEn: 'Expert Rater', icon: '💫', category: 'milestone', requirement: 'Submit 50 ratings', targetValue: 50, pointsReward: 50 },

  // Creator badges
  { slug: 'first-creation', name: 'Muundaji', nameEn: 'Creator', icon: '✨', category: 'achievement', requirement: 'Create your first vote or rating', targetValue: 1, pointsReward: 10 },
  { slug: 'creator-10', name: 'Muundaji Hodari', nameEn: 'Prolific Creator', icon: '🎨', category: 'milestone', requirement: 'Create 10 items', targetValue: 10, pointsReward: 30 },

  // Engagement badges
  { slug: 'streak-7', name: 'Wiki Mzima', nameEn: 'Week Streak', icon: '🔥', category: 'milestone', requirement: '7-day activity streak', targetValue: 7, pointsReward: 25 },
  { slug: 'streak-30', name: 'Mwezi Mzima', nameEn: 'Month Streak', icon: '💪', category: 'milestone', requirement: '30-day activity streak', targetValue: 30, pointsReward: 100 },

  // Referral badges
  { slug: 'first-referral', name: 'Mwaliko', nameEn: 'First Referral', icon: '🤝', category: 'achievement', requirement: 'Refer your first friend', targetValue: 1, pointsReward: 10 },
  { slug: 'referrer-10', name: 'Balozi', nameEn: 'Ambassador', icon: '🏅', category: 'milestone', requirement: 'Refer 10 friends', targetValue: 10, pointsReward: 50 },

  // Special
  { slug: 'early-adopter', name: 'Mwanzilishi', nameEn: 'Early Adopter', icon: '🌅', category: 'special', requirement: 'Join during beta', targetValue: 1, pointsReward: 20 },
];

/**
 * Get the current progress value for a badge based on user stats.
 */
function getBadgeProgress(slug: string, stats: {
  votesCast: number;
  ratingsGiven: number;
  creationsCount: number;
  streak: number;
  referralCount: number;
}): number {
  switch (slug) {
    case 'first-vote':
    case 'voter-10':
    case 'voter-50':
    case 'voter-100':
      return stats.votesCast;

    case 'first-rating':
    case 'rater-10':
    case 'rater-50':
      return stats.ratingsGiven;

    case 'first-creation':
    case 'creator-10':
      return stats.creationsCount;

    case 'streak-7':
    case 'streak-30':
      return stats.streak;

    case 'first-referral':
    case 'referrer-10':
      return stats.referralCount;

    case 'early-adopter':
      // Handled separately - awarded based on join date
      return 0;

    default:
      return 0;
  }
}

/**
 * Check user stats against all badge definitions and award any newly earned badges.
 * Returns array of newly awarded badge slugs for toast notifications.
 */
export async function checkAndAwardBadges(
  userId: string,
  prisma: PrismaClient
): Promise<string[]> {
  // Get user stats in parallel
  const [votesCast, ratingsGiven, votesCreated, ratingsCreated, user, referralCount, existingBadges] = await Promise.all([
    prisma.voteEntry.count({ where: { userId } }),
    prisma.ratingEntry.count({ where: { userId } }),
    prisma.vote.count({ where: { creatorId: userId } }),
    prisma.rating.count({ where: { creatorId: userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { streak: true, createdAt: true } }),
    prisma.referral.count({ where: { referrerId: userId } }),
    prisma.userBadge.findMany({
      where: { userId },
      select: { badge: { select: { slug: true } } },
    }),
  ]);

  const earnedSlugs = new Set(existingBadges.map((ub) => ub.badge.slug));
  const creationsCount = votesCreated + ratingsCreated;
  const streak = user?.streak ?? 0;

  const stats = { votesCast, ratingsGiven, creationsCount, streak, referralCount };

  // Fetch all active badges from DB
  const allBadges = await prisma.badge.findMany({
    where: { isActive: true },
  });

  const newlyAwarded: string[] = [];

  for (const badge of allBadges) {
    // Skip already earned badges
    if (earnedSlugs.has(badge.slug)) continue;

    // Handle early-adopter specially
    if (badge.slug === 'early-adopter') {
      // Award if user joined before a cutoff date (e.g., within first 6 months)
      const betaCutoff = new Date('2026-12-31T23:59:59Z');
      if (user?.createdAt && user.createdAt <= betaCutoff) {
        await prisma.$transaction([
          prisma.userBadge.create({
            data: {
              id: uuidv4(),
              userId,
              badgeId: badge.id,
            },
          }),
          prisma.user.update({
            where: { id: userId },
            data: { points: { increment: badge.pointsReward } },
          }),
          prisma.activityLog.create({
            data: {
              id: uuidv4(),
              userId,
              type: 'badge_earned',
              title: `Umepata beji: ${badge.name}`,
              description: badge.requirement,
              metadata: { badgeId: badge.id, badgeSlug: badge.slug, pointsReward: badge.pointsReward },
            },
          }),
        ]);
        newlyAwarded.push(badge.slug);
      }
      continue;
    }

    // Check progress against target
    const progress = getBadgeProgress(badge.slug, stats);
    if (progress >= badge.targetValue) {
      await prisma.$transaction([
        prisma.userBadge.create({
          data: {
            id: uuidv4(),
            userId,
            badgeId: badge.id,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { points: { increment: badge.pointsReward } },
        }),
        prisma.activityLog.create({
          data: {
            id: uuidv4(),
            userId,
            type: 'badge_earned',
            title: `Umepata beji: ${badge.name}`,
            description: badge.requirement,
            metadata: { badgeId: badge.id, badgeSlug: badge.slug, pointsReward: badge.pointsReward },
          },
        }),
      ]);
      newlyAwarded.push(badge.slug);
    }
  }

  return newlyAwarded;
}
