import { useState, useContext, useEffect, useCallback } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { PracticeWordbookContext } from '../../contexts/PracticeWordbookContext';

import { useToast } from '../../../presentation/components/system/Toast/useToast';

export function useDisplayBook() {
  const [displayBook, setDisplayBook] = useState(null);

  const { practiceWordbook } = useContext(PracticeWordbookContext);

  const { showToast } = useToast();

  const loadDisplayBook = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('displayBook');

      const display = data ? JSON.parse(data) : practiceWordbook;

      setDisplayBook(display);
      return display;
    } catch (err) {
      console.error('读取 displayWordbook 失败:', err);
      return practiceWordbook;
    }
  }, [practiceWordbook]);

  const updateDisplayBook = useCallback(async newBook => {
    try {
      await AsyncStorage.setItem('displayBook', JSON.stringify(newBook));

      setDisplayBook(newBook);

      return true;
    } catch (err) {
      showToast({
        message: `更换词书失败，${err}`,
        type: 'error',
      });
      return false;
    }
  }, []);

  useEffect(() => {
    loadDisplayBook();
  }, [loadDisplayBook]);

  return { displayBook, updateDisplayBook };
}
