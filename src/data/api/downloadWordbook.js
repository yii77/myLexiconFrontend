import { API_ENDPOINTS } from '../../config/api';

export async function downloadWordbook(authFetch, bookId) {
  try {
    const res = await authFetch(`${API_ENDPOINTS.downloadWordbook}/${bookId}`);

    const result = await res.json();

    return { ok: res.ok, result };
  } catch (err) {
    console.log('downloadWordbook error:', err);
    return { ok: false, result: null };
  }
}
