export const createWordLearningTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS word_learning (
      word TEXT PRIMARY KEY,
      status INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      difficulty REAL DEFAULT 1.0,
      next_review_time INTEGER
    );
  `);
};
