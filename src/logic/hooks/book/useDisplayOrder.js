import { useState, useEffect, useMemo, useCallback } from 'react';

import { LIST_DISPLAY_ORDERS } from '../../../data/constants/listDisplayOrder';

import {
  getUserSetting,
  setUserSetting,
} from '../../../data/dao/userSettingsDao';

export function useDisplayOrder() {
  const [displayOrder, setDisplayOrder] = useState(null);

  const displayOrderOptions = useMemo(() => {
    return LIST_DISPLAY_ORDERS.map(item => item.label);
  }, []);

  const loadDisplayOrder = useCallback(async () => {
    try {
      const enOrder = await getUserSetting('list_display_order');
      const found = LIST_DISPLAY_ORDERS.find(item => item.value === enOrder);
      const cnOrder = found?.label ?? '按词书单元';

      setDisplayOrder(prev => (prev === cnOrder ? prev : cnOrder));
    } catch (err) {
      console.error('加载列表排序失败:', err);
      setDisplayOrder('默认排序');
    }
  }, []);

  const updateDisplayOrder = useCallback(async cnLabel => {
    try {
      const found = LIST_DISPLAY_ORDERS.find(item => item.label === cnLabel);
      const enValue = found?.value ?? 'order_index';

      await setUserSetting('list_display_order', enValue);
      setDisplayOrder(cnLabel);
    } catch (err) {
      console.error('更新列表排序失败:', err);
    }
  }, []);

  useEffect(() => {
    loadDisplayOrder();
  }, []);

  return {
    displayOrder,
    displayOrderOptions,
    updateDisplayOrder,
  };
}
