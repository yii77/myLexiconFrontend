import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { TAB_ROUTE_MAP } from '../../../config/navigation';

export function useBottomTab() {
  const navigation = useNavigation();

  const handleTabPress = useCallback(
    (pressedKey, currentKey) => {
      if (pressedKey === currentKey) return;

      const targetRoute = TAB_ROUTE_MAP[pressedKey];
      if (targetRoute) {
        navigation.replace(targetRoute);
      }
    },
    [navigation],
  );

  return { handleTabPress };
}
