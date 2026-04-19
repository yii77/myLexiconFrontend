import { StyleSheet } from 'react-native';

import Theme from '../../../config/theme/index';

export default StyleSheet.create({
  textInput: {
    borderRadius: 20,
    backgroundColor: '#eaeaea65',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  forgetPasswordText: {
    color: '#737171ff',
    fontSize: 14,
    textAlign: 'right',
    right: 4,
  },

  loginButton: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Theme.colors.blockLightBlue,
  },

  loginText: {
    color: Theme.colors.textInverse,
    fontSize: 16,
  },
});
