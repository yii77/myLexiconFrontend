import { useState, useEffect, useCallback } from 'react';

import {
  getUserSetting,
  setUserSetting,
} from '../../../data/dao/userSettingsDao.js';

export function usePracticeAdvanceSetting() {
  const [settings, setSettings] = useState({
    review_plan: [1, 4, 7, 15, 30, 60],
    review_multiplier: [0.5, 0.7, 1, 1.3, 1.5],
  });

  useEffect(() => {
    (async () => {
      const plan = await getUserSetting('review_plan');
      const multiplier = await getUserSetting('review_multiplier');
      setSettings({
        review_plan: plan || [1, 4, 7, 15, 30, 60],
        review_multiplier: multiplier || [0.5, 0.7, 1, 1.3, 1.5],
      });
    })();
  }, []);

  const saveAction = useCallback(async (key, newValue) => {
    setSettings(prev => ({ ...prev, [key]: newValue }));
    await setUserSetting(key, newValue);
  }, []);

  const onAddPlan = useCallback(() => {
    const last = settings.review_plan[settings.review_plan.length - 1];
    const nextVal = last + 10;
    if (settings.review_plan.includes(nextVal)) return false;
    saveAction('review_plan', [...settings.review_plan, nextVal]);
    return true;
  }, [settings.review_plan, saveAction]);

  const onRemovePlan = useCallback(
    index => {
      if (settings.review_plan.length <= 4) return;
      const next = settings.review_plan.filter((_, i) => i !== index);
      saveAction('review_plan', next);
    },
    [settings.review_plan, saveAction],
  );

  const onEditValue = useCallback(
    (key, index, val) => {
      const numVal = Number(val);
      if (isNaN(numVal)) return { success: false, msg: '请输入有效数字' };

      // 校验重复
      if (
        key === 'review_plan' &&
        settings.review_plan.includes(numVal) &&
        settings.review_plan[index] !== numVal
      ) {
        return { success: false, msg: `该天已有复习计划` };
      }

      const next = [...settings[key]];
      next[index] = numVal;

      if (key === 'review_plan') {
        saveAction(
          key,
          next.sort((a, b) => a - b),
        );
      } else {
        saveAction(key, next);
      }
      return { success: true };
    },
    [settings, saveAction],
  );

  return {
    settings,
    onAddPlan,
    onRemovePlan,
    onEditValue,
  };
}
