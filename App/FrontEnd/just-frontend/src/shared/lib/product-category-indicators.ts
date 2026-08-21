import { IndicatorTone, indicatorStyles } from '@/shared/lib/status-indicators';

const categoryTones: IndicatorTone[] = ['accent', 'info', 'good', 'warning', 'neutral'];

export function getCategoryIndicatorClass(category?: string | null) {
  if (!category) return indicatorStyles.neutral;

  const toneIndex = Array.from(category).reduce((sum, character) => {
    return sum + character.codePointAt(0)!;
  }, 0) % categoryTones.length;

  return indicatorStyles[categoryTones[toneIndex]];
}
