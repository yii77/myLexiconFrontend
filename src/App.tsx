import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './logic/contexts/AuthContext';

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
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </CustomAlertProvider>
  );
}
