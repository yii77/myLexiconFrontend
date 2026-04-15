export const createDistractorsTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS distractors (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id TEXT,
      distractor_id TEXT,
      type INTEGER
    );
  `);
};
