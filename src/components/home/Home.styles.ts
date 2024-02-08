import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Lighter background for better contrast
  },
  buttonStart: {
    backgroundColor: '#4CAF50', // Adjusted for better readability
    padding: 20,
    borderRadius: 10,
    margin: 10,
    minWidth: 120, // Wider buttons for easier interaction
  },
  buttonEnd: {
    backgroundColor: '#F44336', // Adjusted for better readability
    padding: 20,
    borderRadius: 10,
    margin: 10,
    minWidth: 120, // Wider buttons for easier interaction
  },
  buttonOther: {
    backgroundColor: '#04146a', // Adjusted for better readability
    padding: 20,
    borderRadius: 10,
    margin: 10,
    minWidth: 120, // Wider buttons for easier interaction
  },
  buttonOther2: {
    backgroundColor: '#440688', // Adjusted for better readability
    padding: 20,
    borderRadius: 10,
    margin: 10,
    minWidth: 120, // Wider buttons for easier interaction
  },
  buttonQuest: {
    backgroundColor: '#c5a005', // Adjusted for better readability
    padding: 20,
    borderRadius: 10,
    margin: 10,
    minWidth: 120, // Wider buttons for easier interaction
  },
  buttonText: {
    fontSize: 20, // Adjusted for dynamic text sizing
    color: 'white',
    textAlign: 'center',
  },
  transcribedText: {
    marginTop: 20,
    fontSize: 16, // Adjusted for readability
    color: '#333333', // Higher contrast color
  },
});
