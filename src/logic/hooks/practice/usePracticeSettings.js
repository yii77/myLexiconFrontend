import { useState, useEffect, useContext, useCallback } from 'react';

import {
  getUserSetting,
  setUserSetting,
} from '../../../data/dao/userSettingsDao.js';

import {
  PRACTICE_MODES,
  STUDY_ORDERS,
  REVIEW_ORDERS,
} from '../../../data/constants/practiceConfigs.js';

import { PracticeConfigContext } from '../../contexts/PracticeConfigContext.js';

const DEFAULT_BRUSH_MODES = {
  enToCn: true,
  cnToEn: true,
  spelling: true,
  recall: true,
};

export function usePracticeSettings() {
  const { config, updateConfig } = useContext(PracticeConfigContext);

  const [settings, setSettings] = useState({
    dailyNewLimit: 0,
    dailyReviewLimit: 0,
    dailyTotalLimit: 0,
    practiceMode: 'review_first',
    practiceOrder: 'book',
    reviewOrder: 'time',
    brushModes: DEFAULT_BRUSH_MODES,
  });

  useEffect(() => {
    if (!config) return;
    setSettings(prev => ({
      ...prev,
      dailyNewLimit: config.daily_new_limit ?? 0,
      dailyReviewLimit: config.daily_review_limit ?? 0,
      dailyTotalLimit: config.daily_total_limit ?? 0,
      practiceMode: config.practice_mode ?? 'review_first',
      practiceOrder: config.study_order ?? 'book',
      reviewOrder: config.review_order ?? 'time',
    }));
  }, [config]);

  useEffect(() => {
    (async () => {
      const bModes = await getUserSetting('brush_modes');
      if (bModes) setSettings(prev => ({ ...prev, brushModes: bModes }));
    })();
  }, []);

  const updateSettingField = useCallback(
    async (field, value, configKey, isLocalOnly = false) => {
      try {
        setSettings(prev => ({ ...prev, [field]: value }));

        if (isLocalOnly) {
          await setUserSetting(configKey, value);
        } else {
          await updateConfig({ [configKey]: value });
        }
      } catch (error) {
        console.error(`Update ${field} failed:`, error);
      }
    },
    [updateConfig],
  );

  const getSheetOptions = useCallback(
    type => {
      const numOpts = max =>
        Array.from({ length: max }, (_, i) => (i + 1) * 10);

      const configMap = {
        dailyNewLimit: {
          options: numOpts(50),
          onSelect: v =>
            updateSettingField('dailyNewLimit', v, 'daily_new_limit'),
        },
        dailyReviewLimit: {
          options: numOpts(50),
          onSelect: v =>
            updateSettingField('dailyReviewLimit', v, 'daily_review_limit'),
        },
        dailyTotalLimit: {
          options: numOpts(50),
          onSelect: v =>
            updateSettingField('dailyTotalLimit', v, 'daily_total_limit'),
        },
        practiceMode: {
          options: PRACTICE_MODES.map(m => m.label),
          onSelect: label => {
            const val = PRACTICE_MODES.find(m => m.label === label)?.value;
            updateSettingField('practiceMode', val, 'learning_mode');
          },
        },
        practiceOrder: {
          options: STUDY_ORDERS.map(o => o.label),
          onSelect: label => {
            const val = STUDY_ORDERS.find(o => o.label === label)?.value;
            updateSettingField('practiceOrder', val, 'study_order');
          },
        },
        reviewOrder: {
          options: REVIEW_ORDERS.map(o => o.label),
          onSelect: label => {
            const val = REVIEW_ORDERS.find(o => o.label === label)?.value;
            updateSettingField('reviewOrder', val, 'review_order');
          },
        },
      };

      return configMap[type] || { options: [], onSelect: null };
    },
    [updateSettingField],
  );

  const toggleBrushMode = useCallback(
    key => {
      setSettings(prev => {
        const next = { ...prev.brushModes, [key]: !prev.brushModes[key] };
        updateSettingField('brushModes', next, 'brush_modes', true);
        return { ...prev, brushModes: next };
      });
    },
    [updateSettingField],
  );

  return {
    ...settings,
    toggleBrushMode,
    getSheetOptions,
  };
}
