import { API_ENDPOINTS } from '../../config/api';

export const getAccessToken = async refreshToken => {
  try {
    const res = await fetch(API_ENDPOINTS.getAccessToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    // refreshToken 失效
    if (!res.ok) return null;

    // refreshToken 有效，返回accessToken
    const data = await res.json();
    return data.accessToken;
  } catch (err) {
    return null;
  }
};
