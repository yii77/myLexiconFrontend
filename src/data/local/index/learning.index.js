export const createLearningIndex = tx => {
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_next_review_time 
    ON word_learning(next_review_time);
  `);
};
