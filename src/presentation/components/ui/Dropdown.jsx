import { useState } from 'react';
import { TouchableOpacity, Text, Image, View, StyleSheet } from 'react-native';

import upIcon from '../../../../assets/icon/up.png';
import downIcon from '../../../../assets/icon/down.png';
import selectIcon from '../../../../assets/icon/lightselect.png';
import emptyIcon from '../../../../assets/icon/empty.png';

import atomStyles from '../../styles/atom.style';
import generalStyles from '../../styles/general.style';

import Theme from '../../../config/theme/index';

export function Dropdown({
  options = [],
  value,
  onSelect,
  placeholder = '请选择',
  renderTrigger,
  renderContent,
  containerStyle,
  triggerStyle,
  labelStyle,
  triggerArrowStyle,
  menuStyle,
  itemStyle,
  itemTextStyle,
  zIndex = 10,
}) {
  const [visible, setVisible] = useState(false);

  const [menuWidth, setMenuWidth] = useState(120);
  const [maxWidth, setMaxWidth] = useState(0);

  return (
    <View style={[styles.dropdownContainer, containerStyle]}>
      {/* 触发器 */}
      {renderTrigger ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setVisible(v => !v)}
        >
          {renderTrigger(visible)}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.trigger, triggerStyle]}
          activeOpacity={0.8}
          onPress={() => setVisible(v => !v)}
        >
          <Text style={[styles.label, labelStyle]}>{value ?? placeholder}</Text>
          <Image
            source={visible ? upIcon : downIcon}
            style={[styles.arrow, triggerArrowStyle]}
          />
        </TouchableOpacity>
      )}

      {/* 菜单 */}
      {visible && (
        <>
          {/* 遮罩 */}
          <TouchableOpacity
            style={generalStyles.visible}
            onPress={() => setVisible(false)}
          />

          <View style={[{ zIndex, width: menuWidth }, styles.menu, menuStyle]}>
            {renderContent
              ? renderContent({ close: () => setVisible(false) })
              : options.map((opt, index) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.item,
                      typeof itemStyle === 'function'
                        ? itemStyle(opt, index)
                        : itemStyle,
                    ]}
                    onPress={() => {
                      onSelect(opt);
                      setVisible(false);
                    }}
                  >
                    <View
                      style={[generalStyles.rowContainer, atomStyles.gap10]}
                    >
                      {/* 选中状态 */}
                      <Image
                        source={opt === value ? selectIcon : emptyIcon}
                        style={generalStyles.smallIcon}
                      />

                      {/* 文本（测量宽度） */}
                      <Text
                        onLayout={e => {
                          const width = e.nativeEvent.layout.width;

                          if (width > maxWidth) {
                            setMaxWidth(width);
                            setMenuWidth(width + 50);
                          }
                        }}
                        style={[
                          generalStyles.textBody,
                          typeof itemTextStyle === 'function'
                            ? itemTextStyle(opt, index)
                            : itemTextStyle,
                        ]}
                      >
                        {opt}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  arrow: {
    width: 20,
    height: 20,
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    borderColor: Theme.colors.divider1,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
