export const createDistractorIndex = tx => {
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_distractors_word_id 
    ON distractors(word_id);
  `);
};
