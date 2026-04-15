export const createUserSettingsTable = tx => {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS user_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
};
