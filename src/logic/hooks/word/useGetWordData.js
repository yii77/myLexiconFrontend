import {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import { getNotebooks } from '../../../data/dao/bookDao';
import {
  getNotesByWordAndBookIds,
  getContentByWordAndBookId,
} from '../../../data/dao/wordBookMappingDao';
import { getWordByExact } from '../../../data/dao/wordDao';
import { getUserSetting } from '../../../data/dao/userSettingsDao';

import { PracticeWordbookContext } from '../../contexts/PracticeWordbookContext';

export function useGetWordData(word) {
  const [notes, setNotes] = useState([]);
  const [definition, setDefinition] = useState(null);

  const currentWordRef = useRef(word);
  const { practiceWordbook } = useContext(PracticeWordbookContext);

  const loadAllData = useCallback(
    async targetWord => {
      if (!targetWord) return;

      currentWordRef.current = targetWord;

      try {
        const [wordDataResult, showDefinition, styleType, allNoteBooks] =
          await Promise.all([
            getWordByExact(targetWord),
            getUserSetting('show_definition'),
            getUserSetting('definition_style_type'),
            getNotebooks() || [],
          ]);

        let nextDefinition = null;
        if (showDefinition) {
          let defContent = [];
          if (wordDataResult?.definition) {
            try {
              defContent = JSON.parse(wordDataResult.definition);
            } catch (e) {
              defContent = [];
            }
          } else if (practiceWordbook?._id) {
            const learningBookContent = await getContentByWordAndBookId(
              targetWord,
              practiceWordbook._id,
            );
            defContent = JSON.parse(learningBookContent || '[]');
          }

          nextDefinition = {
            word: targetWord,
            _id: `def_${targetWord}`,
            book_id: 'system_def',
            book_name: '释义',
            is_expanded: true,
            style_type: styleType,
            content: defContent,
            source_type: 'system',
            version: targetWord,
          };
        }

        const allNoteBookIds = allNoteBooks.map(item => item._id);
        const notesResult = await getNotesByWordAndBookIds(
          targetWord,
          allNoteBookIds,
        );

        const idToData = allNoteBooks.reduce((acc, item) => {
          acc[item._id] = {
            book_name: item.name,
            is_expanded: item.is_expanded ?? 1,
            style_type: 'default',
          };
          return acc;
        }, {});

        const formattedNotes = notesResult.map(item => ({
          word: item.word,
          _id: item._id,
          book_id: item.book_id,
          ...idToData[item.book_id],
          content: (() => {
            try {
              return JSON.parse(item.content || '[]');
            } catch (e) {
              return [];
            }
          })(),
          source_type: 'user',
          version: item.content,
        }));

        if (currentWordRef.current === targetWord) {
          setDefinition(nextDefinition);
          setNotes(formattedNotes);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [practiceWordbook?._id],
  );

  const wordData = useMemo(() => {
    return definition ? [definition, ...notes] : notes;
  }, [definition, notes]);

  useEffect(() => {
    setNotes([]);
    setDefinition(null);

    if (word) {
      loadAllData(word);
    }
  }, [word, loadAllData]);

  return {
    wordData,
    refreshNotes: () => loadAllData(word),
  };
}
