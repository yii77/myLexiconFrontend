import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import { usePracticeAdvanceSetting } from '../../../logic/hooks/practice/usePracticeAdvanceSetting';

import { useCustomAlert } from '../../../presentation/components/system/Alert/useCustomAlert';

import { Page } from '../../components/ui/Page';
import { CommonHeader } from '../../components/ui/Header';
import { ImageButton } from '../../components/ui/Button';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import backIcon from '../../../../assets/icon/back.png';
import addIcon from '../../../../assets/icon/add.png';
import removeIcon from '../../../../assets/icon/remove.png';

export default function AdvancedSettingScreen({ navigation }) {
  const { showAlert, hideAlert } = useCustomAlert();
  const { settings, onAddPlan, onRemovePlan, onEditValue } =
    usePracticeAdvanceSetting();

  const openInputAlert = useCallback(
    (key, index, initialValue) => {
      let inputValue = String(initialValue);

      showAlert({
        title: '修改数值',
        content: (
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            autoFocus
            defaultValue={inputValue}
            onChangeText={text => {
              inputValue = text;
            }}
          />
        ),
        buttons: [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => {
              const result = onEditValue(key, index, inputValue);
              if (!result.success) {
                setTimeout(() => {
                  showAlert({
                    title: '提示',
                    content: result.msg,
                    buttons: [{ text: '好的' }],
                  });
                }, 500);
              }
            },
          },
        ],
      });
    },
    [showAlert, hideAlert, onEditValue],
  );

  return (
    <Page pageStyle={[atomStyles.gap16, atomStyles.paddingHorizontal16]}>
      <CommonHeader
        title="高级设置"
        leftImageSource={backIcon}
        leftImageStyle={[generalStyles.mediumIcon, atomStyles.top1]}
        onLeftPress={() => navigation.goBack()}
      />

      <SectionHeader title="复习计划间隔" onAdd={onAddPlan} />
      <View
        style={[generalStyles.rowContainer, atomStyles.wrap, atomStyles.gap10]}
      >
        {settings.review_plan.map((val, idx) => (
          <NumberBox
            key={`p-${idx}`}
            value={val}
            onPress={() => openInputAlert('review_plan', idx, val)}
            onDelete={
              settings.review_plan.length > 4 ? () => onRemovePlan(idx) : null
            }
          />
        ))}
      </View>

      <SectionHeader title="不同星级的复习倍率" />
      <View style={[generalStyles.rowBetweenContainer, atomStyles.gap10]}>
        {settings.review_multiplier.map((val, idx) => (
          <NumberBox
            key={`m-${idx}`}
            value={val}
            onPress={() => openInputAlert('review_multiplier', idx, val)}
          />
        ))}
      </View>

      <Text style={[generalStyles.textPrompt]}>
        提示：复习计划定义了新词进入复习后的基础间隔， 该星级的真正复习间隔 =
        复习倍率 * 复习间隔。
      </Text>
    </Page>
  );
}

const SectionHeader = memo(({ title, onAdd }) => (
  <View style={[generalStyles.rowBetweenContainer]}>
    <Text style={[generalStyles.textTitleBlack, atomStyles.fw600]}>
      {title}
    </Text>
    {onAdd && (
      <ImageButton
        imageSource={addIcon}
        onPress={onAdd}
        imageStyle={generalStyles.mediumIcon}
      />
    )}
  </View>
));

const NumberBox = memo(({ value, onPress, onDelete }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[
      generalStyles.rowCenterContainer,
      atomStyles.paddingVertical10,
      styles.numBox,
    ]}
  >
    <Text style={[generalStyles.textOptionsBlack]}>{value}</Text>

    {onDelete && (
      <ImageButton
        imageSource={removeIcon}
        onPress={onDelete}
        buttonStyle={styles.deleteButton}
        imageStyle={styles.deleteButtonIcon}
      />
    )}
  </TouchableOpacity>
));
