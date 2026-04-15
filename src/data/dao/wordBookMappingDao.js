import db from '../local/connection';

// ==============================================
// 新增操作
// ==============================================

export function addWordsToBook(words, bookId, startIndex) {
  if (!words || words.length === 0 || !bookId) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      words.forEach((word, i) => {
        const orderIndex = startIndex + i;
        const _id = `${Date.now()}_${Math.floor(Math.random() * 10000)}_${i}`;
        const createTime = new Date().toISOString();

        tx.executeSql(
          `
          INSERT INTO word_book_mapping
          (_id, word, book_id, order_index, unit_id, title, content, create_time)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [_id, word, bookId, orderIndex, null, null, null, createTime],
          () => {},
          (_, error) => {
            reject(error);
            return true;
          },
        );
      });

      resolve();
    });
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
              JSON.stringify(w.note),
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
          console.log('❌ 查询失败', error);
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
            console.log('✅ updateWordNote 更新成功', result.rowsAffected);
            resolve(result.rowsAffected);
          } else {
            console.warn('⚠️ updateWordNote 未找到对应 _id，未更新任何内容');
            resolve(0);
          }
        },
        (_, err) => {
          console.error('❌ updateWordNote 更新失败:', err);
          reject(err);
          return false;
        },
      );
    });
  });
}

export function normalizeWordOrder(bookId) {
  if (!bookId) return Promise.reject(new Error('bookId 不能为空'));

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT _id, order_index FROM word_book_mapping WHERE book_id = ? ORDER BY order_index ASC`,
        [bookId],
        (_, { rows }) => {
          const notes = rows._array;

          if (notes.length === 0) {
            resolve();
            return;
          }

          notes.forEach((note, idx) => {
            const newIndex = idx + 1;
            if (note.order_index !== newIndex) {
              tx.executeSql(
                `UPDATE word_book_mapping SET order_index = ? WHERE _id = ?`,
                [newIndex, note._id],
                () => {},
                (_, error) => {
                  reject(error);
                  return false;
                },
              );
            }
          });

          resolve();
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
