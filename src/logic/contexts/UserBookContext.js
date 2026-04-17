import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import {
  createBook,
  getSubcategoriesByCategory,
  checkBookExists,
  getBooksByCategory,
  updateBook,
  deleteBookById,
  adjustNotebookOrderAfterDelete,
} from '../../data/dao/bookDao';
import { deleteWordsByBookId } from '../../data/dao/wordBookMappingDao';

import { AuthContext } from './AuthContext';
import { PracticeWordbookContext } from './PracticeWordbookContext';

import { useCustomAlert } from '../../presentation/components/system/Alert/useCustomAlert';

export const UserBookContext = createContext({});

export const UserBookProvider = ({ children }) => {
  const [localBooks, setLocalBooks] = useState({
    wordBooks: [],
    noteBooks: [],
  });
  const [optionalSubcategories, setOptionalSubcategories] = useState([]);
  const { practiceWordbook } = useContext(PracticeWordbookContext);
  const { user } = useContext(AuthContext);
  const { showAlert } = useCustomAlert();

  const updateLocalBookState = useCallback((type, payload) => {
    const { category, book, bookId } = payload;

    const key = category === '单词本' ? 'wordBooks' : 'noteBooks';

    setLocalBooks(prev => {
      const currentList = prev[key] || [];
      let newList = [...currentList];

      if (type === 'ADD') {
        newList = [...newList, book];
      } else if (type === 'UPDATE') {
        newList = newList.map(b =>
          b._id === book._id ? { ...b, ...book } : b,
        );
      } else if (type === 'DELETE') {
        newList = newList.filter(b => b._id !== bookId);
      }

      return {
        ...prev,
        [key]: newList,
      };
    });
  }, []);

  const loadUserBooks = useCallback(async () => {
    try {
      const [wordBooks, noteBooks] = await Promise.all([
        getBooksByCategory('单词本'),
        getBooksByCategory('笔记本'),
      ]);
      setLocalBooks({ wordBooks, noteBooks });
    } catch (err) {
      console.error('获取用户词书失败', err);
    }
  }, []);

  useEffect(() => {
    loadUserBooks();
  }, [loadUserBooks]);

  const displayGroups = useMemo(() => {
    return [
      {
        category: '在学词书',
        books: practiceWordbook ? [practiceWordbook] : [],
      },
      { category: '单词本', books: localBooks.wordBooks },
      { category: '笔记本', books: localBooks.noteBooks },
    ];
  }, [practiceWordbook, localBooks]);

  const loadSubcategories = useCallback(async category => {
    try {
      const subs = await getSubcategoriesByCategory(category);
      setOptionalSubcategories(subs || []);
    } catch (err) {
      setOptionalSubcategories([]);
    }
  }, []);

  const addUserBook = useCallback(
    async ({ name, category, subcategory }) => {
      if (!name?.trim()) return;
      const exist = await checkBookExists(name, category, subcategory);
      if (exist) {
        showAlert({
          title: `添加${category}失败`,
          content: '已有该词书',
          buttons: [{ text: '确定' }],
        });
        return;
      }

      const newBook = {
        _id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        name: name.trim(),
        owner: user.userId,
        source_type: 'user',
        category,
        subcategory: subcategory?.trim() || null,
        word_count: 0,
      };

      if (category === '笔记本') {
        newBook.is_expanded = 1;
        newBook.style_type = 'default';
        const existingNotebooks = await getBooksByCategory('笔记本');
        newBook.note_order = existingNotebooks.length + 1;
      }

      await createBook(newBook);

      updateLocalBookState('ADD', { category, book: newBook });
      return newBook;
    },
    [user.userId, updateLocalBookState, showAlert],
  );

  const updateUserBook = useCallback(
    async ({ _id, name, category, subcategory, oldName, word_count }) => {
      if (!name?.trim()) return;
      if (oldName !== name.trim()) {
        const exist = await checkBookExists(name, category, subcategory);
        if (exist) {
          showAlert({
            title: `编辑${category}失败`,
            content: '已有该词书',
            buttons: [{ text: '确定' }],
          });
          return;
        }
      }

      const updatedData = {
        _id,
        name: name.trim(),
        category,
        subcategory: subcategory?.trim() || null,
        owner: user.userId,
        source_type: 'user',
        word_count,
      };

      await updateBook(updatedData);

      updateLocalBookState('UPDATE', { category, book: updatedData });
    },
    [updateLocalBookState, user.userId, showAlert],
  );

  const deleteUserBook = useCallback(
    async book => {
      if (!book?._id) return;
      await deleteWordsByBookId(book._id);
      await deleteBookById(book._id);
      if (book.category === '笔记本' && book.note_order != null) {
        await adjustNotebookOrderAfterDelete(book.note_order);
      }
      updateLocalBookState('DELETE', {
        category: book.category,
        bookId: book._id,
      });
    },
    [updateLocalBookState],
  );

  const value = useMemo(
    () => ({
      userBooks: displayGroups,
      optionalSubcategories,
      reloadUserBooks: loadUserBooks,
      loadSubcategories,
      setOptionalSubcategories,
      addUserBook,
      updateUserBook,
      deleteUserBook,
    }),
    [
      displayGroups,
      optionalSubcategories,
      loadUserBooks,
      loadSubcategories,
      addUserBook,
      updateUserBook,
      deleteUserBook,
    ],
  );

  return (
    <UserBookContext.Provider value={value}>
      {children}
    </UserBookContext.Provider>
  );
};
