import { useEffect, useState, useContext, useMemo } from 'react';

import { fetchLibrary } from '../../../data/api/fetchLibrary';

import { getBooksByCategory } from '../../../data/dao/bookDao';

import { AuthContext } from '../../contexts/AuthContext';

import { extractCategory } from '../../utils/extractCategory';

export function useFetchLibrary() {
  const [library, setLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authFetch } = useContext(AuthContext);

  useEffect(() => {
    const loadWordbooks = async () => {
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
    };

    loadWordbooks();
  }, [authFetch]);

  const categories = useMemo(() => {
    return extractCategory(library);
  }, [library]);

  return {
    library,
    categories,
    libraryLoading,
    error,
  };
}
