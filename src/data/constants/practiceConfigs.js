export const PRACTICE_MODES = [
  { label: '混合模式', value: 'mixed' },
  { label: '先学新词', value: 'new_first' },
  { label: '优先复习', value: 'review_first' },
  { label: '只复习', value: 'review_only' },
];

export const STUDY_ORDERS = [
  { label: '词书顺序', value: 'book' },
  { label: '字母顺序', value: 'alphabet' },
  { label: '随机顺序', value: 'random' },
];

export const REVIEW_ORDERS = [
  { label: '时间顺序', value: 'time' },
  { label: '字母顺序', value: 'alphabet' },
  { label: '随机顺序', value: 'random' },
];

export const BRUSH_MODE_LABEL = {
  enToCn: '英文选中',
  cnToEn: '中文选英',
  spelling: '单词拼写',
  recall: '回忆模式',
};

export const BRUSH_MODE_KEYS = Object.keys(BRUSH_MODE_LABEL);

export const getLabelByValue = (list, value) => {
  const item = list.find(i => i.value === value);
  return item ? item.label : value;
};
