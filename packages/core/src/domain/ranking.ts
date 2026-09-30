/**
 * S = weighted support score
 * V = distinct Verified Residents supporting
 * A = locality users active in last 30 days
 */
export interface IssueSupportStats {
  scoreS: number;
  verifiedV: number;
  activeUsersA: number;
  ageHours: number;
  daysOpen: number;
  inLocalityFraction: number;
}

export function computeTrendingRank(stats: IssueSupportStats, g: number = 1.5): number {
  // rank = S / (age_hours + 2)^g
  return stats.scoreS / Math.pow(stats.ageHours + 2, g);
}

export function computeOverdueRank(stats: IssueSupportStats): number {
  if (stats.daysOpen < 14) return 0;
  // S × ln(days_open)
  return stats.scoreS * Math.log(stats.daysOpen);
}

// Phase 5 Escalation Thresholds
export function shouldEscalateL1(stats: IssueSupportStats): boolean {
  const minScore = Math.max(25, 0.02 * stats.activeUsersA);
  return (
    stats.scoreS >= minScore &&
    stats.verifiedV >= 10 &&
    stats.inLocalityFraction >= 0.5 &&
    stats.ageHours >= 48
  );
}

export function shouldEscalateL2(stats: IssueSupportStats, daysSinceL1: number): boolean {
  const minScore = Math.max(100, 0.05 * stats.activeUsersA);
  return daysSinceL1 >= 7 || stats.scoreS >= minScore;
}
