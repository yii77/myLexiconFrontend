import { createContext, useEffect, useState } from 'react';

import { getUserSetting } from '../../data/dao/userSettingsDao';

import { mapFont } from '../utils/mapFont';

export const FontContext = createContext(null);

export function FontProvider({ children }) {
  const [fonts, setFonts] = useState(null);

  const loadFonts = async () => {
    const en = await getUserSetting('english_font');
    const cn = await getUserSetting('chinese_font');

    setFonts({
      english: { fontFamily: mapFont(en?.fontFamily) },
      chinese: { fontFamily: mapFont(cn?.fontFamily) },
    });
  };

  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <FontContext.Provider value={{ fonts, reloadFonts: loadFonts }}>
      {children}
    </FontContext.Provider>
  );
}
