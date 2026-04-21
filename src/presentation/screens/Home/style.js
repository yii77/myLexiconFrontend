import { StyleSheet } from 'react-native';

import Theme from '../../../config/theme/index';

export default StyleSheet.create({
  dailyQuate: {
    marginLeft: 8,
    letterSpacing: 0.5,
    fontSize: 16,
  },
  wordbookContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 112,
    backgroundColor: Theme.colors.bgWhite,
    padding: 16,
    borderRadius: 20,
  },

  chooseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
    borderRadius: 20,
    padding: 10,
  },
  chooseButtonText: {
    fontSize: 16,
    fontWeight: 500,
    color: Theme.colors.primaryDarkBlue,
  },

  wordbookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  changeButton: {
    justifyContent: 'center',
    borderWidth: 0.8,
    borderRadius: 8,
    borderColor: Theme.colors.textGrayLevel2,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  changeButtonText: {
    color: Theme.colors.textGrayLevel2,
    fontSize: 12,
    lineHeight: 12,
  },
  progressBar: {
    marginTop: 16,
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
    width: '100%',
    height: 4,
    borderRadius: 999,
  },
  progressFinish: {
    backgroundColor: Theme.colors.primaryDarkBlue,
    height: 4,
    borderRadius: 999,
  },

  dailyTaskCard: {
    backgroundColor: Theme.colors.bgWhite,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textBlack,
  },

  menuStyle: {
    top: 0,
    right: -20,
    minWidth: 150,
  },

  dailyTaskCardRow2: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
    marginBottom: 4,
  },

  countNumber: {
    fontSize: 28,
    fontWeight: '600',
    color: Theme.colors.textBlack,
  },

  startButton: {
    marginTop: 20,
    height: 44,
    borderRadius: 999,
    backgroundColor: Theme.colors.blockLightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  startText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
