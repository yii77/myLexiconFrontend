import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/Welcome/index';
import LoginScreen from '../screens/Login/index';

export default function AuthNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}
