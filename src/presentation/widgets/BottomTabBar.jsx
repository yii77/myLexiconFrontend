import { memo } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { TABS } from '../../config/navigation';
import Theme from '../../config/theme/index';

export const BottomTabBar = memo(({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isFocused = tab.key === activeTab;
        const activeColor = Theme.colors.lineLightBlue;
        const color = isFocused ? activeColor : Theme.colors.textSecondary;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Image
              source={tab.icon}
              style={[styles.icon, { tintColor: color }]}
            />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: Theme.colors.bgWhite,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});
