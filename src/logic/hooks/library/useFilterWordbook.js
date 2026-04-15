import { useState, useEffect, useMemo, useCallback } from 'react';

export function useFilterWordbook(wordbooks, categories) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
      setSelectedSubcategory(categories[0].subcategories[0]);
    }
  }, [categories, selectedCategory]);

  const wordbookMap = useMemo(() => {
    const map = {
      我的: new Map(),
    };

    for (const wb of wordbooks) {
      if (wb.source_type === 'user') {
        if (!map['我的'].has(wb.subcategory)) {
          map['我的'].set(wb.subcategory, []);
        }
        map['我的'].get(wb.subcategory).push(wb);
        continue;
      }

      if (!map[wb.category]) {
        map[wb.category] = new Map();
      }

      if (!map[wb.category].has(wb.subcategory)) {
        map[wb.category].set(wb.subcategory, []);
      }

      map[wb.category].get(wb.subcategory).push(wb);
    }

    return map;
  }, [wordbooks]);

  const selectCategory = useCallback(category => {
    setSelectedCategory(category);
    setSelectedSubcategory(category.subcategories[0] || null);
  }, []);

  const selectSubcategory = useCallback(subcategory => {
    setSelectedSubcategory(subcategory);
  }, []);

  // 过滤词书
  const filteredWordbooks = useMemo(() => {
    if (!selectedCategory) return [];

    const catName = selectedCategory.name;
    const sub = selectedSubcategory;

    const catMap = wordbookMap[catName];
    if (!catMap) return [];

    if (sub === '全部') {
      return Array.from(catMap.values()).flat();
    }

    return catMap.get(sub) || [];
  }, [wordbookMap, selectedCategory, selectedSubcategory]);

  return {
    selectedCategory,
    selectedSubcategory,
    filteredWordbooks,

    selectCategory,
    selectSubcategory,
  };
}
