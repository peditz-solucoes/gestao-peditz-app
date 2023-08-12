export function formatCurrency(value: number, locale: string = 'pt-BR', currency: string = 'BRL'): string {
  const formattedValue = value.toLocaleString(locale, { style: 'currency', currency });
  return formattedValue;
}