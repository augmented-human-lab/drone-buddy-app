import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 40,
  },
  circleButton: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  startButton: {
    borderRadius: 150, // Increased border radius for a bigger circle
    paddingVertical: 100, // Increased vertical padding for a bigger circle
    paddingHorizontal: 100, // Increased horizontal padding for a bigger circle
    marginVertical: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  voiceIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  helloText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  flexibleSpace: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
  },
  sendButton: {
    padding: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  mainButtonContainer: {},
  animation: {
    width: 500, // Adjust the width to make the animation larger
    height: 500, // Adjust the height to make the animation larger
  },
});
