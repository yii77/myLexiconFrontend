import db from '../local/connection';
import { DEFAULT_SETTINGS } from '../constants/defaultSettings';

// 初始化（只插入没有的 key）
export async function initializeUserSettings() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT key FROM user_settings`,
          [],
          (_, result) => {
            const rows = [];
            for (let i = 0; i < result.rows.length; i++) {
              rows.push(result.rows.item(i));
            }

            const existingKeys = rows.map(r => r.key);

            Object.keys(DEFAULT_SETTINGS).forEach(key => {
              if (!existingKeys.includes(key)) {
                tx.executeSql(
                  `INSERT INTO user_settings (key, value) VALUES (?, ?)`,
                  [key, JSON.stringify(DEFAULT_SETTINGS[key])],
                );
              }
            });

            resolve();
          },
          (_, err) => {
            reject(err);
          },
        );
      },
      err => {
        reject(err);
      },
    );
  });
}

// 保存设置
export function setUserSetting(key, value) {
  return new Promise((resolve, reject) => {
    if (!db) {
      const err = new Error('数据库未初始化：db 为 undefined');
      reject(err);
      return;
    }

    try {
      db.transaction(
        tx => {
          tx.executeSql(
            `INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)`,
            [key, JSON.stringify(value)],
            (_tx, res) => {
              resolve(res);
            },
            (_tx, err) => {
              reject(err);
            },
          );
        },
        txErr => {
          reject(txErr);
        },
      );
    } catch (e) {
      reject(e);
    }
  });
}

// 读取单个设置
export function getUserSetting(key) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT value FROM user_settings WHERE key = ?',
        [key],
        (_, { rows }) => {
          try {
            if (rows.length > 0) {
              resolve(JSON.parse(rows.item(0).value));
            } else {
              resolve(DEFAULT_SETTINGS[key] || null);
            }
          } catch (e) {
            resolve(DEFAULT_SETTINGS[key] || null);
          }
        },
        (_, err) => reject(err),
      );
    });
  });
}

// 获取全部设置
export async function getAllUserSettings() {
  const result = {};

  for (let key in DEFAULT_SETTINGS) {
    result[key] = await getUserSetting(key);
  }

  return result;
}

// 恢复单项默认值
export async function resetUserSetting(key) {
  await setUserSetting(key, DEFAULT_SETTINGS[key]);
}

// 恢复全部默认设置
export async function resetAllUserSettings() {
  const tasks = Object.keys(DEFAULT_SETTINGS).map(key =>
    setUserSetting(key, DEFAULT_SETTINGS[key]),
  );
  await Promise.all(tasks);
}
