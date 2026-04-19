import { useContext, useCallback, useMemo } from 'react';
import { TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { LIST_DISPLAY_ORDERS } from '../../../data/constants/listDisplayOrder';

import { UserBookContext } from '../../../logic/contexts/UserBookContext';

import { useDisplayBook } from '../../../logic/hooks/book/useDisplayBook';
import { useDisplayOrder } from '../../../logic/hooks/book/useDisplayOrder';
import { useWordSections } from '../../../logic/hooks/book/useWordSections';
import { useWordActions } from '../../../logic/hooks/book/useWordActions';
import { useWordSelectMode } from '../../../logic/hooks/book/useWordSelectMode';
import { useUnits } from '../../../logic/hooks/book/useUnits';
import { useSectionExpand } from '../../../logic/hooks/ui/useSectionExpand';
import { useBottomTab } from '../../../logic/hooks/ui/useBottomTab';

import { generateObjectId } from '../../../logic/utils/generateObjectId';

import { useCustomAlert } from '../../components/system/Alert/useCustomAlert';
import { useToast } from '../../components/system/Toast/useToast';

import {
  AlertHeaderLine,
  UserBookModalContent,
  WordsActionModalContent,
  UnitMoveModalContent,
  AddAndMoveToUnitModalContent,
  BookMoveOrCopyModalContent,
  SettingsModalContent,
} from './ModalContent';

import styles from './style';
import generalStyles from '../../styles/general.style';

export function useBookManagerController() {
  const { displayBook, updateDisplayBook } = useDisplayBook();

  const { displayOrder, displayOrderOptions, updateDisplayOrder } =
    useDisplayOrder();

  const bookId = displayBook?._id ?? null;
  const currentDisplayOrder =
    LIST_DISPLAY_ORDERS.find(item => item.label === displayOrder) ?? {};
  const displayOrderValue = currentDisplayOrder.value ?? 'unit';

  const {
    sections,
    wordArray,
    updateSectionsByDelete,
    updateSectionsByMoveToUnit,
    updateSectionTitle,
  } = useWordSections(bookId, displayOrderValue);

  const {
    displaySections,
    expandedKeys,
    toggleSection,
    expandAllSections,
    collapseAllSections,
  } = useSectionExpand(sections);

  const { userBooks } = useContext(UserBookContext);

  const {
    selectMode,
    selectedWords,
    setSelectedWords,
    enterSelectMode,
    exitSelectMode,
    toggleWord,
    isSelected,
    selectAllFromSections,
    toggleSectionWords,
    isSectionSelected,
    setSelectMode,
  } = useWordSelectMode();

  const selectedWordIds = useMemo(
    () => Object.keys(selectedWords),
    [selectedWords],
  );

  const { deleteWords, copyWordsToBook, moveWordsToUnit } = useWordActions();

  const { units, renameUnit, checkTitleExists } = useUnits(bookId);

  const { handleTabPress } = useBottomTab();

  const { showAlert, hideAlert } = useCustomAlert();
  const { showToast } = useToast();

  const navigation = useNavigation();

  const navigateToWordDetail = useCallback(
    word => {
      hideAlert();
      navigation.navigate('WordDetailScreen', { word, wordArray });
    },
    [wordArray],
  );

  const openRenameUnitModal = useCallback(
    (sectionKey, previousTitle) => {
      let newTitle = '';
      showAlert({
        title: '重命名',
        content: (
          <TextInput
            defaultValue={newTitle}
            onChangeText={text => {
              newTitle = text;
            }}
            style={generalStyles.modalInput}
          />
        ),
        buttons: [
          {
            text: '取消',
            onPress: hideAlert,
          },
          {
            text: '确定',
            onPress: () =>
              handleRenameUnit(sectionKey, previousTitle, newTitle),
          },
        ],
        type: 'center',
      });
    },
    [handleRenameUnit],
  );

  const handleRenameUnit = useCallback(
    (sectionKey, previousTitle, newTitle) => {
      const success = renameUnit(displayBook?._id, previousTitle, newTitle);
      if (success) {
        updateSectionTitle(sectionKey, newTitle);
        hideAlert();
      }
    },
    [displayBook],
  );

  // 选择模式
  const isAllSelected = useMemo(() => {
    const totalCount =
      sections?.reduce((acc, s) => acc + (s.data?.length || 0), 0) || 0;

    const selectedCount = Object.keys(selectedWords).length;

    return totalCount > 0 && selectedCount === totalCount;
  }, [sections, selectedWords]);

  // 用户弹窗
  const openUserBookModal = useCallback(() => {
    showAlert({
      title: <AlertHeaderLine />,
      content: (
        <UserBookModalContent
          userBooks={userBooks}
          onSelectBook={handleSelectBook}
          navigateToAddBook={navigateToAddBook}
          navigateToEditBook={navigateToEditBook}
        />
      ),
      buttons: [],
      type: 'bottom',
      style: styles.userWordbookModal,
    });
  }, [userBooks]);

  const handleSelectBook = useCallback(book => {
    const success = updateDisplayBook(book);
    if (success) {
      hideAlert();
    }
  }, []);

  const navigateToAddBook = useCallback(category => {
    hideAlert();
    navigation.navigate('BookFormScreen', { category });
  }, []);

  const navigateToEditBook = useCallback(editingBook => {
    hideAlert();
    navigation.navigate('BookFormScreen', { editingBook });
  }, []);

  // 操作弹窗
  const openActionModal = useCallback(() => {
    showAlert({
      title: '',
      content: (
        <WordsActionModalContent
          isNoteBook={displayBook.category === '笔记本'}
          onDelete={() => {
            handleDelete(selectedWordIds, displayBook);
          }}
          onMoveToUnit={openUnitMoveModal}
          onCopyToBook={() => {
            openBookMoveOrCopyModal('copy');
          }}
          onMoveToBook={() => {
            openBookMoveOrCopyModal('move');
          }}
          onCancel={hideAlert}
        />
      ),
      buttons: [],
      type: 'bottom',
    });
  }, [selectedWords, displayBook]);

  const handleDelete = useCallback(
    (wordIds, displayBook) => {
      const prompt =
        displayBook.category === '单词本'
          ? '确认删除吗'
          : '确认删除吗，确认后所选单词的笔记将被清空';
      showAlert({
        title: '删除单词',
        content: prompt,
        buttons: [
          { text: '取消', onPress: hideAlert },
          {
            text: '确定',
            onPress: () => {
              deleteWords(wordIds, displayBook);
              updateSectionsByDelete(wordIds);
              hideAlert();
            },
          },
        ],
        type: 'center',
      });
    },
    [deleteWords, updateSectionsByDelete],
  );

  // 移动至单元弹窗
  const openUnitMoveModal = useCallback(() => {
    showAlert({
      title: <AlertHeaderLine />,
      content: (
        <UnitMoveModalContent
          wordIds={selectedWordIds}
          units={units}
          onSelectUnit={handleMoveToUnit}
        />
      ),
      buttons: [
        {
          text: '新增单元并移动',
          onPress: () => {
            openAddAndMoveToUnitModal(selectedWordIds);
          },
          alertButtonStyle: styles.addUnitButton,
          alertButtonTextStyle: styles.addUnitButtonText,
        },
      ],
      type: 'bottom',
      style: styles.bottomModal,
    });
  }, [units, selectedWords, handleMoveToUnit]);

  const handleMoveToUnit = useCallback(
    (wordIds, unitId, unitTitle) => {
      const result = moveWordsToUnit(wordIds, unitId, unitTitle);
      if (result) {
        updateSectionsByMoveToUnit(wordIds, unitId, unitTitle);
        showToast({
          message: '移动单元成功',
          type: 'success',
        });
        hideAlert();
      } else {
        showToast({
          message: '移动单元失败',
          type: 'error',
        });
      }
    },
    [moveWordsToUnit, updateSectionsByMoveToUnit],
  );

  // 新增单元并移动弹窗
  const openAddAndMoveToUnitModal = useCallback(
    wordIds => {
      const unitTitleRef = { current: '' };

      showAlert({
        title: '移动至新增单元',
        content: (
          <AddAndMoveToUnitModalContent
            defaultValue=""
            onChangeText={text => {
              unitTitleRef.current = text;
            }}
          />
        ),
        buttons: [
          {
            text: '取消',
            onPress: hideAlert,
          },
          {
            text: '确定',
            onPress: () =>
              handleAddAndMoveConfirm(wordIds, unitTitleRef.current, hideAlert),
          },
        ],
        type: 'center',
      });
    },
    [handleAddAndMoveConfirm],
  );

  const handleAddAndMoveConfirm = useCallback(
    (wordIds, unitTitle, close) => {
      if (!unitTitle || unitTitle.trim() === '') {
        showToast({
          message: '请输入单元名称',
          type: 'error',
        });
        return;
      }

      if (checkTitleExists(unitTitle)) {
        showToast({
          message: '已有该单元，请重新输入',
          type: 'error',
        });
        return;
      }

      const unitId = generateObjectId();

      moveWordsToUnit(wordIds, unitId, unitTitle);
      updateSectionsByMoveToUnit(wordIds, unitId, unitTitle);

      close?.();
    },
    [checkTitleExists, moveWordsToUnit, updateSectionsByMoveToUnit],
  );

  // 拷贝/移动至书本弹窗
  const openBookMoveOrCopyModal = useCallback(
    mode => {
      showAlert({
        title: <AlertHeaderLine />,
        content: (
          <BookMoveOrCopyModalContent
            wordIds={selectedWordIds}
            mode={mode}
            userBooks={userBooks}
            onSelectBook={handleBookMoveOrCopy}
            currentBook={displayBook}
          />
        ),
        buttons: [
          {
            text: '新增单词本',
            onPress: () => {
              setSelectMode(false);
              navigateToAddBook('单词本');
            },
            alertButtonStyle: styles.addUnitButton,
            alertButtonTextStyle: styles.addUnitButtonText,
          },
        ],
        type: 'bottom',
        style: styles.bottomModal,
      });
    },
    [userBooks, selectedWords, displayBook],
  );

  const handleBookMoveOrCopy = useCallback(
    (wordIds, targetBook, mode) => {
      copyWordsToBook(wordIds, targetBook);
      if (mode === 'move') {
        deleteWords(wordIds, displayBook);
        updateSectionsByDelete(wordIds);
      }
      setSelectedWords({});
      hideAlert();
    },
    [userBooks, selectedWords, displayBook],
  );

  // 设置弹窗
  const openSettingsModal = useCallback(() => {
    showAlert({
      title: '',
      content: (
        <SettingsModalContent
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          onEnterAction={handleEnterAction}
        />
      ),
      buttons: [],
      type: 'top',
      style: styles.settingsModal,
    });
  }, [expandAllSections, handleCollapseAll, handleEnterAction]);

  const handleExpandAll = () => {
    expandAllSections();
    hideAlert();
  };

  const handleCollapseAll = () => {
    collapseAllSections();
    hideAlert();
  };

  const handleEnterAction = () => {
    setSelectMode(true);
    hideAlert();
  };

  return {
    displayBook,
    displayOrder,
    displayOrderValue,
    displayOrderOptions,
    realSections: sections,
    wordArray,
    displaySections,
    expandedKeys,
    selectMode,
    selectedWords,
    isAllSelected,
    navigateToWordDetail,
    openRenameUnitModal,
    updateDisplayOrder,
    toggleSection,
    isSectionSelected,
    setSelectedWords,
    enterSelectMode,
    exitSelectMode,
    toggleWord,
    isSelected,
    selectAllFromSections,
    toggleSectionWords,
    openUserBookModal,
    openActionModal,
    openSettingsModal,
    handleTabPress,
  };
}
