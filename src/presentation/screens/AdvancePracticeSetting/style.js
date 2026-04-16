import { StyleSheet, Dimensions } from 'react-native';

import Theme from '../../../config/theme/index';

const { width } = Dimensions.get('window');

const BOX_WIDTH = (width - 72) / 5;

export default StyleSheet.create({
  numBox: {
    borderWidth: 1,
    borderColor: '#E4E7ED',
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    width: BOX_WIDTH,
  },
  deleteButtonIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
    backgroundColor: '#cc6f70',
    borderRadius: 10,
  },
  deleteButton: { position: 'absolute', top: -8, right: -8, padding: 4 },
  numInput: {
    borderBottomWidth: 1,
    borderColor: Theme.colors.lineLightBlue,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 8,
    color: Theme.colors.textLightBlack,
    marginBottom: 12,
  },
});
