import NextAuth, { type NextAuthConfig, type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      anonymousId: string;
      isAdmin: boolean;
      isPremium: boolean;
      username: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    anonymousId: string;
    isAdmin: boolean;
    isPremium: boolean;
    username: string | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    anonymousId: string;
    isAdmin: boolean;
    isPremium: boolean;
    username: string | null;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        login: { label: 'Barua pepe au nambari ya simu', type: 'text' },
        password: { label: 'Nywila', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          return null;
        }

        const login = credentials.login as string;
        const password = credentials.password as string;

        // Find user by email or phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: login.toLowerCase() },
              { phone: login },
            ],
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        if (user.isBanned) {
          throw new Error('Akaunti yako imezuiwa. Sababu: ' + (user.banReason || 'Haijulikani'));
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Update last active
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          anonymousId: user.anonymousId,
          isAdmin: user.isAdmin,
          isPremium: user.isPremium,
          username: user.username,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.anonymousId = user.anonymousId;
        token.isAdmin = user.isAdmin;
        token.isPremium = user.isPremium;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.anonymousId = token.anonymousId as string;
      session.user.isAdmin = token.isAdmin as boolean;
      session.user.isPremium = token.isPremium as boolean;
      session.user.username = token.username as string | null;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
