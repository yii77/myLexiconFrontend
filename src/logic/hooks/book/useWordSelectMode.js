import { useState, useCallback } from 'react';

export function useWordSelectMode() {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedWords, setSelectedWords] = useState({});

  const getItemKey = useCallback(item => {
    return item._id || item.word;
  }, []);

  const enterSelectMode = useCallback(
    item => {
      const key = getItemKey(item);
      setSelectMode(true);
      setSelectedWords({ [key]: true });
    },
    [getItemKey],
  );

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedWords({});
  }, []);

  const toggleWord = useCallback(
    item => {
      const key = getItemKey(item);
      setSelectedWords(prev => {
        const newMap = { ...prev };
        if (newMap[key]) {
          delete newMap[key];
        } else {
          newMap[key] = true;
        }
        return newMap;
      });
    },
    [getItemKey],
  );

  const isSelected = useCallback(
    item => {
      const key = getItemKey(item);
      return !!selectedWords[key];
    },
    [selectedWords, getItemKey],
  );

  // 全选所有 Section 中的所有单词
  const selectAllFromSections = useCallback(
    sections => {
      if (!sections) return;
      const map = {};
      sections.forEach(section => {
        section.data.forEach(item => {
          map[getItemKey(item)] = true;
        });
      });
      setSelectedWords(map);
    },
    [getItemKey],
  );

  // 判断某个 Section 是否处于“全选”状态
  const isSectionSelected = useCallback(
    section => {
      if (!section || !section.data || section.data.length === 0) return false;
      return section.data.every(item => !!selectedWords[getItemKey(item)]);
    },
    [selectedWords, getItemKey],
  );

  // 切换整个 Section 的选择状态
  const toggleSectionWords = useCallback(
    section => {
      if (!section || !section.data) return;

      const allInSectionSelected = isSectionSelected(section);

      setSelectedWords(prev => {
        const newMap = { ...prev };
        section.data.forEach(item => {
          const key = getItemKey(item);
          if (allInSectionSelected) {
            delete newMap[key];
          } else {
            newMap[key] = true;
          }
        });
        return newMap;
      });
    },
    [isSectionSelected, getItemKey],
  );

  return {
    selectMode,
    selectedWords,
    setSelectMode,
    setSelectedWords,
    enterSelectMode,
    exitSelectMode,
    toggleWord,
    isSelected,
    selectAllFromSections,
    toggleSectionWords,
    isSectionSelected,
  };
}
