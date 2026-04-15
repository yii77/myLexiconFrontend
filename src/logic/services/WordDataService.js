import {
  getLocalWordsVersion,
  setLocalWordsVersion,
  clearWordsTable,
  insertWord,
} from '../../data/dao/wordDao';

import {
  getLocalDistractorVersion,
  setLocalDistractorVersion,
  clearDistractorTable,
  insertDistractor,
} from '../../data/dao/distractorDao';

import {
  fetchDistractorVersion,
  fetchDistractor,
  fetchWordVersion,
  fetchWord,
} from '../../data/api/fetchWordData';

export async function syncDistractor(authFetch) {
  const localVersion = await getLocalDistractorVersion();

  const serverRes = await fetchDistractorVersion(authFetch);
  if (!serverRes.ok) return { ok: false, updated: false };

  const serverVersion = String(serverRes.version);

  if (localVersion === serverVersion) {
    console.log('📌 distractor 版本一致，无需更新');
    return { ok: true, updated: false };
  }

  const dataRes = await fetchDistractor(authFetch);
  if (!dataRes.ok) return { ok: false, updated: false };

  await clearDistractorTable();
  await insertDistractor(dataRes.list);
  await setLocalDistractorVersion(serverVersion);
  console.log('🎉 distractor 同步完成（已更新）');
  return { ok: true, updated: true };
}

export async function syncWord(authFetch) {
  const localVersion = await getLocalWordsVersion();

  const serverRes = await fetchWordVersion(authFetch);
  if (!serverRes.ok) return { ok: false, updated: false };

  const serverVersion = String(serverRes.version);

  if (localVersion === serverVersion) {
    console.log('📌 words 版本一致，无需更新');
    return { ok: true, updated: false };
  }

  const dataRes = await fetchWord(authFetch);
  if (!dataRes.ok) return { ok: false, updated: false };

  await clearWordsTable();
  await insertWord(dataRes.list);
  await setLocalWordsVersion(serverVersion);
  console.log('🎉 words 同步完成（已更新）');
  return { ok: true, updated: true };
}

export async function syncAll(authFetch) {
  await Promise.all([syncDistractor(authFetch), syncWord(authFetch)]);
}
