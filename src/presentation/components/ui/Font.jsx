import { Text } from 'react-native';
import { useContext } from 'react';
import { FontContext } from '../../../logic/contexts/FontContext';

export function CustomText({ children, type = 'english', style, ...props }) {
  const { fonts } = useContext(FontContext);

  if (!fonts) return null;

  const fontStyle = type === 'chinese' ? fonts.chinese : fonts.english;

  return (
    <Text style={[fontStyle, style]} {...props}>
      {children}
    </Text>
  );
}
