import { StyleSheet } from 'react-native';

import Theme from '../../../config/theme/index';

export default StyleSheet.create({
  menu: { right: 2, top: 0 },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
    zIndex: 5,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#615d5d',
    width: 15,
    height: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    width: 15,
    height: 15,
    borderRadius: 5,
    backgroundColor: Theme.colors.blockLightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  wordItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 8,
  },
  ItemSeparator: {
    height: 0.5,
    marginHorizontal: 16,
    backgroundColor: '#e7e7e7',
    zIndex: 2,
  },

  modalDragHandle: {
    height: 3,
    width: '10%',
    backgroundColor: '#bcbcbc',
    borderRadius: 20,
    marginVertical: 5,
  },

  /**
   * 用户词书弹窗
   */
  // 标题栏 CategoryHeader
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  categoryName: {
    fontWeight: '600',
    fontSize: 18,
    color: '#85858b',
  },
  subcategoryDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 3,
    maxHeight: 22,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Theme.colors.blockLightBlueAlpha43,
    backgroundColor: Theme.colors.blockLightBlueAlpha10,
    alignSelf: 'flex-start',
  },
  subcategoryDropdownLabel: {
    fontSize: 13,
    color: Theme.colors.lineLightBlue,
    fontWeight: '500',
  },
  subcategoryDropdownMenu: {
    top: -1,
    left: -1,
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: 150,
  },
  subcategoryDropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    flexShrink: 0,
  },
  subcategoryDropdownItemText: {
    fontSize: 13,
    color: '#555',
    flexShrink: 0,
  },
  addButton: {
    marginRight: 4,
    width: 18,
    height: 18,
    borderRadius: 16,
    backgroundColor: Theme.colors.blockLightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 书籍List BookListWithSubcategory BookListNormal
  emptyContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  emptyPrompt: {
    color: '#999',
    fontSize: 14,
  },
  learningWordbookContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#f2f2f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.17,
    shadowRadius: 32,
    elevation: 6,
  },
  wordbookImage: {
    width: 45,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  // 单词本 BookItem
  bookItem: {
    backgroundColor: Theme.colors.bgWhite,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookInfo: { gap: 4, flex: 1 },
  userWordbookModal: {
    minHeight: '80%',
  },

  /**
   * 单词操作弹窗
   */
  actionItem: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionModaSeparator: {
    height: 8,
    backgroundColor: '#f5f5f5',
    marginVertical: 12,
  },

  /**
   * 单元选择弹窗
   */
  unitItem: {
    backgroundColor: Theme.colors.bgWhite,
    padding: 16,
    borderRadius: 20,
    gap: 4,
  },
  bottomModal: {
    maxHeight: 600,
    minHeight: 300,
  },

  addUnitButton: {
    backgroundColor: '#ffffff00',
    borderColor: '#ffffff00',
    width: '100%',
    paddingTop: 6,
  },
  addUnitButtonText: {
    fontSize: 16,
    color: Theme.colors.lineLightBlue,
  },

  /**
   * 设置弹窗
   */
  settingsModal: {
    alignSelf: 'flex-end',
    width: 150,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderRadius: 10,
    top: 56,
    paddingVertical: 0,
    paddingHorizontal: 0,
    gap: 10,
    borderWidth: 1,
    borderColor: Theme.colors.blockLightBlueAlpha43,
    backgroundColor: Theme.colors.bgWhite,
  },
  settingItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  settingItemSeparator: {
    height: 1,
    backgroundColor: Theme.colors.blockLightBlueAlpha43,
  },
});
