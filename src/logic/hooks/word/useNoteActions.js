import { useCallback } from 'react';

import {
  createWordNote,
  updateWordNote,
  deleteNoteById,
} from '../../../data/dao/wordBookMappingDao';
import { updateWordCountByDelta } from '../../../data/dao/bookDao';

export function useNoteActions() {
  const addNote = useCallback(async ({ word, selectedBook, content }) => {
    try {
      await createWordNote({
        word,
        book_id: selectedBook._id,
        content,
        word_count: selectedBook.word_count,
      });
      await updateWordCountByDelta(selectedBook._id, 1);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateNote = useCallback(
    async ({ selectedBook, noteId, content, previousBook }) => {
      try {
        await updateWordNote({
          _id: noteId,
          content,
          selectedBook: selectedBook._id,
        });
        if (selectedBook._id != previousBook._id) {
          await updateWordCountByDelta(selectedBook._id, 1);
          await updateWordCountByDelta(previousBook._id, -1);
        }
      } catch (err) {
        console.error('更新笔记失败:', err);
      }
    },
    [],
  );

  const deleteNote = useCallback(async _id => {
    try {
      await deleteNoteById(_id);
      await updateWordCountByDelta(_id, -1);
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  return {
    addNote,
    updateNote,
    deleteNote,
  };
}
