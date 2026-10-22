// Presentation only: percentages are returned unchanged by the licensed model.
export function describeRiskFrequency(value: number, years: 10 | 30, outcome: string): string {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError('Risk must be a percentage between 0 and 100.');
  }
  const perThousand = value < 1;
  const count = value * (perThousand ? 10 : 1);
  const people = count > 0 && count < 0.1 ? '少於 0.1' : `約 ${Number(count.toFixed(1))}`;
  const label = /^[A-Za-z]/.test(outcome) ? ` ${outcome}` : outcome;
  return `依模型估計，每 ${perThousand ? '1,000' : '100'} 位風險因子相近的人中，${people} 位可能在未來 ${years} 年發生${label}。`;
}
