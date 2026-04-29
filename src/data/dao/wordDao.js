import db from '../local/connection';

import AsyncStorage from '@react-native-async-storage/async-storage';

// 清空 words 表
export function clearWordsTable() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM words;`,
        [],
        () => resolve(),
        (_, err) => reject(err),
      );
    }, reject);
  });
}

// 批量插入/替换单词
export function insertWord(list) {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        list.forEach(item => {
          tx.executeSql(
            `INSERT OR REPLACE INTO words 
              (_id, word, definition, us_phonetic, uk_phonetic) 
              VALUES (?, ?, ?, ?, ?);`,
            [
              item._id,
              item.word,
              JSON.stringify(item.definition || []),
              item.us_phonetic || '',
              item.uk_phonetic || '',
            ],
            null,
            (_, err) => reject(err),
          );
        });
      },
      reject,
      resolve,
    );
  });
}

// 获取单词本地数据版本号
export async function getLocalWordsVersion() {
  return await AsyncStorage.getItem('words_version');
}

// 保存单词本地数据版本号
export async function setLocalWordsVersion(version) {
  await AsyncStorage.setItem('words_version', String(version));
}

// 根据单词精确查询
export function getWordByExact(word) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM words WHERE word = ?`,
        [word],
        (_, results) => {
          resolve(results.rows.length > 0 ? results.rows.item(0) : null);
        },
        (_, error) => reject(error),
      );
    }, reject);
  });
}
