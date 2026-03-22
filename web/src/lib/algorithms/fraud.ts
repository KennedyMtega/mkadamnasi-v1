/**
 * Vote fraud detection algorithm.
 *
 * Analyses a vote attempt against recent voting patterns and returns a risk
 * assessment. All inputs are pre-computed counts — this module performs no
 * database or network calls.
 */

export interface VoteAttempt {
  ipHash?: string | null;
  deviceFingerprint?: string | null;
  userAgent?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timestamp: Date;
}

export interface ExistingVotes {
  /** Number of votes from the same IP address in the last hour. */
  recentVotesFromIp: number;
  /** Number of votes from the same device fingerprint in the last hour. */
  recentVotesFromDevice: number;
  /** Seconds since the user's most recent vote on the platform. */
  timeSinceLastVote: number;
  /** Total votes cast in the current session (last 10 minutes). */
  totalVotesInSession: number;
}

export interface FraudResult {
  /** Risk score from 0 to 100 — higher means more suspicious. */
  riskScore: number;
  /** Qualitative risk level derived from the score. */
  riskLevel: "low" | "medium" | "high" | "critical";
  /** Human-readable descriptions of each triggered risk factor. */
  flags: string[];
  /** `true` when `riskScore >= 80` — the vote should be blocked. */
  shouldBlock: boolean;
}

/**
 * Evaluate the fraud risk of a vote attempt.
 *
 * Risk factors and their point contributions:
 * | Factor | Points |
 * |---|---|
 * | Same IP voted 5+ times in last hour | +30 |
 * | Same device voted 5+ times in last hour | +35 |
 * | Time since last vote < 3 seconds | +25 |
 * | 10+ votes in last 10 minutes | +20 |
 * | Missing user agent | +10 |
 * | Missing device fingerprint | +5 |
 *
 * Risk levels: 0-25 low, 26-50 medium, 51-79 high, 80+ critical.
 */
export function calculateFraudRisk(
  attempt: VoteAttempt,
  existing: ExistingVotes,
): FraudResult {
  let riskScore = 0;
  const flags: string[] = [];

  // Same IP voted 5+ times in last hour
  if (existing.recentVotesFromIp >= 5) {
    riskScore += 30;
    flags.push(
      `Same IP address has cast ${existing.recentVotesFromIp} votes in the last hour`,
    );
  }

  // Same device voted 5+ times in last hour
  if (existing.recentVotesFromDevice >= 5) {
    riskScore += 35;
    flags.push(
      `Same device has cast ${existing.recentVotesFromDevice} votes in the last hour`,
    );
  }

  // Time since last vote < 3 seconds
  if (existing.timeSinceLastVote < 3) {
    riskScore += 25;
    flags.push(
      `Only ${existing.timeSinceLastVote.toFixed(1)}s since last vote (< 3s threshold)`,
    );
  }

  // 10+ votes in last 10 minutes
  if (existing.totalVotesInSession >= 10) {
    riskScore += 20;
    flags.push(
      `${existing.totalVotesInSession} votes cast in the last 10 minutes`,
    );
  }

  // Missing user agent
  if (!attempt.userAgent) {
    riskScore += 10;
    flags.push("Missing user agent string");
  }

  // Missing device fingerprint
  if (!attempt.deviceFingerprint) {
    riskScore += 5;
    flags.push("Missing device fingerprint");
  }

  // Clamp to 0-100
  riskScore = Math.min(100, Math.max(0, riskScore));

  const riskLevel = getRiskLevel(riskScore);
  const shouldBlock = riskScore >= 80;

  return { riskScore, riskLevel, flags, shouldBlock };
}

/** Map a numeric risk score to a qualitative level. */
function getRiskLevel(
  score: number,
): "low" | "medium" | "high" | "critical" {
  if (score >= 80) return "critical";
  if (score >= 51) return "high";
  if (score >= 26) return "medium";
  return "low";
}
