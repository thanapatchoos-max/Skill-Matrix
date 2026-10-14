export const assessmentPanel = 'rounded-2xl border border-slate-200 bg-white shadow-sm';
export const scoreText = (value: number | null, digits = 2) => value === null ? '—' : value.toFixed(digits);
