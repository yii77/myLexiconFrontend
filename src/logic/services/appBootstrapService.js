import { initDB } from '../../data/local/initDB';
import { initializeUserSettings } from '../../data/dao/userSettingsDao';
import { syncAll } from './syncWordDataService';

export async function bootstrapApp(authFetch) {
  await initDB();
  await initializeUserSettings();
  await syncAll(authFetch);
}
