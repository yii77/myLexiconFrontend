import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import {
  getSectionsByUnit,
  getSectionsByAlphabet,
  getSectionsByCreateTime,
} from '../../../data/dao/wordBookMappingDao';

export function useWordSections(bookId, displayOrder) {
  const [sections, setSections] = useState([]);

  const wordArray = useMemo(() => {
    return sections.flatMap(section => section.data.map(item => item.word));
  }, [sections]);

  const fetchSections = useCallback(async () => {
    if (!bookId) {
      setSections([]);
      return;
    }

    try {
      let data = [];

      if (displayOrder === 'unit') {
        data = await getSectionsByUnit(bookId);
      } else if (displayOrder === 'alphabet') {
        data = await getSectionsByAlphabet(bookId);
      } else if (displayOrder === 'create_time_asc') {
        data = await getSectionsByCreateTime(bookId, 'ASC');
      } else if (displayOrder === 'create_time_desc') {
        data = await getSectionsByCreateTime(bookId, 'DESC');
      }

      setSections(data || []);
    } catch (err) {
      console.error('加载单词分组失败:', err);
      setSections([]);
    }
  }, [bookId, displayOrder]);

  const updateSectionsByDelete = useCallback(wordIds => {
    setSections(prevSections => {
      return prevSections
        .map(section => ({
          ...section,
          data: section.data.filter(item => !wordIds.includes(item._id)),
        }))

        .filter(section => section.data.length > 0);
    });
  }, []);

  const updateSectionsByMoveToUnit = useCallback(
    (wordIds, targetUnitId, targetUnitTitle) => {
      if (displayOrder !== 'unit') return;
      setSections(prevSections => {
        let movedItems = [];

        const idSet = new Set(wordIds);

        const updated = prevSections.map(section => {
          const toMove = section.data.filter(item => idSet.has(item._id));

          if (toMove.length) {
            movedItems = movedItems.concat(toMove);
          }

          return {
            ...section,
            data: section.data.filter(item => !idSet.has(item._id)),
          };
        });

        // 判断是否已存在 target unit
        let targetExists = false;

        const finalSections = updated.map(section => {
          if (section.key === targetUnitId) {
            targetExists = true;

            return {
              ...section,
              data: [...section.data, ...movedItems],
            };
          }
          return section;
        });

        // 不存在 → 新建 section
        if (!targetExists && movedItems.length > 0) {
          finalSections.push({
            type: 'unit',
            key: targetUnitId,
            title: targetUnitTitle,
            data: movedItems,
          });
        }

        // 清理空 unit
        return finalSections.filter(section => section.data.length > 0);
      });
    },
    [displayOrder],
  );

  const updateSectionTitle = useCallback(
    (unitId, newTitle) => {
      if (!unitId || !newTitle) return;
      if (displayOrder !== 'unit') return;

      setSections(prev => {
        let changed = false;

        const next = prev.map(section => {
          if (section.key !== unitId) {
            return section;
          }

          if (section.title === newTitle) return section;

          changed = true;

          return {
            ...section,
            title: newTitle,
          };
        });

        return changed ? next : prev;
      });
    },
    [displayOrder],
  );

  useEffect(() => {
    fetchSections();
  }, [bookId, displayOrder]);

  return {
    sections,
    wordArray,
    updateSectionsByDelete,
    updateSectionsByMoveToUnit,
    updateSectionTitle,
  };
}
