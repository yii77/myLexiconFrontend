export const createWordIndex = tx => {
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_words_book_id 
    ON word_book_mapping(book_id);
  `);
};
