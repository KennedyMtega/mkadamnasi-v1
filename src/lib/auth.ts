import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

/**
 * Get or create an anonymous user based on the anonymous ID header.
 * For anonymous voting/rating, we track users by their client-generated anonymous ID.
 */
export async function getOrCreateAnonymousUser(request: NextRequest) {
  const anonymousId = request.headers.get('x-anonymous-id');

  if (!anonymousId) {
    return null;
  }

  // Hash the anonymous ID for storage (privacy protection)
  const hashedAnonId = createHash('sha256').update(anonymousId).digest('hex');

  let user = await prisma.user.findUnique({
    where: { anonymousId: hashedAnonId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: uuidv4(),
        anonymousId: hashedAnonId,
        language: 'sw',
      },
    });
  }

  return user;
}

/**
 * Hash an IP address for fraud detection (one-way hash, privacy preserving).
 */
export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}
