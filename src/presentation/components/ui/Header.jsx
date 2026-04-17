import { Text, View, StyleSheet } from 'react-native';

import { ImageButton, TextButton } from './Button';

import generalStyles from '../../styles/general.style';

import Theme from '../../../config/theme/index';

/**
 * 通用标题栏（左右支持文本/图片按钮）
 * @param {string} title - 中间标题
 * @param {object} headerStyle - 标题栏容器样式
 * @param {object} titleStyle - 标题文字样式
 * —————— 左侧按钮 ——————
 * @param {string} leftText - 左侧文本按钮文字
 * @param {function} onLeftPress - 左侧按钮点击
 * @param {object} leftBtnStyle - 左侧按钮样式
 * @param {object} leftTextStyle - 左侧文字样式
 * @param {object} activeLeftBtnStyle - 左侧按下样式
 * @param {object} activeLeftTextStyle - 左侧文字按下样式
 * @param {any} leftImageSource - 左侧图片按钮资源
 * @param {object} leftImageStyle - 左侧图片样式
 * @param {object} activeLeftImageStyle - 左侧图片按下样式
 * —————— 右侧按钮 ——————
 * @param {string} rightText - 右侧文本按钮文字
 * @param {function} onRightPress - 右侧按钮点击
 * @param {object} rightBtnStyle - 右侧按钮样式
 * @param {object} rightTextStyle - 右侧文字样式
 * @param {object} activeRightBtnStyle - 右侧按下样式
 * @param {object} activeRightTextStyle - 右侧文字按下样式
 * @param {any} rightImageSource - 右侧图片按钮资源
 * @param {object} rightImageStyle - 右侧图片样式
 * @param {object} activeRightImageStyle - 右侧图片按下样式
 */
export function CommonHeader({
  title,
  headerStyle,
  titleStyle,

  // 左侧
  leftText,
  onLeftPress,
  leftBtnStyle,
  leftTextStyle,
  activeLeftBtnStyle,
  activeLeftTextStyle,
  leftImageSource,
  leftImageStyle,
  activeLeftImageStyle,

  // 右侧
  rightText,
  onRightPress,
  rightBtnStyle,
  rightTextStyle,
  activeRightBtnStyle,
  activeRightTextStyle,
  rightImageSource,
  rightImageStyle,
  activeRightImageStyle,
}) {
  // 渲染左侧按钮：优先图片，否则文字
  const renderLeft = () => {
    if (leftImageSource) {
      return (
        <ImageButton
          imageSource={leftImageSource}
          onPress={onLeftPress}
          buttonStyle={[styles.commonHeaderLeftBtn, leftBtnStyle]}
          imageStyle={leftImageStyle}
          activeButtonStyle={activeLeftBtnStyle}
          activeImageStyle={activeLeftImageStyle}
        />
      );
    }
    if (leftText) {
      return (
        <TextButton
          title={leftText}
          onPress={onLeftPress}
          buttonStyle={[styles.commonHeaderLeftBtn, leftBtnStyle]}
          textStyle={[styles.commonHeaderBtnText, leftTextStyle]}
          activeButtonStyle={activeLeftBtnStyle}
          activeTextStyle={activeLeftTextStyle}
        />
      );
    }
    return;
  };

  // 渲染右侧按钮：优先图片，否则文字
  const renderRight = () => {
    if (rightImageSource) {
      return (
        <ImageButton
          imageSource={rightImageSource}
          onPress={onRightPress}
          buttonStyle={[styles.commonHeaderRightBtn, rightBtnStyle]}
          imageStyle={[styles.image, rightImageStyle]}
          activeButtonStyle={activeRightBtnStyle}
          activeImageStyle={activeRightImageStyle}
        />
      );
    }
    if (rightText) {
      return (
        <TextButton
          title={rightText}
          onPress={onRightPress}
          buttonStyle={[styles.commonHeaderRightBtn, rightBtnStyle]}
          textStyle={[styles.commonHeaderBtnText, rightTextStyle]}
          activeButtonStyle={activeRightBtnStyle}
          activeTextStyle={activeRightTextStyle}
        />
      );
    }
    return;
  };

  return (
    <View style={[generalStyles.rowCenterContainer, headerStyle]}>
      {renderLeft()}
      <Text style={[styles.commonHeaderTitle, titleStyle]}>{title}</Text>
      {renderRight()}
    </View>
  );
}

const styles = StyleSheet.create({
  commonHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Theme.colors.textBlack,
  },
  commonHeaderLeftBtn: {
    position: 'absolute',
    left: 0,
  },
  commonHeaderRightBtn: {
    position: 'absolute',
    right: 0,
  },
  commonHeaderBtnText: {
    fontSize: 16,
    paddingTop: 2,
  },
  image: {
    height: 20,
    width: 20,
  },
});
