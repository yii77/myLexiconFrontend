import { useEffect, useState, useContext, useMemo } from 'react';

import { fetchLibrary } from '../../../data/api/fetchLibrary';

import { getBooksByCategory } from '../../../data/dao/bookDao';

import { AuthContext } from '../../contexts/AuthContext';

function generateCategories(library) {
  const map = {};
  const mySubcategories = new Set();

  library.forEach(wb => {
    if (wb.source_type === 'user') {
      if (wb.subcategory) {
        mySubcategories.add(wb.subcategory);
      }
    } else {
      const cat = wb.category;
      const subcat = wb.subcategory;

      if (!map[cat]) {
        map[cat] = new Set();
      }

      if (subcat) {
        map[cat].add(subcat);
      }
    }
  });

  const categories = [];

  categories.push({
    name: '我的',
    subcategories: ['全部', ...Array.from(mySubcategories)],
  });

  Object.entries(map).forEach(([name, subSet]) => {
    categories.push({
      name,
      subcategories: ['全部', ...Array.from(subSet)],
    });
  });

  return categories;
}

export function useFetchLibrary() {
  const [library, setLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authFetch } = useContext(AuthContext);

  useEffect(() => {
    async function loadWordbooks() {
      let isMounted = true;
      try {
        const [remoteRes, localBooks] = await Promise.all([
          fetchLibrary(authFetch),
          getBooksByCategory('单词本'),
        ]);

        let remoteBooks = [];

        if (remoteRes.ok && remoteRes.result.success) {
          remoteBooks = remoteRes.result.data;
        } else {
          setError('网络请求失败');
        }

        const allBooks = [...localBooks, ...remoteBooks];
        if (isMounted) {
          setLibrary(allBooks);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError('网络请求失败');
      } finally {
        if (isMounted) setLibraryLoading(false);
      }
    }

    loadWordbooks();
  }, [authFetch]);

  const categories = useMemo(() => {
    return generateCategories(library);
  }, [library]);

  return {
    library,
    categories,
    libraryLoading,
    error,
  };
}
