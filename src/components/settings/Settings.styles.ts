import {StyleSheet} from 'react-native';

export default StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000', // Example background color
  },
  title: {
    fontSize: 24,
    color: '#fff', // Example text color
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#fff', // Example text color
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    color: '#fff', // Example input text color
    backgroundColor: '#333', // Example input background color
  },
});
