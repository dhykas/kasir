export default function normalizeNumber(numberString: string) {
  const numericString = numberString.replace(/[^\d]/g, '');

  const numericValue = parseInt(numericString, 10);

  return numericValue;
}