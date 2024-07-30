import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

const GifOrButtonComponent = ({isListening, start_button_text}) => {
  console.log('isListening', isListening);
  console.log('start', start_button_text);
  return (
    <View style={styles.container}>
      {isListening ? (
        <LottieView
          source={require('../../assets/animations/animation.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      ) : (
        <LinearGradient
          colors={['#5269fc', '#f50cf8']}
          style={styles.startButton}
          start={{x: 0, y: 0.5}} // Start from the left center
          end={{x: 1, y: 0.5}} // End at the right center
        >
          <Text style={styles.startButtonText}>{start_button_text}</Text>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    borderRadius: 150,
    width: '80%', // 80% of the parent's width
    aspectRatio: 1, // Keep the aspect ratio 1:1 to make it a circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  animation: {
    width: '80%', // 80% of the parent's width
    aspectRatio: 1, // Keep the aspect ratio 1:1
  },
});

export default GifOrButtonComponent;
