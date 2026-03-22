import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { v4 as uuidv4 } from 'uuid';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require('pg');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const BADGE_DEFINITIONS = [
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

const CATEGORIES = [
  { slug: 'restaurants', name: 'Migahawa', nameEn: 'Restaurants', icon: '🍽️', color: '#FF6B35', position: 0 },
  { slug: 'schools', name: 'Shule', nameEn: 'Schools', icon: '🎓', color: '#3B82F6', position: 1 },
  { slug: 'hospitals', name: 'Hospitali', nameEn: 'Hospitals', icon: '🏥', color: '#10B981', position: 2 },
  { slug: 'salons', name: 'Saluni', nameEn: 'Salons', icon: '💇', color: '#EC4899', position: 3 },
  { slug: 'shops', name: 'Maduka', nameEn: 'Shops', icon: '🛍️', color: '#8B5CF6', position: 4 },
  { slug: 'transport', name: 'Usafiri', nameEn: 'Transport', icon: '🚌', color: '#F59E0B', position: 5 },
  { slug: 'entertainment', name: 'Burudani', nameEn: 'Entertainment', icon: '🎭', color: '#EF4444', position: 6 },
  { slug: 'sports', name: 'Michezo', nameEn: 'Sports', icon: '⚽', color: '#10B981', position: 7 },
  { slug: 'politics', name: 'Siasa', nameEn: 'Politics', icon: '🏛️', color: '#6B7280', position: 8 },
  { slug: 'influencers', name: 'Watu Mashuhuri', nameEn: 'Influencers', icon: '⭐', color: '#F59E0B', position: 9 },
  { slug: 'services', name: 'Huduma', nameEn: 'Services', icon: '🔧', color: '#3B82F6', position: 10 },
  { slug: 'custom', name: 'Mengine', nameEn: 'Custom', icon: '✨', color: '#8B5CF6', position: 11 },
];

async function main() {
  console.log('Seeding database...');

  // Seed categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameEn: cat.nameEn,
        icon: cat.icon,
        color: cat.color,
        position: cat.position,
      },
      create: {
        id: uuidv4(),
        ...cat,
      },
    });
  }

  console.log(`Seeded ${CATEGORIES.length} categories.`);

  // Seed badges
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        nameEn: badge.nameEn,
        icon: badge.icon,
        category: badge.category,
        description: badge.requirement,
        requirement: badge.requirement,
        targetValue: badge.targetValue,
        pointsReward: badge.pointsReward,
      },
      create: {
        id: uuidv4(),
        slug: badge.slug,
        name: badge.name,
        nameEn: badge.nameEn,
        icon: badge.icon,
        category: badge.category,
        description: badge.requirement,
        requirement: badge.requirement,
        targetValue: badge.targetValue,
        pointsReward: badge.pointsReward,
      },
    });
  }

  console.log(`Seeded ${BADGE_DEFINITIONS.length} badges.`);
  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
