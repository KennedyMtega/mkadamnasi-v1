import { prisma } from './prisma';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  source: string;       // e.g. "api/votes/POST", "api/ratings/GET"
  userId?: string;
  requestId?: string;
  duration?: number;     // ms
  statusCode?: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Structured logger that writes to both console and the SystemLog database table.
 * Non-blocking: DB writes happen in the background and never throw.
 */
class Logger {
  private write(level: LogLevel, message: string, ctx: LogContext, error?: Error) {
    // Console output with structured data
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${ctx.source}]`;

    if (level === 'error') {
      console.error(prefix, message, error?.stack || '', ctx.metadata || '');
    } else if (level === 'warn') {
      console.warn(prefix, message, ctx.metadata || '');
    } else if (level === 'debug') {
      if (process.env.NODE_ENV === 'development') {
        console.debug(prefix, message, ctx.metadata || '');
      }
      return; // Don't persist debug logs to DB
    } else {
      console.log(prefix, message, ctx.metadata || '');
    }

    // Persist to DB in background (fire-and-forget)
    this.persist(level, message, ctx, error).catch(() => {
      // Silently ignore DB write failures to avoid cascading errors
    });
  }

  private async persist(level: LogLevel, message: string, ctx: LogContext, error?: Error) {
    try {
      await prisma.systemLog.create({
        data: {
          level,
          source: ctx.source,
          message: message.slice(0, 2000), // Truncate long messages
          stack: error?.stack?.slice(0, 5000) || null,
          metadata: ctx.metadata ? (ctx.metadata as object) : undefined,
          userId: ctx.userId || null,
          requestId: ctx.requestId || null,
          duration: ctx.duration || null,
          statusCode: ctx.statusCode || null,
          ipAddress: ctx.ipAddress || null,
          userAgent: ctx.userAgent || null,
        },
      });
    } catch {
      // If DB write fails, we already logged to console - just move on
    }
  }

  error(message: string, ctx: LogContext, error?: Error) {
    this.write('error', message, ctx, error);
  }

  warn(message: string, ctx: LogContext) {
    this.write('warn', message, ctx);
  }

  info(message: string, ctx: LogContext) {
    this.write('info', message, ctx);
  }

  debug(message: string, ctx: LogContext) {
    this.write('debug', message, ctx);
  }
}

export const logger = new Logger();

/**
 * Helper to extract common request context from a NextRequest.
 */
export function getRequestContext(
  request: { headers: Headers; url: string; method?: string },
  source: string
): LogContext {
  const headers = request.headers;
  return {
    source,
    ipAddress: headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || headers.get('x-real-ip')
      || undefined,
    userAgent: headers.get('user-agent') || undefined,
    requestId: headers.get('x-request-id') || crypto.randomUUID(),
    userId: headers.get('x-anonymous-id') || undefined,
  };
}
