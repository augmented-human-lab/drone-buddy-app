import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F0FA', // Lighter background for better contrast
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
  circleButton: {
    width: 100, // Diameter of the circle
    height: 100, // Diameter of the circle
    borderRadius: 50, // Half the diameter to make it a perfect circle
    backgroundColor: '#1c2e49', // White background for the circle
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    margin: 10, // Add margin to create space around the button

    // Add shadow or elevation if you want to lift the button off the page
    elevation: 3, // for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  circleButtonImage: {
    width: 40, // Set the width of the image
    height: 40, // Set the height of the image
    resizeMode: 'contain', // Ensure the image scales correctly within the button
  },
  doubleTapText: {
    fontSize: 16, // Choose an appropriate font size
    color: '#333', // You might choose a color that fits your app theme
    position: 'absolute', // Position it over the container without affecting layout
    bottom: 30, // Distance from the bottom
    alignSelf: 'center', // Center it horizontally
  },

  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },

  listeningText: {
    fontSize: 18,
    color: '#FFFFFF', // White color for better visibility
    marginBottom: 20, // Space between text and activity indicator
  },
  recognizedTextContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background with a bit of transparency
    marginTop: 20,
    alignSelf: 'center',
  },
  recognizedText: {
    fontSize: 18,
    color: '#007AFF', // Blue color for the text that matches your button
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listeningInstructionText: {
    fontSize: 16,
    color: '#333333', // Dark color for contrast
    fontStyle: 'italic',
    marginTop: 30, // Or adjust the margin as needed
    textAlign: 'center',
  },
});
