export const createWordsTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS words (
      _id TEXT PRIMARY KEY,
      word TEXT,
      definition TEXT
    );
  `);
};
