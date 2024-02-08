import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/components/home/Home.tsx';
import SettingsPage from './src/components/settings/Settings.tsx';

export type RootStackParamList = {
  Home: undefined; // No parameters expected to pass to Home
  Settings: undefined; // No parameters expected to pass to Settings
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
