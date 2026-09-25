const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatINR = (amount) => {
  const numericAmount = Number(amount);
  return INR_FORMATTER.format(Number.isFinite(numericAmount) ? numericAmount : 0);
};
