import db from '../local/connection';

export async function syncWordStatus(result) {
  return new Promise((resolve, reject) => {
    const words = Array.isArray(result)
      ? result.map(item => item.word).filter(Boolean)
      : [];

    if (words.length === 0) return resolve({});

    db.transaction(
      tx => {
        for (const word of words) {
          if (!word) continue;

          // 直接插入，已经存在就忽略
          tx.executeSql(
            `INSERT OR IGNORE INTO word_learning 
              (word, status, review_count, error_count, difficulty, next_review_time)
             VALUES (?, 0, 0, 0, 1.0, NULL)`,
            [word],
          );
        }
      },
      error => {
        console.log('❌ syncWordStatus 事务错误：', error);
        reject(error);
      },
      () => {
        console.log('✅ syncWordStatus 写入完成');
        resolve({});
      },
    );
  });
}
