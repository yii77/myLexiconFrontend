export const createWordLearningTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS word_learning (
      word TEXT PRIMARY KEY,
      status INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      difficulty_rate REAL DEFAULT 1.0, 
      difficulty_star INTEGER DEFAULT 3,  
      next_review_time INTEGER
    );
  `);
};
