import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAccessToken } from '../../data/api/getAccessToken';

import { API_ENDPOINTS } from '../../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        let refreshToken = await AsyncStorage.getItem('refreshToken');

        // 1 无授权，未登录
        if (!refreshToken) {
          await AsyncStorage.clear();
          return;
        }

        // 2 有授权
        const res = await fetch(API_ENDPOINTS.check, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        // 2.1 授权失效
        if (res.status === 401) {
          await AsyncStorage.clear();
          return;
        }

        // 2.2 授权有效，如果临期→续期，生成 accessToken
        const newRefreshToken = res.headers.get('x-refresh-token');
        if (newRefreshToken) {
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          refreshToken = newRefreshToken;
        }

        const newAccessToken = await getAccessToken(refreshToken);
        setAccessToken(newAccessToken);

        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log('Auth 初始化失败', err);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 登录
  const login = useCallback(async (userData, refreshToken) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('refreshToken', refreshToken);

    setUser(userData);

    const newAccessToken = await getAccessToken(refreshToken);
    setAccessToken(newAccessToken);
  }, []);

  // 登出
  const logout = useCallback(async () => {
    setUser(null);
    setAccessToken(null);
    await AsyncStorage.clear();
  }, []);

  // 刷新 accessToken
  const renewAccessToken = useCallback(async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!refreshToken) return null;

      const newAccessToken = await getAccessToken(refreshToken);

      setAccessToken(newAccessToken);
    } catch (err) {
      console.log('刷新 accessToken 失败', err);
    }
  }, []);

  // 自动带 accessToken 的 fetch
  const authFetch = useCallback(
    async (url, options = {}) => {
      let token = accessToken;

      const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let res = await fetch(url, {
        ...options,
        headers,
      });

      // token 过期
      if (res.status === 401 && token) {
        const newToken = await renewAccessToken();

        if (!newToken) {
          await logout();
          return res;
        }

        const retryHeaders = {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };

        res = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }

      return res;
    },
    [accessToken],
  );

  const value = useMemo(
    () => ({
      user,
      accessToken,
      authLoading,
      login,
      logout,
      renewAccessToken,
      authFetch,
    }),
    [user, accessToken, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
