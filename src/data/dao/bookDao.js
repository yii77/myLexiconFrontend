import db from '../local/connection';

// ==============================================
// 新增操作
// ==============================================

export function createBook(book) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        INSERT INTO books
        (
          _id,
          name,
          owner,
          source_type,
          category,
          subcategory,
          word_count,
          is_expanded,
          note_order,
          style_type
        )
        VALUES (?,?,?,?,?,?,?,?,?,?)
        `,
        [
          book._id,
          book.name,
          book.owner ?? null,
          book.source_type ?? null,
          book.category ?? null,
          book.subcategory ?? null,
          book.word_count ?? 0,
          book.is_expanded != null ? (book.is_expanded ? 1 : 0) : 0,
          book.note_order ?? null,
          book.style_type ?? null,
        ],
        (_, result) => resolve(result),
        (_, error) => {
          if (error.message.includes('UNIQUE')) {
            reject(new Error('词书ID或名称已存在'));
          } else {
            reject(error);
          }
          return true;
        },
      );
    });
  });
}

// ==============================================
// 查询操作
// ==============================================

export function getBooksByCategory(category) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT *
        FROM books
        WHERE category = ?
        ORDER BY _id ASC
        `,
        [category],
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

export function getNotebooks() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM books WHERE category = '笔记本' ORDER BY note_order ASC`,
        [],
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

export function getSubcategoriesByCategory(category) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT DISTINCT subcategory
        FROM books
        WHERE category = ?
          AND source_type = 'user'
          AND subcategory IS NOT NULL
        `,
        [category],
        (_, { rows }) => {
          const result = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i).subcategory);
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

export function getWordbookById(id) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT _id FROM books WHERE _id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
}

export function getWordCountByBookId(bookId) {
  if (!bookId) {
    return Promise.resolve(0);
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT word_count
        FROM books
        WHERE _id = ?
        LIMIT 1
        `,
        [bookId],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0).word_count ?? 0);
          } else {
            resolve(0);
          }
        },
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export function checkBookExists(name, category, subcategory) {
  const bookName = name?.trim() || '';
  const bookCategory = category?.trim() || '';
  const bookSubcategory = subcategory?.trim() || null;

  if (!bookName) {
    console.warn('词书名称不能为空');
    return Promise.resolve(false);
  }
  if (!bookCategory) {
    console.warn('词书分类不能为空');
    return Promise.resolve(false);
  }

  const sql = `
    SELECT 1 FROM books 
    WHERE name = ? 
    AND category = ? 
    AND (subcategory = ? OR (subcategory IS NULL AND ? IS NULL))
    LIMIT 1;
  `;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        [bookName, bookCategory, bookSubcategory, bookSubcategory],
        (_, { rows }) => {
          resolve(rows.length > 0);
        },
        (_, error) => {
          console.error('查询词书是否存在失败：', error);
          resolve(false);
          return false;
        },
      );
    });
  });
}

// ==============================================
// 更新操作
// ==============================================

export function updateBook(book) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        UPDATE books
        SET
          name = ?,
          category = ?,
          subcategory = ?
        WHERE _id = ?
        `,
        [book.name, book.category ?? null, book.subcategory ?? null, book._id],
        (_, result) => resolve(result),
        (_, error) => {
          if (error.message.includes('UNIQUE')) {
            reject(new Error('词书名称已存在'));
          } else {
            reject(error);
          }
          return true;
        },
      );
    });
  });
}

export function updateWordCountByDelta(bookId, delta) {
  if (!bookId || typeof delta !== 'number') return Promise.resolve();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
        UPDATE books
        SET word_count = MAX(word_count + ?, 0)
        WHERE _id = ?
        `,
        [delta, bookId],
        () => resolve(),
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export function adjustNotebookOrderAfterDelete(deletedOrder) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE books
         SET note_order = note_order - 1
         WHERE category = '笔记本' AND note_order > ?`,
        [deletedOrder],
        (_, result) => resolve(result),
        (_, error) => reject(error),
      );
    });
  });
}

// ==============================================
// 删除操作
// ==============================================

export function deleteBookById(book_id) {
  return new Promise((resolve, reject) => {
    if (!book_id) {
      reject(new Error('book_id 不能为空'));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM books WHERE _id = ?`,
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
