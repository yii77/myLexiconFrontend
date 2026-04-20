import { getUserSetting } from '../../data/dao/userSettingsDao';

export async function getFontOptions() {
  const systemFonts = [
    'Times New Roman',
    'Arial',
    '宋体',
    'georgia',
    '思源黑体',
  ];

  try {
    const userUploadFonts = (await getUserSetting('user_upload_font')) || [];

    const combinedFonts = [...systemFonts, ...userUploadFonts];

    return [...new Set(combinedFonts)];
  } catch (error) {
    console.error('获取字体设置失败:', error);
    return systemFonts;
  }
}
