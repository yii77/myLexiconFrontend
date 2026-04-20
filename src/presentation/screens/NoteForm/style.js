import { StyleSheet } from 'react-native';
import Theme from '../../../config/theme/index';

export default StyleSheet.create({
  contentContainer: { paddingHorizontal: 16, gap: 24, paddingBottom: 40 },

  cardTitleRow: {
    paddingHorizontal: 4,
  },

  cardTitleGrayText: {
    fontSize: 16,
    color: Theme.colors.cardTitleTextGray,
    fontWeight: '500',
  },
  // ------------------------------- 笔记本选择器 ------------------------------

  oneLineOption: {
    padding: 16,
    backgroundColor: Theme.colors.bgWhite,
    borderRadius: 20,
  },
  optionSelectedText: {
    fontSize: 16,
    color: Theme.colors.textGrayLevel2,
  },

  dropdownContainer: {
    position: 'absolute',
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 3,
    top: 60,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#877c7c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 7,
  },

  subcategoryTabsContainer: {
    minHeight: 32,
  },
  subcategoryTabBase: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  subcategoryTabActive: {
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
  },
  subcategoryTabInactive: {
    backgroundColor: '#edf1f5',
  },
  subcategoryTabTextActive: {
    color: Theme.colors.primaryDarkBlue,
    fontWeight: '600',
  },
  subcategoryTabTextInactive: {
    color: '#333',
  },
  bookItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  disabledText: {
    color: Theme.colors.textGrayLevel2,
  },

  // ------------------------------- 笔记输入卡片 ------------------------------

  addColumnBtnText: {
    fontSize: 13,
    color: Theme.colors.importantBlue,
    fontWeight: '500',
  },
  noteContainer: {
    paddingBottom: 40,
  },
  headerCell: {
    backgroundColor: '#b8dcec52',
  },
  contentCell: {
    backgroundColor: Theme.colors.bgWhite,
  },
  headerTopLeftCell: { borderTopLeftRadius: 20 },
  headerTopRightCell: { borderTopRightRadius: 20 },
  cellBase: {
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  HeaderCellText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    color: Theme.colors.primaryDarkBlue,
  },
  contentCellText: {
    textAlign: 'left',
    textAlignVertical: 'top',
    color: Theme.colors.textLightBlack,
  },
  verticalDivider: {
    width: 1,
    height: '40%',
    backgroundColor: Theme.colors.divider1,
    alignSelf: 'center',
    position: 'absolute',
    right: 0,
  },
  visibleText: {
    position: 'absolute',
    opacity: 0,
    fontSize: 14,
  },
  moveContainer: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: '100%',
    zIndex: 10,
  },
  moveImage: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: -4,
    left: -36,
  },
  moveLine: {
    position: 'absolute',
    left: 4,
    top: 0,
    width: 1,
    height: '100%',
  },
  addRowTouch: {
    width: '100%',
    height: 40,
    backgroundColor: Theme.colors.bgWhite,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    position: 'absolute',
    bottom: -40,
    zIndex: 2,
  },
  addRowBtnRow: {
    bottom: 11,
    gap: 10,
    position: 'absolute',
    width: '100%',
  },
  addRowBtn: {
    borderRadius: 999,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#96969a',
  },

  // ------------------------------- 样式设置 ------------------------------

  noteDisplayTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#eff1f4',
    borderRadius: 999,
    left: 1,
  },

  height12: {
    height: 12,
  },
  height10: {
    height: 10,
  },
  colLableContainer: {
    backgroundColor: '#eff1f4',
    paddingHorizontal: 0,
    flexDirection: 'row',
    paddingVertical: 0,
    gap: 2,
    borderRadius: 999,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  tabItemActive: {
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
  },
  tabTextActive: {
    color: Theme.colors.primaryDarkBlue,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Theme.colors.bgWhite,
    gap: 8,
    padding: 16,
    borderRadius: 20,
    paddingBottom: 30,
  },
  colSelectorContainer: {
    alignItems: 'flex-start',
    paddingLeft: 6,
  },
  colSelectorText: {
    fontSize: 15,
    color: '#5d7f9a',
    fontWeight: '500',
    letterSpacing: 1,
  },
  groupContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 4,
  },
  leftLineContainer: {
    width: 4,
    height: '100%',
    alignSelf: 'center',
  },
  leftLine: {
    flex: 1,
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
    borderRadius: 2,
  },
  styleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  switch: {
    false: '#e0e0e0',
    true: Theme.colors.blockLightBlueAlpha,
  },
  fontDropdownMenu: {
    bottom: -52,
    right: 0,
    minWidth: 200,
  },
  fontSizeDropdownMenu: {
    bottom: -93.5,
    right: 0,
    minWidth: 200,
  },
  fontWeightDropdownMenu: {
    bottom: -93,
    right: 0,
    minWidth: 200,
  },
  nextConnectorDropdownMenu: {
    bottom: -11,
    right: 0,
    minWidth: 200,
  },
});
