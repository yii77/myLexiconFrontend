import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './logic/contexts/AuthContext';
import { FontProvider } from './logic/contexts/FontContext';

import { initApp } from './logic/services/AppInitService';

import RootNavigator from './presentation/navigations/RootNavigator';

import { CustomAlertProvider } from './presentation/components/system/Alert/CustomAlertProvider';
import { ToastProvider } from './presentation/components/system/Toast/ToastProvider';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initApp();
        console.log('✅ 初始化完成');
        setReady(true);
      } catch (err) {
        console.log('初始化失败', err);
      }
    };

    init();
  }, []);

  return (
    <ToastProvider>
      <CustomAlertProvider>
        <FontProvider>
          <NavigationContainer>
            <AuthProvider>
              <StatusBar
                backgroundColor="transparent"
                translucent
                barStyle="dark-content"
              />
              <RootNavigator />
            </AuthProvider>
          </NavigationContainer>
        </FontProvider>
      </CustomAlertProvider>
    </ToastProvider>
  );
}
