import { useState } from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';

import generalStyles from '../../styles/general.style';

/**
 * 文字按钮组件
 * @param {string} title - 按钮显示的文字内容
 * @param {function} onPress - 点击按钮触发的回调函数
 * @param {object} buttonStyle - 按钮容器默认样式（TouchableOpacity 样式）
 * @param {object} textStyle - 按钮文字默认样式（Text 样式）
 * @param {object} activeButtonStyle - 按钮按下时的容器样式
 * @param {object} activeTextStyle - 按钮按下时的文字样式
 * @param {boolean} disabled - 是否禁用按钮，默认 false
 * @param {object} disabledButtonStyle - 按钮禁用时的容器样式
 * @param {object} disabledTextStyle - 按钮禁用时的文字样式
 * @param {object} hitSlop - 按钮点击热区扩展范围，优化点击体验
 */
export function TextButton({
  title,
  onPress,
  buttonStyle,
  textStyle,
  activeButtonStyle,
  activeTextStyle,
  disabled = false,
  disabledButtonStyle,
  disabledTextStyle,
  hitSlop,
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)} // 按下开始
      onPressOut={() => setPressed(false)} // 按下结束
      style={[
        buttonStyle,
        disabled && disabledButtonStyle,
        pressed && !disabled && activeButtonStyle,
      ]}
      activeOpacity={1}
      hitSlop={hitSlop}
    >
      <Text
        style={[
          generalStyles.textBody,
          textStyle,
          disabled && disabledTextStyle,
          pressed && !disabled && activeTextStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * 图片按钮组件
 * @param {any} imageSource - 按钮显示的图片资源
 * @param {function} onPress - 点击按钮触发的回调函数
 * @param {object} buttonStyle - 按钮容器默认样式（TouchableOpacity 样式）
 * @param {object} imageStyle - 按钮图片默认样式（Image 样式）
 * @param {object} activeButtonStyle - 按钮按下时的容器样式
 * @param {object} activeImageStyle - 按钮按下时的图片样式
 * @param {boolean} disabled - 是否禁用按钮，默认 false
 * @param {object} disabledButtonStyle - 按钮禁用时的容器样式
 * @param {object} disabledImageStyle - 按钮禁用时的图片样式
 * @param {object} hitSlop - 按钮点击热区扩展范围，优化点击体验
 */
export function ImageButton({
  imageSource,
  onPress,
  buttonStyle,
  imageStyle,
  activeButtonStyle,
  activeImageStyle,
  disabled = false,
  disabledButtonStyle,
  disabledImageStyle,
  hitSlop,
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)} // 按下开始
      onPressOut={() => setPressed(false)} // 按下结束
      style={[
        buttonStyle,
        disabled && disabledButtonStyle,
        pressed && !disabled && activeButtonStyle,
      ]}
      hitSlop={hitSlop}
    >
      <Image
        source={imageSource}
        style={[
          imageStyle,
          disabled && disabledImageStyle,
          pressed && !disabled && activeImageStyle,
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
