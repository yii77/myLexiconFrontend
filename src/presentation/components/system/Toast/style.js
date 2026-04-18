import { StyleSheet } from 'react-native';

import Theme from '../../../../config/theme/index';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 76,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#333',
    zIndex: 9999,
    maxWidth: '80%',
  },

  text: {
    color: '#fff',
    fontSize: 14,
  },

  success: {
    backgroundColor: Theme.colors.success,
  },

  error: {
    backgroundColor: Theme.colors.error,
  },

  info: {
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
  },
});
