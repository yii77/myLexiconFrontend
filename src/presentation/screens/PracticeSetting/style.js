import { StyleSheet } from 'react-native';

import Theme from '../../../config/theme/index';

export default StyleSheet.create({
  optionAlert: {
    maxHeight: 400,
  },

  dividingLine: {
    backgroundColor: '#f1f1f1',
    width: '100%',
    height: 8,
  },

  brushModeOption: {
    width: '47%',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: Theme.colors.bgWhite,
  },

  brushModeOptionSelected: {
    backgroundColor: Theme.colors.primaryLightBlue,
  },

  selectIcon: {
    position: 'absolute',
    left: 18,
  },
});
