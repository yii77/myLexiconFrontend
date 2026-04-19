import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getWordbookStats } from '../../data/repository/getWordbookStats';

export const PracticeWordbookContext = createContext(null);

export function PracticeWordbookProvider({ children }) {
  const [practiceWordbook, setPracticeWordbook] = useState(null);

  const loadPracticeWordbook = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('practiceWordbook');

      if (!data) {
        setPracticeWordbook(null);
        return;
      }

      const storedWordbook = JSON.parse(data);

      const stats = await getWordbookStats(storedWordbook._id);

      if (stats) {
        setPracticeWordbook({
          ...storedWordbook,
          word_count: stats.word_count,
          learning: stats.learning_count,
          mastered: stats.mastered_count,
          new: stats.new_count,
        });
      } else {
        setPracticeWordbook(storedWordbook);
      }
    } catch (e) {
      console.log('读取词书失败', e);
    }
  }, []);

  const refreshWordbookStats = useCallback(async () => {
    if (!practiceWordbook) return;

    try {
      const stats = await getWordbookStats(practiceWordbook._id);

      if (stats) {
        setPracticeWordbook(prev => ({
          ...prev,
          word_count: stats.word_count,
          learning: stats.learning_count,
          mastered: stats.mastered_count,
          new: stats.new_count,
        }));
      }
    } catch (e) {
      console.log('刷新单词统计失败', e);
    }
  }, [practiceWordbook]);

  const savePracticeWordbook = useCallback(async book => {
    try {
      await AsyncStorage.setItem('practiceWordbook', JSON.stringify(book));
      loadPracticeWordbook();
    } catch (e) {
      console.log('保存 practiceWordbook 失败', e);
    }
  }, []);

  useEffect(() => {
    loadPracticeWordbook();
  }, []);

  const value = useMemo(
    () => ({
      practiceWordbook,
      reloadPracticeWordbook: loadPracticeWordbook,
      savePracticeWordbook,
      refreshWordbookStats,
    }),
    [practiceWordbook],
  );

  return (
    <PracticeWordbookContext.Provider value={value}>
      {children}
    </PracticeWordbookContext.Provider>
  );
}
