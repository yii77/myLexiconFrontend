import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PracticeWordbookProvider } from '../../logic/contexts/PracticeWordbookContext';
import { PracticeConfigProvider } from '../../logic/contexts/PracticeConfigContext';
import { PracticeMaterialQueueProvider } from '../../logic/contexts/PracticeMaterialQueueContext';

import PracticeStack from './stacks/PracticeStack';
import BookStack from './stacks/BookStack';
import ProFileStack from './stacks/ProFileStack';

export default function TabNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <PracticeWordbookProvider>
      <PracticeConfigProvider>
        <PracticeMaterialQueueProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="PracticeStack"
              component={PracticeStack}
              options={{
                animation: 'slide_from_left',
              }}
            />
            <Stack.Screen
              name="BookStack"
              component={BookStack}
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="ProFileStack"
              component={ProFileStack}
              options={{
                animation: 'fade',
              }}
            />
          </Stack.Navigator>
        </PracticeMaterialQueueProvider>
      </PracticeConfigProvider>
    </PracticeWordbookProvider>
  );
}
