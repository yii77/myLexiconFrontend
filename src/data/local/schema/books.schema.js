export const createBooksTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS books (
      _id TEXT PRIMARY KEY,
      name TEXT,
      owner TEXT,
      source_type TEXT,
      category TEXT,
      subcategory TEXT,
      word_count INTEGER,
      is_expanded INTEGER DEFAULT 0,
      note_order INTEGER,
      style_type TEXT
    );
  `);
};
