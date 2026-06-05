export function scoreColor(v: number) {
  if (v >= 80) return "var(--success)";
  if (v >= 65) return "var(--primary)";
  if (v >= 50) return "var(--warning)";
  return "var(--danger)";
}

export function scoreSoft(v: number) {
  if (v >= 80) return "var(--success-soft)";
  if (v >= 65) return "var(--primary-soft)";
  if (v >= 50) return "var(--warning-soft)";
  return "var(--danger-soft)";
}
