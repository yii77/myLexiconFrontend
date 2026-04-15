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
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        list.forEach(item => {
          tx.executeSql(
            `INSERT INTO distractors (word_id, distractor_id) VALUES (?, ?);`,
            [item.word_id, item.distractor_id],
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

// 获取本地版本号
export async function getLocalDistractorVersion() {
  return await AsyncStorage.getItem('distractor_version');
}

// 保存本地版本号
export async function setLocalDistractorVersion(version) {
  await AsyncStorage.setItem('distractor_version', String(version));
}
