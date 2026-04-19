import { useContext, useCallback } from 'react';

import {
  getWordsByIds,
  addWordsToBook,
  deleteWordsByIds,
  normalizeWordOrder,
  filterWordsNotInBook,
  updateWordsUnitInfo,
} from '../../../data/dao/wordBookMappingDao';
import {
  getWordCountByBookId,
  updateWordCountByDelta,
} from '../../../data/dao/bookDao';

import { UserBookContext } from '../../contexts/UserBookContext';
import { PracticeWordbookContext } from '../../contexts/PracticeWordbookContext';

export function useWordActions() {
  const { updateLocalBookState } = useContext(UserBookContext);
  const { refreshWordbookStats } = useContext(PracticeWordbookContext);

  const deleteWords = useCallback(async (wordIds, displayBook) => {
    await deleteWordsByIds(wordIds);

    const updatedBook = {
      ...displayBook,
      word_count: displayBook.word_count - wordIds.length,
    };

    updateWordCountByDelta(displayBook._id, -wordIds.length);
    if (displayBook.source_type != 'system') {
      updateLocalBookState('UPDATE', {
        category: updatedBook.category,
        book: updatedBook,
      });
    } else {
      await refreshWordbookStats();
    }

    await normalizeWordOrder(displayBook._id);
  }, []);

  const copyWordsToBook = useCallback(async (wordIds, targetBook) => {
    if (!wordIds?.length || !targetBook?._id) return;

    const words = await getWordsByIds(wordIds);

    const filteredWords = await filterWordsNotInBook(words, targetBook._id);

    if (filteredWords.length === 0) return;

    const currentCount = (await getWordCountByBookId(targetBook._id)) || 0;

    await addWordsToBook(filteredWords, targetBook._id, currentCount);

    const updatedTarget = {
      ...targetBook,
      word_count: currentCount + filteredWords.length,
    };

    await updateWordCountByDelta(targetBook._id, filteredWords.length);

    if (targetBook.source_type !== 'system') {
      updateLocalBookState('UPDATE', {
        category: updatedTarget.category,
        book: updatedTarget,
      });
    } else {
      await refreshWordbookStats();
    }
  }, []);

  const moveWordsToUnit = useCallback(async (wordIds, unit_id, title) => {
    if (!wordIds || wordIds.length === 0) return false;

    try {
      const success = await updateWordsUnitInfo(wordIds, unit_id, title);
      if (success) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('批量移动单词失败:', err);
      throw err;
    }
  }, []);

  return {
    deleteWords,
    copyWordsToBook,
    moveWordsToUnit,
  };
}
