type Currency = 'AMD' | 'RUB' | 'EUR'; // Define allowed currencies

export const currencyMulti: Record<Currency, () => Partial<Record<Currency, (value: number) => number>>> = {
  AMD: () => ({
    EUR: (value: number) => value / 426,
  }),
  RUB: () => ({
    EUR: (value: number) => value / 100,
  }),
  EUR: () => ({
    // No conversions defined here yet, but we could add them if needed
  }),
};

export function convertCurrency({ from, to }: { from: Currency; to: Currency }) {
  // Check if the conversion function exists for the given currency pair
  const multiFn = currencyMulti[from]()?.[to];

  if (!multiFn) {
    throw new Error(`Conversion from ${from} to ${to} is not supported.`);
  }

  return (value: number): number => {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid value provided for conversion.');
    }
    return +multiFn(value).toFixed(2);
  };
}
