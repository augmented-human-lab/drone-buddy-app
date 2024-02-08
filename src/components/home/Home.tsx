import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import APIService from '../../services/APIService.js';
import Tts from 'react-native-tts';
import {Tello} from '../../utils/tello/Tello.ts';

import styles from './Home.styles'; // Import styles with TypeScript

import {
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Logger} from '../../utils/Logger.ts';
import {io} from 'socket.io-client';
import {toggleWifi} from '../../utils/WifiManager.ts';
import {RootStackParamList} from '../../../AppNavigator.tsx';
import {NavigationProp, RouteProp} from '@react-navigation/native';

// type Props = {};
interface Props {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
}

type State = {
  recognized: string;
  isListening: boolean;
  isInAir: boolean;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isConnected: boolean;
  ipAddress?: string;
};

class Home extends Component<Props, State> {
  state = {
    recognized: '',
    isDroneInit: false,
    isConnected: false,
    pitch: '',
    error: '',
    end: '',
    started: '',
    isListening: false,
    isInAir: false,
    results: [],
    partialResults: [],
    ipAddress: this.props.route.params?.ipAddress,
  };
  doubleTapRef = React.createRef();

  drone: Tello | null = null;
  socket: any;

  SERVER_IP = '172.20.10.2'; // Example IP, replace with your server's IP
  SERVER_PORT = '65432'; // The port your Python script is listening on
  constructor(props: Props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

    this.socket = null;
  }

  componentDidUpdate(prevProps: any) {
    // Check if the Home component received new parameters
    if (
      this.props.route.params?.ipAddress !== prevProps.route.params?.ipAddress
    ) {
      this.setState({ipAddress: this.props.route.params?.ipAddress});
      // Optionally, perform other actions with the new IP address
    }
    this.SERVER_IP = this.state.ipAddress;
    if (
      !this.state.isConnected &&
      this.state.ipAddress &&
      this.state.ipAddress !== ''
    ) {
      this.connectToSocket();
    }
  }

