import { useCallback, useState, useEffect } from 'react';

import { useRoute, useNavigation } from '@react-navigation/native';

import { useNoteActions } from '../../../logic/hooks/word/useNoteActions';
import { useNoteBooks } from '../../../logic/hooks/word/useNoteBooks';
import { useNoteTable } from '../../../logic/hooks/word/useNoteTable';
import { useNoteStyle } from '../../../logic/hooks/word/useNoteStyle';

import { getFontOptions } from '../../../logic/services/FontService';

import { cleanEmptyRowsAndColumns } from '../../../logic/utils/cleanEmptyRowsAndColumns';

import { NoteCard } from '../../widgets/NoteCard';

import { useCustomAlert } from '../../components/system/Alert/useCustomAlert';
import { useToast } from '../../components/system/Toast/useToast';

export function useNoteFormController() {
  const route = useRoute();
  const word = route.params.word;
  const editingNote = route.params.editingNote ?? null;

  const {
    selectedBook,
    selectorOpen,
    subcategoryOption,
    groupedBooks,
    wordExistingBookIds,
    setSelectorOpen,
    selectBook,
    setRefreshKey,
  } = useNoteBooks({ initialBook: editingNote?.notebook, word });

  const {
    rows,
    cols,
    cellTexts,
    colWidths,
    rowHeights,
    colDragging,
    firstRowDefaults,
    createColPanResponder,
    addColumn,
    addRow,
    changeText,
    changeColWidthByInput,
    changeRowHeight,
  } = useNoteTable(editingNote?.cellTexts ?? null);

  const {
    note_display_type,
    firstRowOptions,
    noteStyles,
    activeStyleCardIndex,
    setNoteDisplayType,
    setActiveStyleCardIndex,
    updateCardData,
  } = useNoteStyle({ editingNote, cellTexts, cols });

  const { addNote, updateNote } = useNoteActions();

  const [fontOptions, setFontOptions] = useState([]);
  useEffect(() => {
    const init = async () => {
      const options = await getFontOptions();
      setFontOptions(options);
    };
    init();
  }, []);

  const { showAlert, hideAlert } = useCustomAlert();
  const { showToast } = useToast();

  const navigation = useNavigation();

  const navigateToEditBook = useCallback(editingBook => {
    hideAlert();
    navigation.navigate('BookFormScreen', { editingBook });
  }, []);

  const navigateToAddBook = useCallback(() => {
    hideAlert();
    navigation.navigate('BookFormScreen', { category: '笔记本' });
  }, []);

  const handleSelectBook = useCallback(
    (book, disabled) => {
      if (disabled) {
        showToast({
          message: `该笔记本中已有 ${word} 的笔记`,
          type: 'info',
        });
      } else {
        selectBook(book);
      }
    },
    [selectBook, word],
  );

  const refreshNote = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFinish = useCallback(
    (selectedBook, cellTexts, note_display_type, noteStyles, editingNote) => {
      console.log(cellTexts);
      if (!selectedBook) {
        showAlert({
          title: '提示',
          content: '请先选择笔记本',
          buttons: [{ text: '确定', onPress: hideAlert }],
          type: 'center',
        });
        return;
      }

      const nonHeaderRows = cellTexts.slice(1);
      const allRowsEmpty = nonHeaderRows.every(row =>
        row.every(text => !text || text.trim() === ''),
      );
      if (allRowsEmpty) {
        showAlert({
          title: '提示',
          content: '内容不能为空',
          buttons: [{ text: '确定', onPress: hideAlert }],
          type: 'center',
        });

        return;
      }

      const firstRow = cellTexts[0];
      const colIssue = firstRow.findIndex((label, colIndex) => {
        const hasContent = nonHeaderRows.some(
          row => row[colIndex] && row[colIndex].trim() !== '',
        );
        return (!label || label.trim() === '') && hasContent;
      });
      if (colIssue !== -1) {
        showAlert({
          title: '提示',
          content: `第 ${colIssue + 1} 列缺少列标签，请输入！`,
          buttons: [{ text: '确定', onPress: hideAlert }],
          type: 'center',
        });
        return;
      }

      const content = JSON.stringify(
        cleanEmptyRowsAndColumns({
          note_display_type,
          cellTexts,
          noteStyles,
        }),
      );

      if (editingNote) {
        updateNote({
          selectedBook,
          noteId: editingNote._id,
          content,
          previousBook: editingNote.notebook,
        });
        navigation.goBack();
      } else {
        addNote({
          word,
          selectedBook,
          content,
        });
        navigation.goBack();
      }
    },
    [],
  );

  const handlePreview = useCallback(
    (note_display_type, cellTexts, noteStyles) => {
      showAlert({
        title: '',
        content: (
          <NoteCard
            note_display_type={note_display_type}
            cellTexts={cellTexts}
            noteStyles={noteStyles}
          />
        ),
        buttons: [],
        type: 'center',
      });
    },
    [],
  );

  return {
    selectedBook,
    selectorOpen,
    subcategoryOption,
    groupedBooks,
    wordExistingBookIds,
    rows,
    cols,
    cellTexts,
    colWidths,
    rowHeights,
    colDragging,
    firstRowDefaults,
    fontOptions,
    note_display_type,
    firstRowOptions,
    noteStyles,
    activeStyleCardIndex,
    setSelectorOpen,
    navigateToEditBook,
    navigateToAddBook,
    handleSelectBook,
    refreshNote,
    createColPanResponder,
    addColumn,
    addRow,
    changeText,
    changeColWidthByInput,
    changeRowHeight,
    setNoteDisplayType,
    setActiveStyleCardIndex,
    updateCardData,
    handleFinish,
    handlePreview,
  };
}
