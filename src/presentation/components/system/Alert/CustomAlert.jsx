import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { TextButton } from '../../ui/Button';

import styles from './style';

const overlayStyle = {
  top: styles.topModalOverlay,
  center: styles.centerModalOverlay,
  bottom: styles.bottomModalOverlay,
};

const alertBoxStyle = {
  top: styles.topAlertBox,
  center: styles.centerAlertBox,
  bottom: styles.bottomAlertBox,
};

export default function CustomAlert({
  visible,
  title,
  content,
  buttons,
  type,
  onClose,
  style,
}) {
  return (
    <Modal transparent visible={visible} statusBarTranslucent>
      <TouchableOpacity
        style={overlayStyle[type] ?? styles.centerModalOverlay}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
          style={[alertBoxStyle[type] ?? styles.centerAlertBox, style]}
        >
          {/* 标题 */}
          {title &&
            (typeof title === 'string' ? (
              <Text style={styles.alertTitle}>{title}</Text>
            ) : (
              title
            ))}

          {/* 内容 */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {typeof content === 'string' ? (
              <Text style={styles.alertMessage}>{content}</Text>
            ) : (
              content
            )}
          </ScrollView>

          {/* 按钮 */}
          {buttons?.length > 0 && (
            <View style={styles.buttonRow}>
              {buttons.map((btn, index) => (
                <TextButton
                  key={index}
                  title={btn.text}
                  onPress={btn.onPress}
                  buttonStyle={[styles.alertButton, btn.alertButtonStyle]}
                  textStyle={[styles.alertButtonText, btn.alertButtonTextStyle]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