  navigateToSettings = () => {
    console.log('navigating');
    this.props.navigation.navigate('Settings');
  };
  onSingleTap = (event: {nativeEvent: {state: number}}) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Logger.log_info('User Actions', 'MAIN', 'Single tapped');
      if (this.state.isListening) {
        this._stopRecognizing();
      }
    }
  };

  onDoubleTap = (event: {nativeEvent: {state: number}}) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Logger.log_info('User Actions', 'MAIN', 'Double tapped');
      if (!this.state.isListening) {
        this._startRecognizing();
      } else {
        this._stopRecognizing();
      }
    }
  };

  componentWillUnmount() {
    // destroy the voice recognition instance
    Voice.destroy().then(Voice.removeAllListeners);

    // Remove TTS event listeners
    Tts.removeEventListener('tts-start', event =>
      Logger.log_info(
        'Voice Recognition',
        'HOME',
        'TTS start listener removed',
        event,
      ),
    );
    Tts.removeEventListener('tts-finish', event =>
      Logger.log_info(
        'Voice Recognition',
        'HOME',
        'TTS finish listener removed',
        event,
      ),
    );
    Tts.removeEventListener('tts-cancel', event =>
      Logger.log_info(
        'Voice Recognition',
        'HOME',
        'TTS cancel listener removed',
        event,
      ),
    );
    Tts.removeEventListener('tts-error', event => console.error(event));

    if (this.socket) {
      this.socket.disconnect();
    }
  }

  componentDidMount() {
    this.requestMicrophonePermission();
    // Set up TTS event listeners
    Tts.addEventListener('tts-start', event =>
      Logger.log_info(
        'Voice Recognition',
        'HOME',
        'TTS start listener added',
        event,
      ),
    );
    Tts.addEventListener('tts-finish', event =>
      Logger.log_info(
        'Voice Recognition',
        'HOME',
        'TTS finish listener added',
        event,
      ),
    );
    Tts.addEventListener('tts-cancel', event =>
      Logger.log_info(
        'Voice Recognition',
        'HOME',
        'TTS cancel listener added',
        event,
      ),
    );
    Tts.addEventListener('tts-error', event => console.error(event));

    Tts.setDefaultLanguage('en-US');
    if (Platform.OS === 'ios') {
      Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');
      // Execute iOS specific code
    } else if (Platform.OS === 'android') {
      // Execute Android specific code
      Tts.setDefaultVoice('ur-PK-language');
    }
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(0.5);
  }

  connectToSocket() {
    this.socket = io(`http://${this.SERVER_IP}:${this.SERVER_PORT}`, {
      transports: ['websocket'], // Use WebSocket for transport
    });

    Logger.log_info(
      'WS',
      'Home',
      'Connecting to the web socket at ',
      `http://${this.SERVER_IP}:${this.SERVER_PORT}`,
    );
    this.socket.on('connect', () => {
      this.setState({isConnected: true});
      Logger.log_success(
        'WS',
        'Home',
        'Connected to the web socket at ',
        `http://${this.SERVER_IP}:${this.SERVER_PORT}`,
      );
    });

    this.socket.on('server_message', (msg: {data: any}) => {
      Logger.log_info('WS', 'Home', 'Message received from the socket :', msg);
      if (msg.data !== '') {
        this.speak(msg.data);
      }
    });

    this.socket.on('disconnect', () => {
      Logger.log_info(
        'WS',
        'Home',
        'Disconnected from the web socket at ',
        `http://${this.SERVER_IP}:${this.SERVER_PORT}`,
      );
      this.setState({isConnected: false});
    });
    this.socket.on('connect_error', error => {
      Logger.log_error(
        'WS',
        'Home',
        'Error connecting to the web socket at ',
        error,
      );
    });
  }

  sendMessage = (message: any, type: string) => {
    if (this.state.isConnected) {
      Logger.log_info('Web Socket', 'HOME', 'Message sending', message);
      this.socket.emit('message', {dataType: type, message: message});
    } else {
      Logger.log_info('Web Socket', 'HOME', 'Not connected to server', '');
    }
  };
  // request permission from the user to access the microphone
  // this method will execute everytime the app is opened
  // user will be prompted to allow microphone access if they havent already
  // if they have already allowed access, then nothing will happen
  async requestMicrophonePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Dronebuddy app needs access to your microphone ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Logger.log_info(
          'System Actions',
          'HOME',
          'Microphone Access Enabled',
          '',
        );
      } else {
        Logger.log_warning(
          'System Actions',
          'HOME',
          'Microphone Permission Denied',
          '',
        );
      }
    } catch (err) {
      console.warn(err);
      Logger.log_warning(
        'System Actions',
        'HOME',
        'Request Microphone Permission',
        err,
      );
    }
  }

  onSpeechStart = (e: any) => {
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Results', e);
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = (e: any) => {
    this.setState({
      end: '√',
    });
  };

  onSpeechError = (e: SpeechErrorEvent) => {
    Logger.log_error('Speech Recognition', 'MAIN', 'Error', e);

    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = (e: SpeechResultsEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Results', e);
    this.setState({
      results: e.value,
    });
    this.sendMessage(this.state.results[0], 'RECOGNITION');
  };

  onSpeechPartialResults = (e: SpeechResultsEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Partial Results', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = (e: any) => {
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      isListening: true,
      partialResults: [],
      end: '',
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      this.setState({
        isListening: false,
      });
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _droneTakeOff = () => {
    // this.drone?.send('takeoff');
    this.sendMessage('takeoff', 'CONTROL');
  };
  _droneLand = () => {
    // this.drone?.send('land');
    this.sendMessage('land', 'CONTROL');
  };
  _droneGetBattery = () => {
    // this.drone?.send('battery?');
    this.sendMessage('battery?', 'CONTROL');
  };

  speak = (text: string) => {
    Logger.log_info('VOICE', 'Home', 'Generating Voice', text);
    Tts.speak(text);
  };

  stop = () => {
    Tts.stop();
  };

  render() {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <TapGestureHandler
          ref={this.doubleTapRef}
          numberOfTaps={2}
          onHandlerStateChange={this.onDoubleTap}
          waitFor={this.doubleTapRef}>
          <TapGestureHandler
            onHandlerStateChange={this.onSingleTap}
            waitFor={this.doubleTapRef}>
            <View style={styles.container}>
              <TouchableHighlight
                style={styles.buttonStart}
                onPress={this._droneTakeOff}>
                <Text style={styles.buttonText}>Take-off</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.buttonEnd}
                onPress={this._droneLand}>
                <Text style={styles.buttonText}>Land</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.buttonQuest}
                onPress={this._droneGetBattery}>
                <Text style={styles.buttonText}>Battery</Text>
              </TouchableHighlight>
              <Text style={styles.transcribedText}>
                {this.state.results[0]}
              </Text>

              <TouchableHighlight
                style={styles.buttonQuest}
                onPress={this.navigateToSettings}>
                <Text style={styles.buttonText}>Go to settings</Text>
              </TouchableHighlight>
            </View>
          </TapGestureHandler>
        </TapGestureHandler>
      </GestureHandlerRootView>
    );
  }
}

export default Home;
