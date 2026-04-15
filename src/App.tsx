import { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider, AuthContext } from './logic/contexts/AuthContext';

import { bootstrapApp } from './logic/services/appBootstrapService';

import RootNavigator from './presentation/navigations/RootNavigator';

import { CustomAlertProvider } from './presentation/components/system/Alert/CustomAlertProvider';

export default function App() {
  return (
    <CustomAlertProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="dark-content"
          />
          <AppInner />
        </NavigationContainer>
      </AuthProvider>
    </CustomAlertProvider>
  );
}

function AppInner() {
  const { authFetch } = useContext(AuthContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await bootstrapApp(authFetch);
        console.log('✅ 初始化完成');
        setReady(true);
      } catch (err) {
        console.log('初始化失败', err);
      }
    }

    init();
  }, []);

  if (!ready) {
    return null; // TODO：改成加载页面
  }

  return <RootNavigator />;
}
