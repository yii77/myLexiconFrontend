import { useEffect, useState, useContext, useMemo, useCallback } from 'react';

import { getBookIdsByWord } from '../../../data/dao/wordBookMappingDao';

import { UserBookContext } from '../../contexts/UserBookContext';

import { getSubcategoryOptions } from '../../../logic/services/BookService';

export function useNoteBooks({ initialBook = null, word }) {
  const { userBooks } = useContext(UserBookContext);

  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [wordExistingBookIds, setWordExistingBookIds] = useState([]);

  const [subcategoryOption, setSubcategoryOption] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const loadSubcategoryOptions = useCallback(async () => {
    const subs = await getSubcategoryOptions('笔记本');
    setSubcategoryOption(subs);
  }, [refreshKey]);

  const allNotes = useMemo(() => {
    const noteGroup = userBooks.find(g => g.category === '笔记本');
    return noteGroup ? noteGroup.books : [];
  }, [userBooks, refreshKey]);

  const groupedBooks = useMemo(() => {
    return allNotes.reduce((acc, b) => {
      const sub = b.subcategory || '未分类';
      (acc[sub] ??= []).push(b);
      return acc;
    }, {});
  }, [allNotes]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        word ? getBookIdsByWord(word).then(setWordExistingBookIds) : null,
        loadSubcategoryOptions(),
      ]);
    };
    init();
  }, [word, loadSubcategoryOptions]);

  const selectBook = book => {
    setSelectedBook(book);
    setSelectorOpen(false);
  };

  return {
    selectedBook,
    selectorOpen,
    allNotes,
    groupedBooks,
    subcategoryOption,
    wordExistingBookIds,
    setSelectorOpen,
    selectBook,
    setRefreshKey,
  };
}
