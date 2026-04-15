import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import { getUserSetting, setUserSetting } from '../../data/dao/userSettingsDao';

const CONFIG_KEYS = [
  'daily_new_limit',
  'daily_review_limit',
  'daily_total_limit',
  'study_order',
  'review_order',
  'practice_mode',
];

export const PracticeConfigContext = createContext(null);

export function PracticeConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  const loadConfig = useCallback(async () => {
    const entries = await Promise.all(
      CONFIG_KEYS.map(async key => [key, await getUserSetting(key)]),
    );
    setConfig(Object.fromEntries(entries));
  }, []);

  const updateConfig = useCallback(async patch => {
    await Promise.all(
      Object.entries(patch).map(([key, value]) => setUserSetting(key, value)),
    );
    await loadConfig();
  }, []);

  useEffect(() => {
    loadConfig();
  }, []);

  const value = useMemo(
    () => ({ config, reloadConfig: loadConfig, updateConfig }),
    [config],
  );

  return (
    <PracticeConfigContext.Provider value={value}>
      {children}
    </PracticeConfigContext.Provider>
  );
}
