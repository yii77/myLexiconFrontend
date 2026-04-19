import { useState, useCallback, useMemo, useEffect } from 'react';

export function useWordSwitch(initialWord, wordArray) {
  // 1. 如果没有 wordArray，直接设索引为 0
  const [currentIndex, setCurrentIndex] = useState(() => {
    return wordArray && initialWord ? wordArray.indexOf(initialWord) : 0;
  });

  useEffect(() => {
    if (wordArray && initialWord) {
      const index = wordArray.indexOf(initialWord);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [initialWord, wordArray]);

  const currentWord = useMemo(() => {
    if (!wordArray || wordArray.length === 0) return initialWord;
    return wordArray[currentIndex] || initialWord;
  }, [wordArray, currentIndex, initialWord]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(i => {
      if (!wordArray) return i;
      return Math.min(wordArray.length - 1, i + 1);
    });
  }, [wordArray]);

  return {
    currentIndex,
    currentWord,
    goPrev,
    goNext,
  };
}
