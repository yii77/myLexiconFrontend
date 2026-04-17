import { StyleSheet } from 'react-native';
import Theme from '../../../config/theme';

export default StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 24,
    flex: 1,
  },
  card: {
    gap: 10,
    backgroundColor: Theme.colors.bgWhite,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subcategoryTabsContainer: {
    gap: 10,
  },
  subcategoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  subcategoryTabInactive: {
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderColor: '#ffffff00',
  },
  subcategoryTabActive: {
    borderWidth: 1,
    borderColor: Theme.colors.lineLightBlue,
    backgroundColor: Theme.colors.blockLightBlueAlpha10,
  },
  subcategoryTabTextActive: {
    color: Theme.colors.lineLightBlue,
  },
  textInput: {
    borderBottomColor: '#dedede',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: Theme.colors.blockLightBlue,
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 20,
  },
});
