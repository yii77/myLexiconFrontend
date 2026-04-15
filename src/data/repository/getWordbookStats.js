import db from '../local/connection';

export function getWordbookStats(wordbookId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT
          COUNT(wbm.word) AS totalWordCount,

          SUM(CASE 
                WHEN wl.status = 1 THEN 1 
                ELSE 0 
              END) AS learningCount,

          SUM(CASE 
                WHEN wl.status = 2 THEN 1 
                ELSE 0 
              END) AS masteredCount,

          SUM(CASE 
                WHEN wl.status IS NULL OR wl.status = 0 THEN 1 
                ELSE 0 
              END) AS newCount

        FROM word_book_mapping wbm
        LEFT JOIN word_learning wl
        ON wbm.word = wl.word

        WHERE wbm.book_id = ?
        `,
        [wordbookId],
        (_, result) => {
          if (result.rows.length > 0) {
            const row = result.rows.item(0);

            resolve({
              word_count: row.totalWordCount || 0,
              learning_count: row.learningCount || 0,
              mastered_count: row.masteredCount || 0,
              new_count: row.newCount || 0,
            });
          } else {
            resolve({
              word_count: 0,
              learning_count: 0,
              mastered_count: 0,
              new_count: 0,
            });
          }
        },
        (_, error) => {
          console.error('获取词书统计失败', error);
          reject(error);
          return true;
        },
      );
    });
  });
}
