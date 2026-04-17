import { useContext } from 'react';

import { loginByPhone } from '../../../data/api/loginByPhone';

import { AuthContext } from '../../contexts/AuthContext';

import { useCustomAlert } from '../../../presentation/components/system/Alert/useCustomAlert';

export function useAuth() {
  const { login } = useContext(AuthContext);
  const { showAlert } = useCustomAlert();
  const handleLogin = async ({ phone, password }) => {
    if (!phone) {
      showAlert({
        title: '提示',
        content: '请输入电话',
        buttons: [{ text: '确定' }],
        type: 'center',
      });
      return;
    }
    if (!password) {
      showAlert({
        title: '提示',
        content: '请输入密码',
        buttons: [{ text: '确定' }],
        type: 'center',
      });
      return;
    }
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
