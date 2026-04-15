import { useCallback } from 'react';

import { useRoute, useNavigation } from '@react-navigation/native';

import { useFetchLibrary } from '../../../logic/hooks/library/useFetchLibrary';
import { useFilterWordbook } from '../../../logic/hooks/library/useFilterWordbook';
import { useDownloadWordbook } from '../../../logic/hooks/library/useDownloadWordbook';

export function useLibraryController() {
  const route = useRoute();
  const navigation = useNavigation();
  const { practiceWordbookId } = route.params || {};

  // ===== 数据 =====
  const { library, categories, libraryLoading, error } = useFetchLibrary();

  // ===== 分类逻辑 =====
  const {
    selectedCategory,
    selectedSubcategory,
    filteredWordbooks,
    selectCategory,
    selectSubcategory,
  } = useFilterWordbook(library, categories);

  // ===== 下载逻辑 =====
  const { onDownloadAction } = useDownloadWordbook(navigation);

  const handleSearch = useCallback(() => {
    navigation.navigate('SearchWordbookScreen');
  }, [navigation]);

  return {
    // 数据
    categories,
    libraryLoading,
    error,
    filteredWordbooks,
    practiceWordbookId,

    // 分类状态
    selectedCategory,
    selectedSubcategory,

    // 行为
    handleSearch,
    selectCategory,
    selectSubcategory,
    onDownloadAction,
  };
}
