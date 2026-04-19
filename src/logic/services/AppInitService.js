import { initDB } from '../../data/local/initDB';

import { initializeUserSettings } from '../../data/dao/userSettingsDao';

import { syncAll } from './WordDataService';

export async function initApp() {
  await initDB();
  await initializeUserSettings();
  await syncAll();
}
