import { StyleSheet } from 'react-native';

import Theme from '../../../config/theme/index';

export default StyleSheet.create({
  defaultCategory: {
    marginBottom: 4,
  },

  categorySelected: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: 10,
    height: 2,
    borderRadius: 2,
    backgroundColor: Theme.colors.blockLightBlue,
  },

  defaultSubcategory: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ececec',
    paddingVertical: 5,
    borderRadius: 16,
  },

  subcategorySelected: { backgroundColor: Theme.colors.blockLightBlue },

  expandButton: {
    width: 'auto',
    paddingHorizontal: 16,
  },

  wordbookImage: {
    width: 60,
    height: 80,
    backgroundColor: '#ced5d5', // 占位颜色
    borderRadius: 8,
    marginRight: 12,
  },

  learningTagText: {
    fontSize: 12,
    color: Theme.colors.lineLightBlue,
  },
});
