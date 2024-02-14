import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a loading process, e.g., connecting to the drone
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Wait for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Connecting to your drone...</Text>
      </View>
    );
  }

  // Once loading is complete, return null or navigate to another screen
  // You can use navigation.navigate('YourNextScreen') if using React Navigation
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});

export default LoadingScreen;
