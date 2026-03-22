import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export async function createNotification(params: {
  userId: string;
  type: string; // 'badge_earned' | 'vote_result' | 'trending' | 'system' | 'referral'
  title: string;
  body: string;
  data?: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      data: params.data ?? Prisma.DbNull,
    },
  });
}

export async function createBadgeNotification(userId: string, badgeName: string, badgeIcon: string) {
  return createNotification({
    userId,
    type: 'badge_earned',
    title: `${badgeIcon} Beji Mpya!`,
    body: `Umepata beji "${badgeName}". Hongera!`,
    data: { action: 'view_badges' },
  });
}

export async function createVoteResultNotification(userId: string, voteTitle: string, voteId: string) {
  return createNotification({
    userId,
    type: 'vote_result',
    title: 'Matokeo ya Kura',
    body: `Kura "${voteTitle}" ina matokeo mapya.`,
    data: { action: 'view_vote', voteId },
  });
}

export async function createReferralNotification(userId: string, referrerPoints: number) {
  return createNotification({
    userId,
    type: 'referral',
    title: 'Mwaliko Umefanikiwa!',
    body: `Umepata pointi ${referrerPoints} kwa mwaliko wako.`,
    data: { action: 'view_referrals' },
  });
}

export async function createVoteMilestoneNotification(
  creatorId: string,
  voteTitle: string,
  voteId: string,
  totalVotes: number
) {
  return createNotification({
    userId: creatorId,
    type: 'vote_result',
    title: 'Kura Yako Inaendelea Vizuri!',
    body: `Kura "${voteTitle}" imefikia kura ${totalVotes}!`,
    data: { action: 'view_vote', voteId },
  });
}

export async function createRatingMilestoneNotification(
  creatorId: string,
  ratingTitle: string,
  ratingId: string,
  totalRatings: number
) {
  return createNotification({
    userId: creatorId,
    type: 'vote_result',
    title: 'Kadirio Lako Linaendelea Vizuri!',
    body: `Kadirio "${ratingTitle}" limefikia makadirio ${totalRatings}!`,
    data: { action: 'view_rating', ratingId },
  });
}
