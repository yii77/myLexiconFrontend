import { StyleSheet } from 'react-native';

import Theme from '../../../config/theme/index';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
  },
  backIcon: {
    height: 24,
    width: 24,
    bottom: 2,
  },
  wordTitle: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  addNoteButton: {
    position: 'absolute',
    bottom: 130,
    right: 30,
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  addNoteImage: {
    height: 30,
    width: 30,
    tintColor: Theme.colors.primaryDarkBlue,
  },
  bottomRow: {
    position: 'absolute',
    bottom: 20,
    width: '98%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.blockLightBlueAlpha43,
    shadowColor: Theme.colors.primaryDarkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
