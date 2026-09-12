export const formatCurrency = (value: string): string => {
  // Remove non-digit characters
  const cleanValue = value.replace(/\D/g, '');
  
  // Return empty if no digits
  if (!cleanValue) return '';
  
  // Format with thousands separator
  return Number(cleanValue).toLocaleString('es-CO');
};

export const parseCurrency = (formattedValue: string): number => {
  // Remove non-digit characters and convert to number
  const cleanValue = formattedValue.replace(/\D/g, '');
  return cleanValue ? Number(cleanValue) : 0;
};

export const formatCurrencyDisplay = (value: number): string => {
  return `$${value.toLocaleString('es-CO')}`;
};
