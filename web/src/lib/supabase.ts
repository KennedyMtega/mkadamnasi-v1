// Supabase client - placeholder for file storage and realtime features
// The main database access uses Prisma instead of the Supabase JS client

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};
