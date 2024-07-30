import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
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
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
                <Image
                  source={{ uri: 'https://img.icons8.com/ios-glyphs/30/ffffff/settings.png' }}
                  style={styles.settingsIcon}
                />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <View style={styles.homeContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/ios-glyphs/30/ffffff/home.png' }}
                    style={styles.homeIcon}
                  />
                </TouchableOpacity>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#000000', // Background color of the header
            },
            headerTintColor: '#ffffff', // Color of the header text
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsPage}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
                <Image
                  source={{ uri: 'https://img.icons8.com/ios-glyphs/30/ffffff/settings.png' }}
                  style={styles.settingsIcon}
                />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <View style={styles.homeContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeButton}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/ios-glyphs/30/ffffff/home.png' }}
                    style={styles.homeIcon}
                  />
                </TouchableOpacity>
              </View>
            ),
            headerStyle: {
              backgroundColor: '#000000', // Background color of the header
            },
            headerTintColor: '#ffffff', // Color of the header text
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    marginRight: 15,
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },
  homeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeButton: {
    marginLeft: 15,
  },
  homeIcon: {
    width: 30,
    height: 30,
    marginRight: 30, // Adjust the space between the icon and text
  },
  homeText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20, // Adjust the space between the icon and text
  },
});

export default AppNavigator;
