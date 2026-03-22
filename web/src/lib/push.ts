import { getMessaging } from './firebase-admin';
import { prisma } from './prisma';

/**
 * Payload for a push notification message.
 */
export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

/**
 * Send a push notification to a specific user via FCM.
 * Automatically cleans up invalid/expired tokens.
 *
 * @param userId - The user's database ID
 * @param payload - Notification title, body, optional data and image
 * @returns true if at least one notification was delivered successfully
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<boolean> {
  const messaging = getMessaging();
  if (!messaging) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fcmTokens: true },
  });

  if (!user?.fcmTokens?.length) return false;

  const message = {
    notification: {
      title: payload.title,
      body: payload.body,
      ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
    },
    data: payload.data || {},
    tokens: user.fcmTokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);

    // Clean up invalid tokens
    if (response.failureCount > 0) {
      const invalidTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
          invalidTokens.push(user.fcmTokens[idx]);
        }
      });
      if (invalidTokens.length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            fcmTokens: user.fcmTokens.filter(t => !invalidTokens.includes(t)),
          },
        });
      }
    }
    return response.successCount > 0;
  } catch (error) {
    console.error('Push notification failed:', error);
    return false;
  }
}

/**
 * Send a push notification to multiple users.
 * Processes in parallel batches of 10 to avoid overwhelming the FCM API.
 *
 * @param userIds - Array of user database IDs
 * @param payload - Notification title, body, optional data and image
 */
export async function sendPushToMultipleUsers(userIds: string[], payload: PushPayload): Promise<void> {
  for (let i = 0; i < userIds.length; i += 10) {
    const batch = userIds.slice(i, i + 10);
    await Promise.allSettled(batch.map(id => sendPushToUser(id, payload)));
  }
}
