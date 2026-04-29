export const createDistractorsTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS distractors (
      _id TEXT PRIMARY KEY,
      word_id TEXT,
      distractor_id TEXT,
      type INTEGER
    );
  `);
};
