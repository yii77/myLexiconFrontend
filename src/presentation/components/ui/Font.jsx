import { Text } from 'react-native';
import { useContext } from 'react';
import { FontContext } from '../../../logic/contexts/FontContext';

export function CustomText({
  children,
  type = 'english',
  fontWeight,
  style,
  ...props
}) {
  const { fonts } = useContext(FontContext);

  if (!fonts) return null;

  const baseFontFamily = type === 'chinese' ? fonts.chinese : fonts.english;

  const fontFamily = fontWeight
    ? `${baseFontFamily}-${fontWeight}`
    : baseFontFamily;

  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
}
