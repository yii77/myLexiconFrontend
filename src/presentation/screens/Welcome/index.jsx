import { useState } from 'react';
import { View, Text, Image } from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import { useCustomAlert } from '../../components/system/Alert/useCustomAlert';

import { TextButton } from '../../components/ui/Button';
import { Page } from '../../components/ui/Page';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import appLogo from '../../../../assets/logo/app.png';

export default function WelcomeScreen({ navigation }) {
  const [isAgreed, setIsAgreed] = useState(false);

  const { showAlert, hideAlert } = useCustomAlert();

  const navigateToLogin = () => {
    if (!isAgreed) {
      showAlert({
        title: (
          <Text style={[generalStyles.textAlertTitle, atomStyles.textCenter]}>
            服务协议及隐私保护
          </Text>
        ),
        content: (
          <Text style={generalStyles.textAlertContent}>
            我已阅读并同意
            <Text style={generalStyles.textLink}>《服务协议》</Text>和
            <Text style={generalStyles.textLink}>《隐私条款》</Text>
          </Text>
        ),
        buttons: [
          {
            text: '不同意',
            onPress: hideAlert,
            alertButtonTextStyle: styles.modalFirstButtonText,
          },
          {
            text: '同意',
            onPress: () => {
              hideAlert();
              navigation.navigate('LoginScreen');
            },
            alertButtonTextStyle: styles.modalSecondButtonText,
          },
        ],
        type: 'center',
      });

      return;
    }
    navigation.navigate('LoginScreen');
  };

  return (
    <Page pageStyle={[styles.container]}>
      <AppBrandHeader />
      <ButtonRows onLogin={navigateToLogin} onRegister={navigateToLogin} />
      <Agreement handleAgree={setIsAgreed} isAgreed={isAgreed} />
    </Page>
  );
}

const AppBrandHeader = () => {
  return (
    <View style={styles.appBrandHeaderContainer}>
      <Image source={appLogo} style={styles.appLogo} />
      <Text style={styles.appNameText}>我的词书</Text>
      <Text style={styles.welcomeText}>你的词书，一切由你定义</Text>
    </View>
  );
};

const ButtonRows = ({ onLogin, onRegister }) => {
  return (
    <View style={styles.buttonRowsContainer}>
      <TextButton
        title={'登录'}
        onPress={onLogin}
        buttonStyle={[styles.baseButton, styles.loginButton]}
        textStyle={[styles.baseButtonText, styles.loginButtonText]}
      />
      <TextButton
        title={'注册'}
        onPress={onRegister}
        buttonStyle={[styles.baseButton, styles.registerButton]}
        textStyle={[styles.baseButtonText, styles.registerButtonText]}
      />
    </View>
  );
};

const Agreement = ({ handleAgree, isAgreed }) => {
  return (
    <View style={styles.agreementContainer}>
      <CheckBox
        value={isAgreed}
        onValueChange={newValue => handleAgree(newValue)}
        style={styles.checkBox}
        tintColors={styles.checkBoxTintColors}
      />
      <Text>
        我已阅读并同意{' '}
        <Text
          style={generalStyles.textLink}
          onPress={() => navigation.navigate('PolicyScreen')}
        >
          {' '}
          《服务协议》{' '}
        </Text>
        <Text
          style={generalStyles.textLink}
          onPress={() => navigation.navigate('PolicyScreen')}
        >
          {' '}
          《隐私条款》{' '}
        </Text>
      </Text>
    </View>
  );
};
