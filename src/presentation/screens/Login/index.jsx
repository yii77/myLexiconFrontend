import { useState } from 'react';
import { View, TextInput, Text } from 'react-native';

import { useAuth } from '../../../logic/hooks/auth/useAuth';

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
          onPress={handleLogin}
          buttonStyle={styles.loginButton}
          textStyle={styles.loginText}
        />
      </View>
    </Page>
  );
}
