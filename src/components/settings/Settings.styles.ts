import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF', // a light background color that matches the logo theme
  },
  input: {
    height: 50, // increased height for better touch area
    marginVertical: 20,
    marginHorizontal: 40,
    borderWidth: 1,
    borderColor: '#1c2e49', // border color to match the logo's blue
    borderRadius: 10, // rounded corners for the input field
    padding: 10,
    backgroundColor: '#FFFFFF', // white background for the input field
    color: '#000000', // black color for the input text for readability
    fontSize: 18, // slightly larger font size for accessibility
    width: '75%', // Width set to 95% of the parent container

  },
  button: {
    elevation: 2, // for Android shadow
    backgroundColor: '#1c2e49', // primary color from your logo
    borderRadius: 20, // rounded corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF', // text color that contrasts with the button color
    fontWeight: '600',
    fontSize: 16,
  },
});
