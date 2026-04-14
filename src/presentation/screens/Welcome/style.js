import { StyleSheet, Dimensions } from 'react-native';

import Theme from '../../../config/theme/index';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  appBrandHeaderContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 150,
    gap: 16,
    width: '100%',
  },
  buttonRowsContainer: {
    position: 'absolute',
    bottom: 180,
    width: '100%',
    paddingHorizontal: 32,
    gap: 16,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    paddingHorizontal: 16,
  },
  appLogo: {
    width: width * 0.33,
    height: width * 0.33,
    borderRadius: 17,
  },
  appNameText: {
    fontSize: 28,
    fontWeight: 500,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 400,
    color: Theme.colors.textGrayLevel3,
  },
  baseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
  },
  loginButton: {
    backgroundColor: Theme.colors.primary,
  },
  registerButton: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  baseButtonText: {
    fontSize: 16,
    fontWeight: 500,
  },
  loginButtonText: {
    color: Theme.colors.background,
  },
  registerButtonText: {
    color: Theme.colors.primary,
  },
  checkBox: {
    transform: [{ scale: 0.8 }],
  },
  checkBoxTintColors: {
    true: Theme.colors.primary,
    false: Theme.colors.primary,
  },
});
