import React, { memo, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import {
  PRACTICE_MODES,
  STUDY_ORDERS,
  REVIEW_ORDERS,
  getLabelByValue,
  BRUSH_MODE_KEYS,
  BRUSH_MODE_LABEL,
} from '../../../data/constants/practiceConfigs';

import { usePracticeSettings } from '../../../logic/hooks/practice/usePracticeSettings';
import { useCustomAlert } from '../../../presentation/components/system/Alert/useCustomAlert';

import { Page } from '../../components/ui/Page';
import { CommonHeader } from '../../components/ui/Header';
import { TextButton } from '../../components/ui/Button';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import backIcon from '../../../../assets/icon/back.png';
import selectIcon from '../../../../assets/icon/select.png';
import emptyIcon from '../../../../assets/icon/empty.png';
import rightIcon from '../../../../assets/icon/right.png';

export default function PracticeSettingScreen({ navigation }) {
  const { getSheetOptions, toggleBrushMode, brushModes, ...settings } =
    usePracticeSettings();
  const { showAlert, hideAlert } = useCustomAlert();

  const isBrushModeOpen = useRef(false);

  const getBrushAlertContent = useCallback(
    () => (
      <BrushModeContent
        brushModes={brushModes}
        onToggle={key => toggleBrushMode(key)}
      />
    ),
    [brushModes, toggleBrushMode],
  );

  useEffect(() => {
    if (isBrushModeOpen.current) {
      showAlert({
        content: getBrushAlertContent(),
        type: 'bottom',
      });
    }
  }, [brushModes, getBrushAlertContent, showAlert]);

  const openOptions = useCallback(
    type => {
      const { options, onSelect } = getSheetOptions(type);
      showAlert({
        content: (
          <OptionsList
            options={options}
            onSelect={val => {
              onSelect?.(val);
              hideAlert();
            }}
          />
        ),
        type: 'bottom',
        style: styles.optionAlert,
      });
    },
    [getSheetOptions, showAlert, hideAlert],
  );

  const openBrushMode = useCallback(() => {
    isBrushModeOpen.current = true;
    showAlert({
      content: getBrushAlertContent(),
      type: 'bottom',
    });
  }, [getBrushAlertContent, showAlert]);

  return (
    <Page>
      <CommonHeader
        title="练习设置"
        headerStyle={[
          atomStyles.marginHorizontal16,
          atomStyles.paddingVertical16,
        ]}
        leftImageSource={backIcon}
        onLeftPress={() => navigation.goBack()}
      />

      <DividingLine />

      <SettingGroup
        config={[
          { label: '每日新词上限', key: 'dailyNewLimit' },
          { label: '每日复习上限', key: 'dailyReviewLimit' },
          { label: '每日总数上限', key: 'dailyTotalLimit' },
        ]}
        values={settings}
        onPress={openOptions}
      />

      <DividingLine />

      <SettingGroup
        config={[
          {
            label: '练习模式',
            key: 'practiceMode',
            displayValue: getLabelByValue(
              PRACTICE_MODES,
              settings.practiceMode,
            ),
          },
          {
            label: '新词顺序',
            key: 'practiceOrder',
            displayValue: getLabelByValue(STUDY_ORDERS, settings.practiceOrder),
          },
          {
            label: '复习顺序',
            key: 'reviewOrder',
            displayValue: getLabelByValue(REVIEW_ORDERS, settings.reviewOrder),
          },
        ]}
        values={settings}
        onPress={openOptions}
      />

      <DividingLine />

      <SettingItem
        label="刷词模式"
        onPress={openBrushMode}
        right={
          <Image
            source={rightIcon}
            style={[generalStyles.smallIcon, generalStyles.triggerArrowStyle]}
          />
        }
      />

      <DividingLine />

      <SettingItem
        label="高级设置"
        onPress={() => navigation.navigate('AdvancePracticeSetting')}
        right={
          <Image
            source={rightIcon}
            style={[generalStyles.smallIcon, generalStyles.triggerArrowStyle]}
          />
        }
      />
    </Page>
  );
}

const OptionsList = memo(({ options, onSelect }) => {
  if (!options || options.length === 0) return null;
  return (
    <View>
      {options.map(opt => (
        <TextButton
          key={String(opt)}
          title={String(opt)}
          onPress={() => onSelect(opt)}
          buttonStyle={[
            atomStyles.paddingHorizontal16,
            atomStyles.paddingVertical14,
          ]}
          textStyle={generalStyles.textOptions}
        />
      ))}
    </View>
  );
});

const BrushModeContent = memo(({ brushModes, onToggle }) => (
  <View style={[atomStyles.gap16, atomStyles.paddingBottom16]}>
    <Text
      style={[
        generalStyles.textPrompt,
        atomStyles.textCenter,
        atomStyles.fw600,
      ]}
    >
      刷词模式
    </Text>
    <View
      style={[
        generalStyles.rowBetweenContainer,
        atomStyles.wrap,
        atomStyles.gap16,
      ]}
    >
      {BRUSH_MODE_KEYS.map(key => {
        const isActive = brushModes[key];
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onToggle(key)}
            activeOpacity={0.75}
            style={[
              generalStyles.rowCenterContainer,
              styles.brushModeOption,
              isActive && styles.brushModeOptionSelected,
            ]}
          >
            <Image
              source={isActive ? selectIcon : emptyIcon}
              style={[
                generalStyles.smallIcon,
                isActive ? atomStyles.tintBlue : null,
                styles.selectIcon,
              ]}
            />
            <Text
              style={[
                generalStyles.textOptions,
                isActive ? atomStyles.darkBlue : atomStyles.gary2,
              ]}
            >
              {BRUSH_MODE_LABEL[key]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
));

const SettingItem = memo(
  ({ label, right, onPress, containerStyle, labelStyle }) => (
    <TouchableOpacity
      style={[
        generalStyles.rowBetweenContainer,
        atomStyles.paddingHorizontal16,
        atomStyles.paddingVertical16,
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[generalStyles.textOptionsBlack, labelStyle]}>{label}</Text>
      {right}
    </TouchableOpacity>
  ),
);

const SettingGroup = memo(({ config, values, onPress }) => (
  <View style={atomStyles.paddingVertical10}>
    {config.map(item => (
      <SettingItem
        key={item.key}
        label={item.label}
        onPress={() => onPress(item.key)}
        right={
          <View style={[generalStyles.rowContainer, atomStyles.gap8]}>
            <Text style={generalStyles.textOptionsGray}>
              {item.displayValue ?? values[item.key]}
            </Text>
            <Image
              source={rightIcon}
              style={[generalStyles.smallIcon, generalStyles.triggerArrowStyle]}
            />
          </View>
        }
      />
    ))}
  </View>
));

const DividingLine = memo(() => <View style={styles.dividingLine} />);
