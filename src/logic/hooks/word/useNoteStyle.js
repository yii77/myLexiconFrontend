import { useState, useEffect, useRef } from 'react';

import { getUserSetting } from '../../../data/dao/userSettingsDao';

import { DEFAULT_SETTINGS } from '../../../data/constants/defaultSettings';

export function useNoteStyle({ editingNote, cellTexts, cols }) {
  // ========== 第一行内容作为 key ==========
  const firstRowOptions = Array.from({ length: cols }).map(
    (_, colIndex) => cellTexts?.[0]?.[colIndex] || `列 ${colIndex + 1}`,
  );

  // ========== 样式对象 ==========
  const [noteStyles, setNoteStyles] = useState(editingNote?.noteStyles ?? {});

  const prevFirstRowOptions = useRef([]);

  const [activeStyleCardIndex, setActiveStyleCardIndex] = useState(0);

  // ========== 展示模式：支持数据库 & 编辑原笔记 ==========
  const [note_display_type, setNoteDisplayType] = useState('col');

  useEffect(() => {
    async function loadDisplayType() {
      if (editingNote?.note_display_type) {
        setNoteDisplayType(editingNote.note_display_type);
      } else {
        const userDisplay = await getUserSetting('note_display_type');
        setNoteDisplayType(userDisplay ?? DEFAULT_SETTINGS.note_display_type);
      }
    }
    loadDisplayType();
  }, []);

  // ========== 初始化 noteStyles（支持编辑 & 用户默认） ==========
  useEffect(() => {
    async function initNoteStyles() {
      const userDefaultStyle =
        (await getUserSetting('note_default_style')) ??
        DEFAULT_SETTINGS.note_default_style;

      const baseStyles = editingNote?.noteStyles ?? {};

      const merged = {};

      firstRowOptions.forEach(colKey => {
        merged[colKey] = {
          ...userDefaultStyle,
          ...(baseStyles[colKey] ?? {}),
        };
      });

      setNoteStyles(merged);
      prevFirstRowOptions.current = firstRowOptions;
    }

    initNoteStyles();
  }, []);

  useEffect(() => {
    setNoteStyles(prev => {
      const newData = { ...prev };

      firstRowOptions.forEach((key, index) => {
        const oldKey = prevFirstRowOptions.current[index];

        if (oldKey && oldKey !== key) {
          newData[key] = newData[oldKey];
          delete newData[oldKey];
        } else if (!newData[key]) {
          // 新列 → 动态创建用户默认样式
          newData[key] = {
            ...DEFAULT_SETTINGS.note_default_style,
          };
        }
      });

      prevFirstRowOptions.current = firstRowOptions;
      return newData;
    });
  }, [firstRowOptions.join('|')]);

  // ========== 更新单个样式项 ==========
  const updateCardData = (colKey, field, value) => {
    setNoteStyles(prev => ({
      ...prev,
      [colKey]: {
        ...prev[colKey],
        [field]: value,
      },
    }));
  };

  return {
    note_display_type,
    setNoteDisplayType,
    firstRowOptions,
    noteStyles,
    setNoteStyles,
    activeStyleCardIndex,
    setActiveStyleCardIndex,
    updateCardData,
  };
}
