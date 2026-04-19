import { useState, useCallback, useMemo, useRef } from 'react';

export const useSectionExpand = sections => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const sectionCacheRef = useRef({});

  const toggleSection = useCallback(key => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const expandAllSections = useCallback(() => {
    setExpandedKeys(new Set(sections.map(section => section.key)));
  }, [sections]);

  const collapseAllSections = useCallback(() => {
    setExpandedKeys(new Set());
  }, []);

  const displaySections = useMemo(() => {
    return sections.map(s => {
      const isExpanded = expandedKeys.has(s.key);
      const prevCachedSection = sectionCacheRef.current[s.key];

      // 命中缓存逻辑
      if (
        prevCachedSection &&
        prevCachedSection._isExpanded === isExpanded &&
        prevCachedSection._sourceData === s.data
      ) {
        return prevCachedSection;
      }

      // 生成新 Section 对象并更新缓存
      const newSection = {
        ...s,
        data: isExpanded ? s.data : [],
        _isExpanded: isExpanded,
        _sourceData: s.data,
      };

      sectionCacheRef.current[s.key] = newSection;
      return newSection;
    });
  }, [sections, expandedKeys]);

  return {
    displaySections,
    expandedKeys,
    toggleSection,
    expandAllSections,
    collapseAllSections,
  };
};
