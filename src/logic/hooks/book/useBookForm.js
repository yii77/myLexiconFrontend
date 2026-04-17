import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { UserBookContext } from '../../../logic/contexts/UserBookContext';
import { getSubcategoriesByCategory } from '../../../data/dao/bookDao';
import { useCustomAlert } from '../../../presentation/components/system/Alert/useCustomAlert';

export function useBookForm(navigation, route) {
  const { category, editingBook } = route.params || {};
  const { addUserBook, updateUserBook, deleteUserBook } =
    useContext(UserBookContext);
  const { showAlert, hideAlert } = useCustomAlert();

  const isEdit = useMemo(() => !!editingBook, [editingBook]);

  const [subcategory, setSubcategory] = useState(
    editingBook?.subcategory || '',
  );
  const [bookName, setBookName] = useState(editingBook?.name || '');
  const [optionalSubcategories, setOptionalSubcategories] = useState([]);

  useEffect(() => {
    const targetCategory = isEdit ? editingBook.category : category;
    if (!targetCategory) return;

    let isMounted = true;
    const loadData = async () => {
      try {
        const subs = await getSubcategoriesByCategory(targetCategory);
        if (isMounted) setOptionalSubcategories(subs || []);
      } catch (err) {
        console.error('Failed to load subcategories:', err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [category, editingBook, isEdit]);

  const close = useCallback(() => navigation.goBack(), [navigation]);

  const handleConfirm = useCallback(async () => {
    if (!subcategory.trim()) {
      return showAlert({
        title: '提示',
        content: '分类不能为空',
        type: 'center',
        buttons: [{ text: '确定', onPress: hideAlert }],
      });
    }
    if (!bookName.trim()) {
      return showAlert({
        title: '提示',
        content: '名称不能为空',
        type: 'center',
        buttons: [{ text: '确定', onPress: hideAlert }],
      });
    }

    try {
      if (isEdit) {
        await updateUserBook({
          _id: editingBook._id,
          name: bookName,
          category: editingBook.category,
          subcategory,
          oldName: editingBook.name,
          word_count: editingBook.word_count,
        });
      } else {
        await addUserBook({ name: bookName, category, subcategory });
      }
      close();
    } catch (err) {
      showAlert({
        title: '错误',
        content: `${isEdit ? '保存' : '新增'}失败: ${err.message}`,
        type: 'center',
        buttons: [{ text: '确定', onPress: hideAlert }],
      });
    }
  }, [
    subcategory,
    bookName,
    isEdit,
    editingBook,
    category,
    updateUserBook,
    addUserBook,
    close,
    showAlert,
    hideAlert,
  ]);

  const handleDelete = useCallback(() => {
    const prompt =
      editingBook?.category === '笔记本'
        ? `确定删除 "${editingBook.name}" 吗？该笔记本的所有笔记将被清空！`
        : `确定删除 "${editingBook.name}" 吗？`;

    showAlert({
      title: '删除书籍',
      content: prompt,
      type: 'center',
      buttons: [
        { text: '取消', onPress: hideAlert },
        {
          text: '确定',
          onPress: async () => {
            await deleteUserBook(editingBook);
            hideAlert();
            close();
          },
        },
      ],
    });
  }, [editingBook, showAlert, hideAlert, deleteUserBook, close]);

  return {
    state: {
      subcategory,
      bookName,
      optionalSubcategories,
      isEdit,
      category,
      editingBook,
    },
    actions: {
      setSubcategory,
      setBookName,
      handleConfirm,
      handleDelete,
      close,
    },
  };
}
