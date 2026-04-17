import { useContext } from 'react';

import { loginByPhone } from '../../../data/api/loginByPhone';

import { AuthContext } from '../../contexts/AuthContext';

import { useCustomAlert } from '../../../presentation/components/system/Alert/useCustomAlert';

export function useAuth() {
  const { login } = useContext(AuthContext);
  const { showAlert } = useCustomAlert();
  const handleLogin = async ({ phone, password }) => {
    try {
      const { ok, result } = await loginByPhone(phone, password);

      if (ok && result.success) {
        await login(
          { userId: result.userId, username: result.username },
          result.refreshToken,
        );
      } else {
        showAlert({
          title: '登录失败',
          content: result.message,
          buttons: [{ text: '确定' }],
          type: 'center',
        });
      }
    } catch (error) {
      console.log(error);
      showAlert({
        title: '错误',
        content: '网络错误，请稍后再试',
        buttons: [{ text: '确定' }],
        type: 'center',
      });
    }
  };

  return { handleLogin };
}
