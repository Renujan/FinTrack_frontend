/**
 * Shared Formatting Utilities for FinTrack
 */

/**
 * Format currency values with user currency symbol or fallback
 */
export const formatCurrency = (
  amount: number | string | null | undefined,
  currencyCode: string = 'USD'
): string => {
  if (amount === null || amount === undefined || amount === '' || isNaN(Number(amount))) {
    amount = 0;
  }
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  const validCurrency = (currencyCode || 'USD').toUpperCase();

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    // Fallback formatting if currency symbol is unrecognized by Intl
    const symbolMap: Record<string, string> = {
      LKR: 'LKR ',
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      AUD: 'A$',
      CAD: 'C$',
    };
    const symbol = symbolMap[validCurrency] || `${validCurrency} `;
    return `${symbol}${numericAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

/**
 * Format dates consistently across the app
 */
export const formatDate = (
  dateString: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return String(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date);
  } catch {
    return String(dateString);
  }
};

/**
 * Format percentage change
 */
export const formatPercentage = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0%';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
};
