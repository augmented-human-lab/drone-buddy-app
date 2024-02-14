import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/components/home/Home.tsx';
import SettingsPage from './src/components/settings/Settings.tsx';
import {Button, Image, TouchableOpacity} from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

// Define a custom theme to use colors from the logo
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF', // Vibrant blue for primary elements
    background: '#E6F0FA', // Light blue for general backgrounds
    card: '#FFFFFF', // White for card backgrounds
    text: '#000000', // Black for text on light backgrounds
    border: '#003366', // Dark blue for borders and outlines
    notification: '#FF9500', // Orange for notifications and CTAs
    success: '#4CD964', // Green for success states
    error: '#FF3B30', // Red for error messages
  },
};

const AppNavigator = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1c2e49', // Vibrant blue from the logo for the header background
          },
          headerTintColor: '#FFFFFF', // White for the header text and icons for contrast
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={({navigation}) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image
                  source={require('./src/assets/settings.png')} // Replace with your settings icon
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
