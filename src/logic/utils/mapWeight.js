export const mapWeight = weight => {
  if (!weight) return '400';

  const key = weight.trim();

  const WEIGHT_MAP = {
    UltraLight: '100',
    Thin: '200',
    Light: '300',
    Regular: '400',
    Medium: '500',
    Semibold: '600',
    Bold: '700',
    Heavy: '800',
    Black: '900',
  };

  return WEIGHT_MAP[key] || '400';
};
