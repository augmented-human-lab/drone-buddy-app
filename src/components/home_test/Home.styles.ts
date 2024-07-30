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
  buttonSettings: {
    backgroundColor: '#3f434a', // Adjusted for better readability
    padding: 20,
    borderRadius: 10,
    margin: 10,
    minWidth: 120, // Wider buttons for easier interaction
  },
  buttonSpeak: {
    backgroundColor: '#2e78f0', // Adjusted for better readability
    padding: 20,
    borderRadius: 10,
    margin: 10,
    minWidth: 240, // Wider buttons for easier interaction
    minHeight: 240, // Wider buttons for easier interaction
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
   textInput: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    sendButton: {
      backgroundColor: 'blue',
      padding: 8,
      marginLeft: 10,
      borderRadius: 5,
    },
     chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
      },
      textInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
      },
      sendButton: {
        backgroundColor: 'blue',
        padding: 8,
        marginLeft: 10,
        borderRadius: 5,
      },

});
