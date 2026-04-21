import { useContext, useMemo, useCallback, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { PracticeWordbookContext } from '../../../logic/contexts/PracticeWordbookContext';
import { PracticeMaterialQueueContext } from '../../../logic/contexts/PracticeMaterialQueueContext';

import { usePracticeMode } from '../../../logic/hooks/practice/usePracticeMode';
import { useBottomTab } from '../../../logic/hooks/ui/useBottomTab';

export function useHomeController() {
  const navigation = useNavigation();

  const { practiceWordbook, reloadPracticeWordbook } = useContext(
    PracticeWordbookContext,
  );
  const { practiceMaterialQueue, todayNewWordCount, todayReviewWordCount } =
    useContext(PracticeMaterialQueueContext);

  const { currentPracticeMode, practiceModes, selectMode } = usePracticeMode();

  const { handleTabPress } = useBottomTab();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (reloadPracticeWordbook) reloadPracticeWordbook();
    });
    return unsubscribe;
  }, [navigation, reloadPracticeWordbook]);

  const bookStats = useMemo(() => {
    if (!practiceWordbook) return null;

    const learned =
      (practiceWordbook.mastered || 0) + (practiceWordbook.learing || 0);
    const total = practiceWordbook.word_count || 0;
    const progress = total > 0 ? (learned / total) * 100 : 0;

    return {
      learned,
      total,
      progress: `${progress}%`, // 直接给 UI 字符串，UI 连百分号都不用拼
      learning: practiceWordbook.learing || 0,
      mastered: practiceWordbook.mastered || 0,
      newCount: practiceWordbook.new || 0,
      name: practiceWordbook.name,
    };
  }, [practiceWordbook]);

  // 3. 封装行为逻辑 (使用 useCallback 确保引用稳定)
  const navigateToLibrary = useCallback(() => {
    navigation.navigate('LibraryScreen');
  }, [navigation]);

  const navigateToChangeBook = useCallback(() => {
    if (!practiceWordbook) return;
    navigation.navigate('LibraryScreen', {
      practiceWordbookId: practiceWordbook._id,
    });
  }, [navigation, practiceWordbook]);

  const navigateToSettings = useCallback(() => {
    navigation.navigate('PracticeSettingScreen');
  }, [navigation]);

  const startLearning = useCallback(() => {
    navigation.navigate('PracticeScreen');
  }, [navigation, practiceMaterialQueue]);

  return {
    // 状态
    practiceWordbook,
    bookStats,
    todayNewWordCount,
    todayReviewWordCount,
    practiceModes,
    currentPracticeMode,
    // 行为
    navigateToLibrary,
    navigateToChangeBook,
    navigateToSettings,
    startLearning,
    selectMode,
    handleTabPress,
  };
}
