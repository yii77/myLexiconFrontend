import db from '../local/connection';

import { generateObjectId } from '../../logic/utils/generateObjectId';

// ==============================================
// 新增操作
// ==============================================

export function addWordsToBook(words, bookId, startIndex = 0) {
  if (!words?.length || !bookId) {
    return Promise.resolve();
  }

  const createTime = Date.now();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        words.forEach((word, i) => {
          const orderIndex = startIndex + i;

          const _id = generateObjectId();

          tx.executeSql(
            `INSERT INTO word_book_mapping
             (_id, word, book_id, order_index, unit_id, title, content, create_time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [_id, word, bookId, orderIndex, null, null, null, createTime],
          );
        });
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

export function insertWords(words) {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        words.forEach(w => {
          tx.executeSql(
            `
            INSERT OR REPLACE INTO word_book_mapping
            (_id, word, book_id, order_index, unit_id, title, content, create_time)
            VALUES (?,?,?,?,?,?,?,?)
            `,
            [
              w._id,
              w.word,
              w.book_id,
              w.order,
              w.unit_id,
              w.title,
              JSON.stringify(w.content),
              w.create_time || new Date().toISOString(),
            ],
          );
        });
      },
      error => reject(error),
      () => resolve(),
    );
  });
}

export function createWordNote({ word, book_id, content, word_count }) {
  return new Promise((resolve, reject) => {
    if (!book_id) {
      return reject(new Error('book_id 不能为空'));
    }

    const newId = `${word}_${book_id}`;
    const createTime = new Date().toISOString();

    db.transaction(tx => {
      tx.executeSql(
        `
        INSERT OR REPLACE INTO word_book_mapping
        (_id, word, book_id, order_index, unit_id, title, content, create_time)
        VALUES (?, ?, ?, ?, NULL, NULL, ?, ?)
        `,
        [newId, word, book_id, word_count + 1, content, createTime],

        () => {
          resolve();
        },

        (_, err) => {
          reject(err);
        },
      );
    });
  });
}

// ==============================================
// 查询操作
// ==============================================

export function getBookUnits(bookId) {
  if (!bookId) return Promise.reject(new Error('bookId 不能为空'));

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          unit_id, 
          title, 
          MIN(order_index) as unit_order 
          FROM word_book_mapping 
          WHERE book_id = ? 
          AND unit_id IS NOT NULL
          GROUP BY unit_id 
          ORDER BY unit_order ASC`,
        [bookId],
        (_, result) => {
          const data =
            result.rows._array || (result.rows.raw ? result.rows.raw() : []);

          resolve(data);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function getSectionsByUnit(bookId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT
          unit_id,
          title,
          _id,
          word,
          order_index
        FROM word_book_mapping
        WHERE book_id = ?
        ORDER BY unit_id, order_index ASC
        `,
        [bookId],
        (_, { rows }) => {
          const list = rows.raw();
          const sections = [];
          const map = {};

          list.forEach(item => {
            const unitId = item.unit_id || 'no_unit';
            const title = item.title || '未分组'; // 直接用你表里的 title

            if (!map[unitId]) {
              map[unitId] = {
                type: 'unit',
                key: unitId,
                title: title,
                data: [],
              };
              sections.push(map[unitId]);
            }

            map[unitId].data.push({
              _id: item._id,
              word: item.word,
              order_index: item.order_index,
            });
          });

          resolve(sections);
        },
        reject,
      );
    });
  });
}

export function getSectionsByAlphabet(bookId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT
          UPPER(SUBSTR(word, 1, 1)) AS letter,
          _id,
          word,
          order_index
        FROM word_book_mapping
        WHERE book_id = ?
        ORDER BY letter ASC, word ASC
      `,
        [bookId],
        (_, { rows }) => {
          const list = rows.raw();
          const sections = [];
          const map = {};

          list.forEach(item => {
            const letter = item.letter || '#';
            if (!map[letter]) {
              map[letter] = {
                type: 'letter',
                key: letter,
                title: letter,
                data: [],
              };
              sections.push(map[letter]);
            }
            map[letter].data.push({
              _id: item._id,
              word: item.word,
              order_index: item.order_index,
            });
          });

          resolve(sections);
        },
        reject,
      );
    });
  });
}

