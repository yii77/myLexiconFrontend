export const mapFont = font => {
  if (!font) return 'System';

  const key = font.trim();

  const FONT_MAP = {
    'Times New Roman': 'TimesNewRoman',
    Arial: 'Arial',
    宋体: 'simsun',
    georgia: 'georgia',
    思源黑体: 'SourceHanSans',
  };

  return FONT_MAP[key] || key;
};
