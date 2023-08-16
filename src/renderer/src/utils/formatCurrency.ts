export function formatCurrency(value: number, locale: string = 'pt-BR', currency: string = 'BRL'): string {
  console.log('formatCurrency', value)
  const formattedValue = value?.toLocaleString(locale, { style: 'currency', currency });
  return formattedValue;
}