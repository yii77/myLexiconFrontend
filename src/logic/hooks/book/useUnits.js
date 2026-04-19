import { useState, useEffect, useCallback } from 'react';

import {
  getBookUnits,
  updateWordsUnitInfo,
  updateUnitTitle,
} from '../../../data/dao/wordBookMappingDao';

import { useToast } from '../../../presentation/components/system/Toast/useToast';

export function useUnits(bookId) {
  const [units, setUnits] = useState([]);

  const { showToast } = useToast();

  const fetchUnits = useCallback(async () => {
    if (!bookId) {
      setUnits([]);
      return;
    }

    try {
      const unitList = await getBookUnits(bookId);
      setUnits(unitList || []);
    } catch (err) {
      console.error('加载单元失败:', err);
      setUnits([]);
    }
  }, [bookId]);

  useEffect(() => {
    fetchUnits();
  }, [bookId]);

  const checkTitleExists = (title, units) => {
    if (!title || !units) return false;

    return units.some(u => u.title.trim() === title.trim());
  };

  const renameUnit = useCallback(async (bookId, previousTitle, newTitle) => {
    if (!bookId || !previousTitle || !newTitle) {
      return false;
    }

    const normalizedNewTitle = newTitle.trim();
    if (previousTitle === normalizedNewTitle) {
      return true;
    }
    const isDuplicate = units?.some(u => u.title === normalizedNewTitle);

    if (isDuplicate) {
      showToast({
        message: '已有该单元，请重新输入',
        type: 'error',
      });
      return false;
    }

    try {
      const success = await updateUnitTitle(bookId, previousTitle, newTitle);

      if (success) {
        setUnits(prev =>
          prev.map(u =>
            u.title === previousTitle ? { ...u, title: newTitle } : u,
          ),
        );

        return true;
      }

      return false;
    } catch (err) {
      showToast({
        message: `更新单元名称失败，${err}`,
        type: 'error',
      });
      throw err;
    }
  }, []);

  return {
    units,
    renameUnit,
    checkTitleExists,
  };
}
