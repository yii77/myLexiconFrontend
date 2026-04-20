import db from '../local/connection';

export async function batchInsertWordsIfNotExists(result) {
  return new Promise((resolve, reject) => {
    const words = Array.isArray(result)
      ? result.map(item => item.word).filter(Boolean)
      : [];

    if (words.length === 0) return resolve({});

    db.transaction(
      tx => {
        for (const word of words) {
          if (!word) continue;

          tx.executeSql(
            `INSERT OR IGNORE INTO word_learning 
              (word, status, review_count, error_count, difficulty_rate, difficulty_star, next_review_time)
             VALUES (?, 0, 0, 0, 1.0, 3, NULL)`,
            [word],
          );
        }
      },
      error => {
        reject(error);
      },
      () => {
        resolve({});
      },
    );
  });
}
