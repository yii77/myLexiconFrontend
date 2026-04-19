import { API_ENDPOINTS } from '../../config/api';

// =======================
//     distractor 部分
// =======================

// 获取服务器 version
export async function fetchDistractorVersion() {
  try {
    const url = `${API_ENDPOINTS.getDistractor}?mode=version`;
    const res = await fetch(url);
    const json = await res.json();

    return {
      ok: res.ok,
      version: json.version ?? null,
    };
  } catch (err) {
    console.log('fetchDistractorVersion error:', err);
    return { ok: false, version: null };
  }
}

// 获取 distractor 列表数据
export async function fetchDistractor() {
  try {
    const url = `${API_ENDPOINTS.getDistractor}?mode=distractor`;
    const res = await fetch(url);
    const json = await res.json();

    return {
      ok: res.ok,
      list: json.data ?? [],
    };
  } catch (err) {
    console.log('fetchDistractor error:', err);
    return { ok: false, list: [] };
  }
}

// =======================
//        words 部分
// =======================

// 获取 words 版本号
export async function fetchWordVersion() {
  try {
    const url = `${API_ENDPOINTS.getWord}?mode=version`;
    const res = await fetch(url);
    const json = await res.json();

    return {
      ok: res.ok,
      version: json.version ?? null,
    };
  } catch (err) {
    console.log('fetchWordVersion error:', err);
    return { ok: false, version: null };
  }
}

// 获取 words 列表
export async function fetchWord() {
  try {
    const url = `${API_ENDPOINTS.getWord}?mode=words`;
    const res = await fetch(url);
    const json = await res.json();

    return {
      ok: res.ok,
      list: json.data ?? [],
    };
  } catch (err) {
    console.log('fetchWord error:', err);
    return { ok: false, list: [] };
  }
}
