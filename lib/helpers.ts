export function formatAmount(amount: number): string {
  return `€ ${amount.toFixed()},-`;
}