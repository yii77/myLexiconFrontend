import db from '../local/connection';

function getOrderSQL(order) {
  if (order === 'random') return 'ORDER BY RANDOM()';
  if (order === 'alphabet') return 'ORDER BY w.word';
  if (order === 'book') return 'ORDER BY m.order_index';
  if (order === 'time') return 'ORDER BY next_review_time ASC';
  return '';
}

export function queryReviewWords(limit, reviewOrder) {
  return new Promise((resolve, reject) => {
    const today = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
    const orderSQL = getOrderSQL(reviewOrder);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT w.word, w.review_count, w.difficulty
         FROM word_learning w
         WHERE w.next_review_time <= ?
         ${orderSQL}
         LIMIT ?`,
        [today, limit],
        (_, result) => {
          const rows = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          resolve(rows);
        },
        (_, error) => reject(error),
      );
    });
  });
}

export function queryNewWords(wordbookId, limit, studyOrder) {
  return new Promise((resolve, reject) => {
    const orderSQL = getOrderSQL(studyOrder);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.word, w.review_count, w.difficulty
         FROM word_book_mapping m
         LEFT JOIN word_learning w ON m.word = w.word
         WHERE m.book_id = ?
           AND (w.status = 0 OR w.status IS NULL)
         ${orderSQL}
         LIMIT ?`,
        [wordbookId, limit],
        (_, result) => {
          const rows = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          resolve(rows);
        },
        (_, error) => reject(error),
      );
    });
  });
}
