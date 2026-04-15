import db from './connection';

// schema
import { createBooksTable } from './schema/books.schema';
import { createWordsTable } from './schema/words.schema';
import { createWordLearningTable } from './schema/wordLearning.schema';
import { createWordBookMappingTable } from './schema/wordBookMapping.schema';
import { createUserSettingsTable } from './schema/userSettings.schema';
import { createDistractorsTable } from './schema/distractors.schema';

// index
import { createWordIndex } from './index/word.index';
import { createLearningIndex } from './index/learning.index';

export function initDB() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // ===== tables =====
        createBooksTable(tx);
        createWordsTable(tx);
        createWordLearningTable(tx);
        createWordBookMappingTable(tx);
        createUserSettingsTable(tx);
        createDistractorsTable(tx);

        // ===== indexes =====
        createWordIndex(tx);
        createLearningIndex(tx);
      },
      error => {
        reject(error);
      },
      () => {
        resolve();
      },
    );
  });
}
