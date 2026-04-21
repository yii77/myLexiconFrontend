import { useContext, useMemo, useCallback } from 'react';

import { PRACTICE_MODES } from '../../../data/constants/practiceConfigs';

import { PracticeConfigContext } from '../../contexts/PracticeConfigContext';

export function usePracticeMode() {
  const { config, updateConfig } = useContext(PracticeConfigContext);

  const practiceModes = useMemo(
    () => PRACTICE_MODES.map(item => item.label),
    [],
  );

  const currentPracticeMode = useMemo(() => {
    return PRACTICE_MODES.find(item => item.value === config?.practice_mode)
      ?.label;
  }, [config?.practice_mode]);

  const selectMode = useCallback(
    async selectedMode => {
      try {
        const modeValue = PRACTICE_MODES.find(
          item => item.label === selectedMode,
        )?.value;

        if (!modeValue) return;

        if (modeValue !== config?.practice_mode) {
          await updateConfig({ practice_mode: modeValue });
        }
      } catch (err) {
        console.error('更新学习模式失败：', err);
      }
    },
    [config?.practice_mode, updateConfig],
  );

  return {
    currentPracticeMode,
    practiceModes,
    selectMode,
  };
}
