import type { BudgetRange, ProjectTimeline, ServiceInterest } from '@prisma/client';

interface ScoreInput {
  serviceInterest: ServiceInterest;
  budgetRange: BudgetRange;
  timeline: ProjectTimeline;
  country?: string | null;
  message: string;
  sourcePage?: string | null;
}

export function scoreLead(input: ScoreInput) {
  let score = 20;

  if (input.budgetRange === 'ABOVE_5000') score += 35;
  if (input.budgetRange === 'BETWEEN_3000_5000') score += 30;
  if (input.budgetRange === 'BETWEEN_2000_3000') score += 22;
  if (input.timeline === 'ASAP') score += 20;
  if (input.timeline === 'THIS_MONTH') score += 15;
  if (['HEALTHCARE', 'ECOMMERCE', 'HRMS', 'CUSTOM_SYSTEMS'].includes(input.serviceInterest)) {
    score += 15;
  }
  if (input.country && ['us', 'usa', 'united states', 'india'].includes(input.country.toLowerCase())) {
    score += 8;
  }
  if (input.message.trim().length > 120) score += 10;
  if (input.sourcePage?.startsWith('/services/')) score += 8;

  return Math.min(score, 100);
}
