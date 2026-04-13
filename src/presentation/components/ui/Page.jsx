import { View, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Theme from '../../../config/theme/index';

export function Page({ children, backgroundColor, pageStyle }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.appPage,
        backgroundColor && { backgroundColor },
        pageStyle,
      ]}
    >
      {/* 顶部安全区 */}
      <View style={{ height: insets.top }} />

      {/* 内容 */}
      {children}

      {/* 底部安全区 */}
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  appPage: {
    flex: 1,
    backgroundColor: Theme.colors.bgGray,
  },
});
