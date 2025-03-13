import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000', // Background color for the settings page
  },
  title: {
    fontSize: 24,
    color: '#fff', // Title text color
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#fff', // Subtitle text color
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    color: '#fff', // Input text color
    backgroundColor: '#333', // Input background color
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 20,
  },
  slider: {
    height: 40, // Adjust slider track height
  },
  sliderThumb: {
    height: 20, // Thumb size
    width: 20,
    backgroundColor: '#fff', // Thumb color
    borderRadius: 10, // Make it circular
    shadowColor: '#000', // Add slight shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sliderTrack: {
    height: 4, // Track height
    borderRadius: 2,
    backgroundColor: '#666', // Unselected track color
  },
  sliderSelectedTrack: {
    backgroundColor: '#fff', // Selected track color
  },
});
