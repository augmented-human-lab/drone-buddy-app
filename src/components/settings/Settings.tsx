import {NavigationProp} from '@react-navigation/native';
import React, {Component} from 'react';
import {Button, Text, TextInput, View, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Tts from 'react-native-tts';
import Slider from '@react-native-community/slider';
import styles from './Settings.styles';

interface Props {
  navigation: NavigationProp<any, 'Settings'>;
}

interface State {
  ipAddress: string;
  selectedVoice: string;
  voices: Array<{id: string; language: string; name: string}>;
  pitch: number;
  rate: number;
  loadingVoices: boolean;
}

class SettingsPage extends Component<Props, State> {
  state: State = {
    ipAddress: '172.20.10.3',
    selectedVoice: 'en-US',
    voices: [],
    pitch: 1,
    rate: 0.5,
    loadingVoices: true, // Track loading state for voices
  };

  componentDidMount() {
    // Fetch available voices and populate the Picker
    Tts.voices()
      .then(voices => {
        const filteredVoices = voices.filter(voice => voice.language); // Ensure valid voices
        this.setState({
          voices: filteredVoices,
          selectedVoice: filteredVoices[0]?.id || 'en-US', // Set the first voice as default
          loadingVoices: false,
        });
      })
      .catch(error => {
        console.error('Error fetching voices:', error);
        this.setState({loadingVoices: false}); // Stop loading if there's an error
      });
  }

  handleSave = () => {
    this.props.navigation.navigate('Home', {
      ipAddress: this.state.ipAddress,
      voice: this.state.selectedVoice,
      pitch: this.state.pitch,
      rate: this.state.rate,
    });
    console.log('Settings saved', this.state);
  };

  render() {
    const {ipAddress, voices, selectedVoice, pitch, rate, loadingVoices} =
      this.state;
    // for voice related settings and further information https://www.npmjs.com/package/react-native-tts
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Server Connection</Text>
        <Text style={styles.subText}>
          Set the IP address of the server you want to connect to
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter IP Address"
          placeholderTextColor="#aaa"
          value={ipAddress}
          onChangeText={ipAddress => this.setState({ipAddress})}
        />

        {/* Voice Selection */}
        <Text style={styles.title}>Voice Settings</Text>

        <View style={{width: '100%', marginBottom: 20}}>
          <Text style={styles.subText}>Select Voice:</Text>
          {loadingVoices ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: '#333',
                overflow: 'hidden',
                width: '100%',
              }}>
              <Picker
                selectedValue={selectedVoice}
                onValueChange={itemValue =>
                  this.setState({selectedVoice: itemValue})
                }
                style={{color: '#fff', height: 50}}
                dropdownIconColor="#fff">
                {voices.map(voice => (
                  <Picker.Item
                    key={voice.id}
                    label={`${voice.name} (${voice.language})`}
                    value={voice.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Rate Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.subText}>Speech Rate: {this.state.rate}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={this.state.rate}
            onValueChange={value => this.setState({rate: value})}
            step={0.01}
            thumbTintColor={styles.sliderThumb.backgroundColor}
            minimumTrackTintColor={styles.sliderSelectedTrack.backgroundColor}
            maximumTrackTintColor={styles.sliderTrack.backgroundColor}
          />
        </View>
        {/* Pitch Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.subText}>Pitch: {this.state.pitch}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={2}
            value={this.state.pitch}
            onValueChange={value => this.setState({pitch: value})}
            step={0.1}
            thumbTintColor={styles.sliderThumb.backgroundColor}
            minimumTrackTintColor={styles.sliderSelectedTrack.backgroundColor}
            maximumTrackTintColor={styles.sliderTrack.backgroundColor}
          />
        </View>
        <Button title="Save" onPress={this.handleSave} />
      </View>
    );
  }
}

export default SettingsPage;
