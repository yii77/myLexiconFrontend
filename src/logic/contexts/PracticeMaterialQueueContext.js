import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { PracticeConfigContext } from './PracticeConfigContext';
import { PracticeWordbookContext } from './PracticeWordbookContext';

import { generatePracticeMaterialQueue } from '../services/PracticeMaterialQueueService';

const STORAGE_KEY = 'practiceMaterial';

export const PracticeMaterialQueueContext = createContext({});

const initialState = {
  practiceMaterialQueue: [],
  todayNewWordCount: 0,
  todayReviewWordCount: 0,
  todayFinishedNewWordCount: 0,
  todayFinishedReviewWordCount: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'COMPLETE_STEP': {
      const { word, step, correct } = action;

      return {
        ...state,
        practiceMaterialQueue: state.practiceMaterialQueue.map(item => {
          if (item.word !== word) return item;

          return {
            ...item,
            currentStep: correct ? step : 0,
            errorCount: correct ? item.errorCount : item.errorCount + 1,
          };
        }),
      };
    }

    case 'REMOVE_WORD': {
      const { word, wordType } = action;

      return {
        ...state,
        practiceMaterialQueue: state.practiceMaterialQueue.filter(
          item => item.word !== word,
        ),

        todayNewWordCount:
          wordType === 'new'
            ? state.todayNewWordCount - 1
            : state.todayNewWordCount,

        todayReviewWordCount:
          wordType === 'review'
            ? state.todayReviewWordCount - 1
            : state.todayReviewWordCount,

        todayFinishedNewWordCount:
          wordType === 'new'
            ? state.todayFinishedNewWordCount + 1
            : state.todayFinishedNewWordCount,

        todayFinishedReviewWordCount:
          wordType === 'review'
            ? state.todayFinishedReviewWordCount + 1
            : state.todayFinishedReviewWordCount,
      };
    }

    default:
      return state;
  }
}

export function PracticeMaterialQueueProvider({ children }) {
  const { config } = useContext(PracticeConfigContext);
  const { practiceWordbook } = useContext(PracticeWordbookContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    practiceMaterialQueue,
    todayNewWordCount,
    todayReviewWordCount,
    todayFinishedNewWordCount,
    todayFinishedReviewWordCount,
  } = state;

  // 初始化 + 恢复缓存
  useEffect(() => {
    if (!practiceWordbook?._id || !config) return;

    let isMounted = true;

    const run = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        const TODAY = new Date().toISOString().slice(0, 10);
        const configKey = JSON.stringify(config);

        let finishedNew = 0;
        let finishedReview = 0;

        if (saved) {
          const parsed = JSON.parse(saved);

          const isToday = parsed.date === TODAY;

          if (isToday) {
            finishedNew = parsed.todayFinishedNewWordCount || 0;
            finishedReview = parsed.todayFinishedReviewWordCount || 0;
          }

          const canReuse =
            parsed.practiceWordbookId === practiceWordbook._id &&
            parsed.configKey === configKey &&
            isToday;

          if (canReuse && isMounted) {
            dispatch({
              type: 'INIT',
              payload: {
                practiceMaterialQueue: parsed.queue || [],
                todayNewWordCount: parsed.todayNewWordCount || 0,
                todayReviewWordCount: parsed.todayReviewWordCount || 0,
                todayFinishedNewWordCount: finishedNew,
                todayFinishedReviewWordCount: finishedReview,
              },
            });
            return;
          }
        }

        const result = await generatePracticeMaterialQueue(
          practiceWordbook._id,
          config,
          finishedNew,
          finishedReview,
        );

        if (!isMounted) return;

        const queueWithStep = result.practiceMaterialQueue.map(item => ({
          ...item,
          currentStep: 0,
          errorCount: 0,
        }));

        dispatch({
          type: 'INIT',
          payload: {
            practiceMaterialQueue: queueWithStep,
            todayNewWordCount: result.todayNewWordCount,
            todayReviewWordCount: result.todayReviewWordCount,
            todayFinishedNewWordCount: finishedNew,
            todayFinishedReviewWordCount: finishedReview,
          },
        });
      } catch (err) {
        console.log('初始化队列失败', err);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [practiceWordbook?._id, config]);

  // 自动保存
  const saveLearningStateToStorage = async () => {
    try {
      const TODAY = new Date().toISOString().slice(0, 10);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          practiceWordbookId: practiceWordbook?._id,
          queue: practiceMaterialQueue,
          date: TODAY,
          todayNewWordCount,
          todayReviewWordCount,
          todayFinishedNewWordCount,
          todayFinishedReviewWordCount,
          configKey: JSON.stringify(config),
        }),
      );
    } catch (err) {
      console.log('保存队列失败', err);
    }
  };

  useEffect(() => {
    if (!practiceWordbook?._id) return;
    saveLearningStateToStorage();
  }, [
    practiceMaterialQueue,
    todayNewWordCount,
    todayReviewWordCount,
    todayFinishedNewWordCount,
    todayFinishedReviewWordCount,
  ]);

  // actions
  const completeStep = useCallback((word, step, correct = true) => {
    dispatch({
      type: 'COMPLETE_STEP',
      word,
      step,
      correct,
    });
  }, []);

  const removeWordFromQueue = useCallback((word, type) => {
    dispatch({
      type: 'REMOVE_WORD',
      word,
      wordType: type,
    });
  }, []);

  const value = useMemo(() => {
    return {
      practiceMaterialQueue,
      todayNewWordCount,
      todayReviewWordCount,
      todayFinishedNewWordCount,
      todayFinishedReviewWordCount,
      completeStep,
      removeWordFromQueue,
    };
  }, [
    practiceMaterialQueue,
    todayNewWordCount,
    todayReviewWordCount,
    todayFinishedNewWordCount,
    todayFinishedReviewWordCount,
  ]);

  return (
    <PracticeMaterialQueueContext.Provider value={value}>
      {children}
    </PracticeMaterialQueueContext.Provider>
  );
}
