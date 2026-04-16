import { useState } from 'react';
import { View, TextInput, Text } from 'react-native';

import { useAuth } from '../../../logic/hooks/auth/useAuth';

import { useCustomAlert } from '../../components/system/Alert/useCustomAlert';

import { CommonHeader } from '../../components/ui/Header';
import { Page } from '../../components/ui/Page';
import { TextButton } from '../../components/ui/Button';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import backIcon from '../../../../assets/icon/back.png';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { handleLogin } = useAuth();
  const { showAlert } = useCustomAlert();

  const onLoginPress = () => {
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
    handleLogin({ phone, password });
  };

  return (
    <Page pageStyle={[atomStyles.paddingHorizontal16, atomStyles.gap16]}>
      <CommonHeader
        title={'登录'}
        leftImageSource={backIcon}
        leftImageStyle={[generalStyles.mediumIcon, atomStyles.top1]}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={[atomStyles.gap16, atomStyles.paddingTop10]}>
        <TextInput
          placeholder="请输入手机号"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
          style={styles.textInput}
        />
        <TextInput
          placeholder="请输入8-16位字母加数字密码"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          style={styles.textInput}
        />
        {/* TODO：改成跳转页面 */}
        <Text style={styles.forgetPasswordText}>忘记密码</Text>
        <TextButton
          title={'登录'}
          onPress={onLoginPress}
          buttonStyle={styles.loginButton}
          textStyle={styles.loginText}
        />
      </View>
    </Page>
  );
}
