import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  NativeModules,
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
//     this.droneStartStream();
  }

  componentDidUpdate(prevProps: any) {}

  navigateToSettings = () => {
    this.props.navigation.navigate('Settings');
  };
  handleToggleWifi = (isWifi: boolean) => {
    NativeModules.WifiManager.routeNetworkRequestsThroughWifi(
      '192.168.10.2',
      (error: any, success: any) => {
        if (error) {
          console.error(error);
        } else {
          console.log(success);
        }
      },
    );
  };

  checkWifiState = () => {
    NativeModules.WifiManager.checkWifiState();
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
    this._destroyRecognizer();

    // Remove TTS event listeners
    this._destroyVoiceGeneration();
  }

  componentDidMount() {
    this.requestMicrophonePermission().then(value => {
      Logger.log_info('System Functions', 'HOME', '', value);
    });

    // Set up TTS event listeners
    this._initVoiceGeneration();
  }

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

  // ----------------------------------------------------------------------------------------------
  // Voice generation related functions
  _initVoiceGeneration() {
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

  _destroyVoiceGeneration() {
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
    Tts.removeEventListener('tts-error', event =>
      Logger.log_error('Voice Recognition', 'HOME', 'TTS error', event),
    );
  }

  speak = (text: string) => {
    Logger.log_info('Voice Recognition', 'Home', 'Generating Voice', text);
    Tts.speak(text);
  };

  stop = () => {
    Tts.stop();
  };

  // ----------------------------------------------------------------------------------------------

  //voice recognition related functionalities
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
      results: e.value ? e.value : [],
    });
    this.handleIntentRecognition(this.state.results[0]);
    this.handleGet();
  };

  onSpeechPartialResults = (e: SpeechResultsEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Partial Results', e);
    this.setState({
      partialResults: e.value ? e.value : [],
    });
  };

  onSpeechVolumeChanged = (e: any) => {
    this.setState({
      pitch: e.value,
    });
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

  // ----------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------
  // Drone related functionalities
  _droneTakeOff = () => {
    this.drone?.send('takeoff');
  };
  _droneLand = () => {
    this.drone?.send('land');
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
    let battery = this.drone?.send('battery?');
    console.log('battery', battery);
  };
  _wifiStatus = () => {
    this.checkWifiState();
  };
  _toggleWifi = () => {
    this.handleToggleWifi(true);
  };

  handleIntentRecognition = (text: any) => {
    //     this.handleToggleWifi(false);
    console.log('text to be saved', text);
    APIService.resolveIntent(text)
      .then(data => {
        // Handle the response data
        Logger.log_success(
          'Intent Recognition',
          'HOME',
          'Intent Resolved',
          data,
        );
        this.handleToggleWifi(true);
        this.handleIntent(data);
      })
      .catch(error => {
        // Handle any errors here
        Logger.log_success(
          'Intent Recognition',
          'HOME',
          'Intent Recognition error',
          error,
        );
        this.speak('Something went wrong, please repeat the instruction');
      });
  };
  handleGet = () => {
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

  handleIntent(text: any) {
    //     this.handleToggleWifi(true);
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
        Logger.log_error(
          'Intent Recognition',
          'HOME',
          'Unknown Intent',
          intent,
        );
    }

    Logger.log_info('Intent Recognition', 'HOME', 'Recognized Intent', intent);
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
              <TouchableHighlight
                style={styles.buttonQuest}
                onPress={this._wifiStatus}>
                <Text style={styles.buttonText}>Wifi</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.buttonQuest}
                onPress={this._toggleWifi}>
                <Text style={styles.buttonText}>Toggle Wifi</Text>
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
