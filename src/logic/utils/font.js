import { getUserSetting } from '../../data/dao/userSettingsDao';

const FONT_MAP = {
  Merriweather: 'Merriweather_24pt',
  Montserrat: 'Montserrat',
  Nunito: 'Nunito',
  Outfit: 'Outfit',
  'Playfair Display': 'PlayfairDisplay',
  Poppins: 'Poppins',
  'Public Sans': 'PublicSans',
  'Source Serif': 'SourceSerif4',
  Raleway: 'Raleway',
};

function getAllFontKeys() {
  return Object.keys(FONT_MAP);
}

export const getFont = font => {
  if (!font) return 'System';
  return FONT_MAP[font] || font;
};

export async function getFontOptions() {
  const systemFonts = getAllFontKeys();

  try {
    const userUploadFonts = (await getUserSetting('user_upload_font')) || [];

    const combinedFonts = [...systemFonts, ...userUploadFonts];

    return [...new Set(combinedFonts)];
  } catch (error) {
    console.error('获取字体设置失败:', error);
    return systemFonts;
  }
}
