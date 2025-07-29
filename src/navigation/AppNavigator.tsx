import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {useAppSelector} from '@store/hooks';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingScreen from '@screens/auth/OnboardingScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const {isAuthenticated, isFirstLaunch} = useAppSelector(state => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {isFirstLaunch ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : !isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;