export function getSectionsByCreateTime(bookId, sortDirection = 'DESC') {
  // 安全限制：只允许 ASC / DESC
  const safeSort = sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT
          DATE(create_time) AS date, -- 精确到天
          _id,
          word,
          order_index
        FROM word_book_mapping
        WHERE book_id = ?
        ORDER BY create_time ${safeSort} -- 动态正序/倒序
        `,
        [bookId],
        (_, { rows }) => {
          const list = rows.raw();
          const sections = [];
          const map = {};

          list.forEach(item => {
            const date = item.date || '未知日期';

            if (!map[date]) {
              map[date] = {
                type: 'date',
                key: date,
                title: date,
                data: [],
              };
              sections.push(map[date]);
            }

            map[date].data.push({
              _id: item._id,
              word: item.word,
              order_index: item.order_index,
            });
          });

          resolve(sections);
        },
        reject,
      );
    });
  });
}

export function filterWordsNotInBook(words, targetBookId) {
  return new Promise((resolve, reject) => {
    if (!words?.length || !targetBookId) {
      resolve([]);
      return;
    }

    const placeholders = words.map(() => '?').join(',');

    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT word
        FROM word_book_mapping
        WHERE book_id = ?
        AND word IN (${placeholders})
        `,
        [targetBookId, ...words],
        (_, result) => {
          const existingWords = new Set();

          for (let i = 0; i < result.rows.length; i++) {
            existingWords.add(result.rows.item(i).word);
          }

          const filteredWords = words.filter(word => !existingWords.has(word));

          resolve(filteredWords);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
}

export function getWordsByBookId(bookId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT word
        FROM word_book_mapping
        WHERE book_id = ?
        ORDER BY order_index ASC
        `,
        [bookId],
        (_, { rows }) => {
          const result = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i).word);
          }
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export function getWordEntriesByBookId(bookId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT *
        FROM word_book_mapping
        WHERE book_id = ?
        ORDER BY order_index ASC
        `,
        [bookId],
        (_, { rows }) => {
          const result = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export function getWordsByIds(ids) {
  if (!ids || ids.length === 0) {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const placeholders = ids.map(() => '?').join(',');

      tx.executeSql(
        `
        SELECT word
        FROM word_book_mapping
        WHERE _id IN (${placeholders})
        `,
        ids,
        (_, { rows }) => {
          const result = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i).word);
          }
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export function getNotesByWordAndBookIds(word, bookIds) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return resolve([]);
    }

    const placeholders = bookIds.map(() => '?').join(',');

    const sql = `
      SELECT *
      FROM word_book_mapping
      WHERE word = ?
      AND book_id IN (${placeholders})
      ORDER BY CASE book_id
        ${bookIds.map((id, index) => `WHEN ? THEN ${index}`).join(' ')}
      END
    `;

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [word, ...bookIds, ...bookIds],
        (_, { rows }) => {
          const result = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export function getContentByWordAndBookId(word, bookId) {
  return new Promise((resolve, reject) => {
    if (!word || !bookId) {
      resolve('');
      return;
    }

    const sql = `
      SELECT content
      FROM word_book_mapping
      WHERE word = ? AND book_id = ?
      LIMIT 1
    `;

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [word, bookId],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0).content || '');
          } else {
            resolve('');
          }
        },
        (_, error) => {
          console.error('查询失败：', error);
          reject(error);
        },
      );
    });
  });
}

export function getBookIdsByWord(word) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT book_id FROM word_book_mapping WHERE word = ?;',
        [word],
        (_, result) => {
          const ids = [];
          for (let i = 0; i < result.rows.length; i++) {
            ids.push(result.rows.item(i).book_id);
          }
          resolve(ids);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
}

// ==============================================
// 更新操作
// ==============================================

export function updateWordNote({ _id, content, selectedBook }) {
  if (!_id) throw new Error('_id 不能为空');

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        UPDATE word_book_mapping
        SET content = ?, book_id = ?
        WHERE _id = ?
        `,
        [content, selectedBook, _id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(result.rowsAffected);
          } else {
            resolve(0);
          }
        },
        (_, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
}

export function normalizeWordOrder(bookId) {
  if (!bookId) {
    return Promise.reject(new Error('bookId 不能为空'));
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT _id, order_index
        FROM word_book_mapping
        WHERE book_id = ?
        ORDER BY order_index ASC
        `,
        [bookId],
        (_, { rows }) => {
          const notes = [];
          for (let i = 0; i < rows.length; i++) {
            notes.push(rows.item(i));
          }

          if (notes.length === 0) {
            resolve();
            return;
          }

          const updateNext = index => {
            if (index >= notes.length) {
              resolve();
              return;
            }

            const note = notes[index];
            const newIndex = index + 1;

            tx.executeSql(
              `
              UPDATE word_book_mapping
              SET order_index = ?
              WHERE _id = ?
              `,
              [newIndex, note._id],
              () => {
                updateNext(index + 1);
              },
              (_, error) => {
                reject(error);
                return false;
              },
            );
          };

          updateNext(0);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
}

export function updateWordsUnitInfo(wordIds, unit_id, title) {
  if (!Array.isArray(wordIds) || wordIds.length === 0) {
    return Promise.reject(new Error('wordIds 必须是一个非空数组'));
  }

  const placeholders = wordIds.map(() => '?').join(',');
  const sql = `UPDATE word_book_mapping 
               SET unit_id = ?, title = ? 
               WHERE _id IN (${placeholders})`;

  const params = [unit_id, title, ...wordIds];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => {
          resolve(result.rowsAffected > 0);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function updateUnitTitle(bookId, previousTitle, newTitle) {
  if (!bookId || !previousTitle || !newTitle) {
    return Promise.reject(
      new Error('bookId / previousTitle / newTitle 不能为空'),
    );
  }

  const sql = `
    UPDATE word_book_mapping
    SET title = ?
    WHERE book_id = ?
      AND title = ?
  `;

  const params = [newTitle, bookId, previousTitle];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => {
          resolve(result.rowsAffected > 0);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

// ==============================================
// 删除操作
// ==============================================

export function deleteWordsByIds(ids) {
  if (!ids || ids.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const placeholders = ids.map(() => '?').join(',');

      tx.executeSql(
        `
        DELETE FROM word_book_mapping
        WHERE _id IN (${placeholders})
        `,
        ids,
        () => resolve(),
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export function deleteWordsByBookId(book_id) {
  return new Promise((resolve, reject) => {
    if (!book_id) {
      reject(new Error('book_id 不能为空'));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM word_book_mapping WHERE book_id = ?`,
        [book_id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}
