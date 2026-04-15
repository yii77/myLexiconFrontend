import {
  queryReviewWords,
  queryNewWords,
} from '../../data/repository/fetchPracticeWords';

function toQueueItem(word, type) {
  return {
    type,
    word: word.word,
    reviewCount: word.review_count,
    difficulty: word.difficulty,
  };
}

function mixQueue(reviewWords, newWords) {
  const queue = [];
  let r = 0;
  let n = 0;

  while (r < reviewWords.length || n < newWords.length) {
    for (let i = 0; i < 3 && r < reviewWords.length; i++) {
      queue.push(toQueueItem(reviewWords[r++], 'review'));
    }
    if (n < newWords.length) {
      queue.push(toQueueItem(newWords[n++], 'new'));
    }
  }

  return queue;
}

function buildQueue(reviewWords, newWords, learningMode) {
  switch (learningMode) {
    case 'review_first':
      return [
        ...reviewWords.map(w => toQueueItem(w, 'review')),
        ...newWords.map(w => toQueueItem(w, 'new')),
      ];
    case 'new_first':
      return [
        ...newWords.map(w => toQueueItem(w, 'new')),
        ...reviewWords.map(w => toQueueItem(w, 'review')),
      ];
    case 'review_only':
      return reviewWords.map(w => toQueueItem(w, 'review'));
    case 'mixed':
    default:
      return mixQueue(reviewWords, newWords);
  }
}

export async function generatePracticeMaterialQueue(
  wordbookId,
  config,
  finishedNew = 0,
  finishedReview = 0,
) {
  if (!wordbookId) {
    return {
      practiceMaterialQueue: [],
      todayReviewWordCount: 0,
      todayNewWordCount: 0,
    };
  }

  const {
    daily_new_limit,
    daily_review_limit,
    daily_total_limit,
    study_order,
    review_order,
    learning_mode,
  } = config;

  // 扣减今日已完成数量
  const effectiveNewLimit = Math.max((daily_new_limit || 0) - finishedNew, 0);
  const effectiveReviewLimit = Math.max(
    (daily_review_limit || 0) - finishedReview,
    0,
  );

  const reviewWords = await queryReviewWords(
    effectiveReviewLimit,
    review_order,
  );

  const remainingCapacity = Math.max(daily_total_limit - reviewWords.length, 0);
  const newLimit =
    learning_mode === 'review_only'
      ? 0
      : Math.min(effectiveNewLimit, remainingCapacity);

  const newWords =
    newLimit > 0 ? await queryNewWords(wordbookId, newLimit, study_order) : [];

  const practiceMaterialQueue = buildQueue(
    reviewWords,
    newWords,
    learning_mode,
  );

  return {
    practiceMaterialQueue,
    todayReviewWordCount: reviewWords.length,
    todayNewWordCount: learning_mode === 'review_only' ? 0 : newWords.length,
  };
}
