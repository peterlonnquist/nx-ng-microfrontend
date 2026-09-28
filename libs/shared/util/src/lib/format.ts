const currency = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' });
const date = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium', timeStyle: 'short' });

export const formatPrice = (value: number): string => currency.format(value);
export const formatDate = (iso: string): string => date.format(new Date(iso));
