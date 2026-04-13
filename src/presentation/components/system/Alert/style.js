import { StyleSheet, Dimensions } from 'react-native';

import Theme from '../../../../config/theme/index';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  topModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  bottomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  topAlertBox: {
    backgroundColor: Theme.colors.bgGrayLevel2,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    width: '100%',
    maxHeight: '80%',
    padding: 16,
    gap: 16,
    zIndex: 2,
  },

  centerAlertBox: {
    width: width * 0.8,
    backgroundColor: Theme.colors.bgGrayLevel2,
    borderRadius: 14,
    padding: 16,
    gap: 16,
    zIndex: 2,
  },

  bottomAlertBox: {
    backgroundColor: Theme.colors.bgGrayLevel2,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: '100%',
    maxHeight: '80%',
    padding: 16,
    gap: 16,
    zIndex: 2,
  },

  alertTitle: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'left',
  },

  alertMessage: {
    fontSize: 15,
    textAlign: 'left',
    lineHeight: 24,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: '10%',
  },

  alertButton: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    width: '45%',
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },

  alertButtonText: {
    color: '#050000ff',
    fontSize: 16,
  },
});
