import db from '../local/connection';

import AsyncStorage from '@react-native-async-storage/async-storage';

// 清空 distractors 表
export function clearDistractorTable() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM distractors;`,
        [],
        () => resolve(),
        (_, err) => reject(err),
      );
    });
  });
}

// 批量插入干扰项
export function insertDistractor(list) {
  //console.log(list);
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        for (const item of list) {
          tx.executeSql(
            `INSERT INTO distractors 
             (_id, word_id, distractor_id, type) 
             VALUES (?, ?, ?, ?);`,
            [item._id, item.word_id, item.distractor_id, item.type],
            null,
            (_, err) => {
              console.error('插入失败:', item, err);
              reject(err);
            },
          );
        }
      },
      err => {
        console.error('事务失败:', err);
        reject(err);
      },
      () => {
        console.log('✅ 全部 distractors 插入成功');
        resolve();
      },
    );
  });
}

// 获取本地版本号
export async function getLocalDistractorVersion() {
  return await AsyncStorage.getItem('distractor_version');
}

// 保存本地版本号
export async function setLocalDistractorVersion(version) {
  await AsyncStorage.setItem('distractor_version', String(version));
}

export function getDistractorsByWordId(wordId) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT distractor_id, type FROM distractors WHERE word_id = ?`,
        [wordId],
        (_, { rows }) => {
          const list = [];
          for (let i = 0; i < rows.length; i++) {
            list.push(rows.item(i));
          }
          resolve(list);
        },
        reject,
      );
    });
  });
}
