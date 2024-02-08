import React, {Component} from 'react';
import {
  StyleSheet,
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

import {
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Logger} from '../../utils/Logger.ts';
import {io} from 'socket.io-client';
import {toggleWifi} from '../../utils/WifiManager.ts';

type Props = {};
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

    this.drone = new Tello();
    this.drone.send('command');
    this.socket = null;
    this.droneStartStream();
    this.handleToggleWifi();
  }

  handleToggleWifi = () => {
    // Call the function with true to enable WiFi, or false to disable WiFi
    toggleWifi(true)
      .then(() => {
        console.log('WiFi toggled successfully');
      })
      .catch(error => {
        console.error('Failed to toggle WiFi:', error);
      });
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
    Tts.removeEventListener('tts-start', event => console.log('start', event));
    Tts.removeEventListener('tts-finish', event =>
      console.log('finish', event),
    );
    Tts.removeEventListener('tts-cancel', event =>
      console.log('cancel', event),
    );
    Tts.removeEventListener('tts-error', event => console.error(event));

    if (this.socket) {
      this.socket.disconnect();
    }
  }

  componentDidMount() {
    this.requestMicrophonePermission();
    // Set up TTS event listeners
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
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

    // this.socket = io(`http://172.20.10.2:65432`, {
    //   transports: ['websocket'], // Use WebSocket for transport
    // });
    this.socket = io(`http://${this.SERVER_IP}:${this.SERVER_PORT}`, {
      transports: ['websocket'], // Use WebSocket for transport
    });

    console.log(this.socket, '------------------------------------------');
    this.socket.on('connect', () => {
      console.log('Connected to Python socket server');
      this.setState({isConnected: true});
      // Example: Send a command to the Python server upon connection
      // this.sendMessage('take_off');
    });

    this.socket.on('after connect', (msg: {data: any}) => {
      console.log('Message from server:', msg.data);
      this.setState({dataFromServer: msg.data});
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Python socket server');
      this.setState({isConnected: false});
    });
    this.socket.on('connect_error', error => {
      console.log('Connection Error:', error);
    });
  }

  sendMessage = (message: any) => {
    if (this.state.isConnected) {
      console.log('Message sending : ', message);
      this.socket.emit('message', message);
    } else {
      console.log('Not connected to server');
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
        console.log('System Actions: ', 'Microphone Access Enabled');
      } else {
        console.log('System Actions: ', 'Microphone Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    });
  };

  onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = (e: SpeechResultsEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Results', e);
    this.setState({
      results: e.value,
    });
    this.sendMessage(this.state.results[0]);
  };

  onSpeechPartialResults = (e: SpeechResultsEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Partial Results', e);
    console.log('onSpeechPartialResults: ', e);
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
    this.sendMessage('take_off');
  };
  _droneLand = () => {
    // this.drone?.send('land');
    this.sendMessage('land');
  };
  _droneLeft = () => {
    this.drone?.send('left 20');
  };
  _droneRight = () => {
    this.drone?.send('right 20');
  };

  _droneUp = () => {
    this.drone?.send('up 50');
  };

  _droneDown = () => {
    this.drone?.send('down 50');
  };

  _droneGetBattery = () => {
    // this.drone?.send('battery?');
    this.sendMessage('battery?');
  };
  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      isListening: false,
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };

  speak = (text: string) => {
    Tts.speak(text);
  };

  stop = () => {
    Tts.stop();
  };

  handleIntentRecognition = (text: any) => {
    console.log('text to be saved', text);
    APIService.resolveIntent(text)
      .then(data => {
        // Handle the response data
        console.log('Intent Recognition data:', data);
        this.handleIntent(data);
      })
      .catch(error => {
        // Handle any errors here
        console.error('Intent Recognition error:', error);
        this.speak('Something went wrong, please repeat the instruction');
      });
  };
  handleGet = () => {
    console.log('text to be saved');
    APIService.fetchData();
  };

  async someOtherFunction() {
    try {
      await APIService.fetchData();
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }

  // export declare type ValidCommands = 'command' | 'takeoff' | 'land' | 'streamon' | 'streamoff' | 'emergency' | 'up' | 'down' | 'left' | 'right' | 'forward' | 'back' | 'cw' | 'ccw' | 'flip' | 'go' | 'curve' | 'speed' | 'rc' | 'wifi' | 'speed?' | 'battery?' | 'time?' | 'wifi?' | 'sdk?' | 'sn?';

  handleIntent(text: any) {
    let intent = text.result.intent;
    switch (intent) {
      case 'TAKE_OFF':
        this.speak("I'm taking off!");
        this.drone?.takeoff();
        this.state.isInAir = true;
        break;
      case 'LAND':
        this.speak("I'm landing!");
        this.drone?.land();
        this.state.isInAir = false;
        break;
      case 'ROTATE_CLOCKWISE':
        this.speak("I'm rotating clockwise!");
        this.drone?.rotateClockwise(30);
        break;
      case 'ROTATE_COUNTER_CLOCKWISE':
        this.speak("I'm rotating counter clockwise!");
        this.drone?.rotateCounterClockwise(30);
        break;
      case 'FORWARD':
        this.speak("I'm moving forward!");
        this.drone?.forward(30);
        break;
      case 'BACKWARD':
        this.speak("I'm moving backward!");
        this.drone?.back(30);
        break;
      case 'LEFT':
        this.speak("I'm moving to the left!");
        this.drone?.left(30);
        break;
      case 'RIGHT':
        this.speak("I'm moving to the right!");
        this.drone?.right(30);
        break;
      case 'UP':
        this.speak("I'm moving up!");
        this.drone?.up(30);
        break;
      case 'DOWN':
        this.speak("I'm moving down!");
        this.drone?.down(30);
        break;
      case 'FLIP':
        this.speak("I'm flipping!");
        this.drone?.flip();
        break;
      case 'RECOGNIZE_TEXT':
        this.speak("I'm trying to read the text!");
        // recognize_text(drone_instance);
        break;
      case 'RECOGNIZE_PEOPLE':
        this.speak("I'm trying to recognize people!");
        // recognize_people(drone_instance);
        break;
      case 'RECOGNIZE_OBJECTS':
        this.speak("I'm trying to recognize objects!");
        // recognize_objects(drone_instance);
        break;
      case 'STOP':
        this.speak("I'm stopping!");
        // land(drone_instance);
        this.drone?.send('land');
        break;
      default:
        this.speak("I don't know what you mean");
        console.log('Unknown intent:', intent);
    }

    console.log(intent);
  }

  droneStartStream = () => {
    this.drone?.send('streamon');
  };
  droneStopStream = () => {
    this.drone?.send('streamoff');
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
            </View>
          </TapGestureHandler>
        </TapGestureHandler>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
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

export default Home;
