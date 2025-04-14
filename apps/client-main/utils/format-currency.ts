export const formatCurrency = (
  value: number,
  currencyName: 'USD' | 'EUR' | 'UAH'
): string => {
  const options = {
    USD: '$USD',
    EUR: '€EUR',
    UAH: '₴UAH',
  }

  return `${value.toFixed(2)} ${options[currencyName]}`
}
