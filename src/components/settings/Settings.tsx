import {NavigationProp} from '@react-navigation/native';
import {State} from 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../../AppNavigator.tsx';
import styles from './Settings.styles'; // Import styles with TypeScript

interface Props {
  navigation: NavigationProp<RootStackParamList, 'Settings'>;
}

interface State {
  ipAddress: string;
}

class SettingsPage extends Component<Props, State> {
  state: State = {
    ipAddress: '',
  };

  handleSave = () => {
    // Pass the IP address back to the Home screen
    this.props.navigation.navigate('Home', {ipAddress: this.state.ipAddress});
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter IP Address"
          value={this.state.ipAddress}
          onChangeText={ipAddress => this.setState({ipAddress})}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleSave}>
          <Text style={styles.text}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


export default SettingsPage;
