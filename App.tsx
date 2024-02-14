import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import AppNavigator from './AppNavigator'; // Adjust the import path as needed

interface AppState {
  isLoading: boolean;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true, // Start with loading screen
    };
  }

  componentDidMount() {
    // Simulate loading process, for example, fetching data or initializing services
    setTimeout(() => {
      this.setState({isLoading: false}); // Hide loading screen
    }, 3000); // Adjust time as needed
  }

  render() {
    if (this.state.isLoading) {
      // Display loading indicator while loading
      return (
        <View style={styles.loadingContainer}>
          <Image
            source={require('./src/assets/dronebuddy_logo_transparent.png')} // Update the path as necessary
            style={styles.logo}
          />
          <ActivityIndicator size="large" />
        </View>
      );
    }

    // Once loading is finished, render the main navigator
    return <AppNavigator />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', // Choose a background color that fits your app
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150, // Set your desired size
    height: 150,
    marginBottom: 20, // Adjust the space between the logo and the loader
  },
});

export default App;
