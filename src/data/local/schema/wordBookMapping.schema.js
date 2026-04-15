export const createWordBookMappingTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS word_book_mapping (
      _id TEXT PRIMARY KEY,
      word TEXT,
      book_id TEXT,
      order_index INTEGER,
      unit_id TEXT,
      title TEXT,
      content TEXT,
      create_time TEXT
    );
  `);
};
