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
