import React, {Component} from 'react';
import {
  Text,
  View,
  PermissionsAndroid,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  Vibration,
} from 'react-native';

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import styles from './Home.styles'; // Import styles with TypeScript
import {ToastAndroid} from 'react-native';

import {
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Logger} from '../../utils/Logger.ts';
import {RootStackParamList} from '../../../AppNavigator.tsx';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import LottieView from 'lottie-react-native';

// type Props = {};
interface Props {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
}

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

type State = {
  recognized: string;
  isListening: boolean;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isConnected: boolean;
  ipAddress?: string;
  inputText: string;
  isStartButtonPressed: boolean;
  isSoundPlaying: boolean;
  isTtsSpeaking: boolean;
  start_button_text: string;
  currentProcess: string;
  ttsVoice: string;
  ttsPitch: number;
  ttsRate: number;
};

class Home extends Component<Props, State> {
  state = {
    recognized: '',
    isListening: false,
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    ipAddress: this.props.route.params?.ipAddress,
    isConnected: false,
    inputText: '',
    isStartButtonPressed: false,
    isSoundPlaying: false,
    isTtsSpeaking: false,
    start_button_text: 'Start',
    currentProcess: '',
    ttsVoice: this.props.route.params?.selectedVoice || 'en-US',
    ttsPitch: this.props.route.params?.pitch || 0.5,
    ttsRate: this.props.route.params?.rate || 1,
  };
  doubleTapRef = React.createRef();

  webSocket: WebSocket | null = null;

  SERVER_IP = '172.20.10.3'; // Hardcoded server IP
  SERVER_PORT = '65432'; // The port your server is listening on

  private loadingSound: null;
  private processAlertSound: Sound | null = null;
  private vibrationInterval: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);

    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;

    this.loadingSound = null;
  }

  componentDidUpdate(prevProps: any) {
    // Check if the Home component received new parameters
    console.log('Received new parameters:', this.props.route.params);
    if (
      this.props.route.params?.ipAddress !== prevProps.route.params?.ipAddress
    ) {
      this.setState({ipAddress: this.props.route.params?.ipAddress});
      // Optionally, perform other actions with the new IP address
    }
    // Check if the Home component received new TTS settings
    if (this.props.route.params?.voice !== prevProps.route.params?.voice) {
      console.log('Updating TTS settings:', this.props.route.params);
      this.updateTtsSettings(
        this.props.route.params?.voice,
        this.props.route.params?.pitch,
        this.props.route.params?.rate,
      );
    }
    this.SERVER_IP = this.state.ipAddress;
    if (
      !this.state.isConnected &&
      this.state.ipAddress &&
      this.state.ipAddress !== ''
    ) {
      this.connectToWebSocket();
    }
  }

  // Method to update TTS settings
  updateTtsSettings = (voice: string, pitch: number, rate: number) => {
    this.setState({ttsVoice: voice, ttsPitch: pitch, ttsRate: rate}, () => {
      Tts.setDefaultLanguage(this.state.ttsVoice);
      Tts.setDefaultPitch(this.state.ttsPitch);
      Tts.setDefaultRate(this.state.ttsRate);
      Tts.setDefaultVoice(this.state.ttsVoice);
    });
    console.log('TTS settings updated:', voice, pitch, rate);
  };

  onSpeechStart = (e: any) => {
    this.setState({
      started: '√',
    });
  };

  onSpeechVolumeChanged = (e: any) => {
    this.setState({
      pitch: e.value,
    });
  };
  onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Results', e);
    this.setState({
      recognized: '√',
      isListening: false,
      isStartButtonPressed: true,
    });
  };

  onSpeechResults = (e: SpeechResultsEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Results', e);
    // @ts-ignore
    this.setState({
      results: e.value,
      isListening: false,
      isStartButtonPressed: true,
    });
    this.setState({start_button_text: 'Start'});
    this.sendMessage(this.state.results[0], 'RECOGNITION');
  };

  sendMessage = (message: any, type: string) => {
    if (this.state.isConnected) {
      Logger.log_info('Web Socket', 'HOME', 'Message sending', message);
      if (message.trim() && this.webSocket && this.state.isConnected) {
        const formatted_message = JSON.stringify({
          target: 'MOBILE',
          type: 'SYSTEM',
          category: 'INPUT',
          message: message,
        });
        console.log('Sending:', formatted_message);
        this.webSocket.send(formatted_message);
        this.setState({inputText: ''});
        this.startAlert();
      } else {
        console.warn('WebSocket is not connected or input is empty');
      }
    } else {
      Logger.log_info('Web Socket', 'HOME', 'Not connected to server', '');
    }
  };

  onSpeechPartialResults = (e: SpeechResultsEvent) => {
    Logger.log_info('Speech Recognition', 'MAIN', 'Partial Results', e);
    // @ts-ignore
    this.setState({
      partialResults: e.value,
    });
  };
  onSpeechError = (e: SpeechErrorEvent) => {
    Logger.log_error('Speech Recognition', 'MAIN', 'Error', e);

    this.setState({
      error: JSON.stringify(e.error),
      isListening: false,
      isStartButtonPressed: true,
    });
  };
  onSpeechEnd = (e: any) => {
    this.setState({
      end: '√',
      isListening: false,
      isStartButtonPressed: true,
    });
  };

  componentDidMount() {
    this.requestMicrophonePermission();

    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(0.5);

    this.connectToWebSocket();
  }

  stopLoadingSound = () => {
    if (this.loadingSound) {
      this.loadingSound.stop(() => {
        console.log('Sound stopped');
        this.setState({start_button_text: 'Start'});

        this.setState({isSoundPlaying: false});
      });
    }
  };

  handleTtsStart = () => {
    Logger.log_info('Voice Recognition', 'HOME', 'TTS started');
    this.setState({isTtsSpeaking: true});
    this.setState({
      isListening: !this.state.isListening,
      isStartButtonPressed: true,
    });
    this.stopLoadingSound(); // Stop the loading sound when TTS starts
  };

  handleTtsFinish = () => {
    Logger.log_info('Voice Recognition', 'HOME', 'TTS finished');
    this.setState({isTtsSpeaking: false});
    this.setState({
      isListening: !this.state.isListening,
      isStartButtonPressed: true,
    });
    // this.playLoadingSound(); // Optionally restart the loading sound if needed
  };

  handleTtsError = (error: any) => {
    Logger.log_error('Voice Recognition', 'HOME', 'TTS error', error);
    this.setState({isTtsSpeaking: false});
    this.setState({
      isListening: !this.state.isListening,
      isStartButtonPressed: true,
    }); // this.playLoadingSound(); // Optionally restart the loading sound if needed
  };

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);

    if (this.webSocket) {
      this.webSocket.close();
    }
    // Release the sound object to free up resources
    if (this.loadingSound) {
      this.loadingSound.release();
    }

    // Remove TTS event listeners
    Tts.removeEventListener('tts-start', this.handleTtsStart);
    Tts.removeEventListener('tts-finish', this.handleTtsFinish);
    Tts.removeEventListener('tts-cancel', this.handleTtsFinish);
    Tts.removeEventListener('tts-error', this.handleTtsError);
  }

  startAction = () => {
    if (this.state.isSoundPlaying) {
      this.stopLoadingSound();
    } else {
      this.playLoadingSound();
    }
  };
  playLoadingSound = () => {
    if (this.loadingSound) {
      this.loadingSound.play(success => {
        if (success) {
          this.setState({start_button_text: 'processing'});
          console.log('Sound played successfully');
          this.playLoadingSound();
          this.setState({isSoundPlaying: true});
        } else {
          console.error('Sound playback failed');
        }
      });
    }
  };
  connectToWebSocket = () => {
    const wsUrl = `ws://${this.SERVER_IP}:${this.SERVER_PORT}`;
    console.log('Connecting to WebSocket server:', wsUrl);

    this.webSocket = new WebSocket(wsUrl);

    this.webSocket.onopen = () => {
      console.log('WebSocket connection opened:', wsUrl);
      this.setState({isConnected: true});
      this.showNotification('WebSocket connected', false);
    };

    this.webSocket.onmessage = event => {
      console.log('Message received from the server:', event.data);
      try {
        const message = JSON.parse(event.data);
        if (message.category === 'READ' && message.message) {
          this.showNotification('Message received from wizard', false);
          // this.speak(message.message);
          this.playAudioFromBase64(message.message);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    this.webSocket.onerror = error => {
      console.error('WebSocket error:', error.message);
      this.showNotification('WebSocket disconnected', true);
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed:', wsUrl);
      this.setState({isConnected: false});
      this.showNotification('WebSocket disconnected', true);
      this.webSocket = null;

      // Optional: Implement reconnection logic if needed.
    };
  };

  requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Use these state variables in the TTS configuration
  speak = (text: string) => {
    Tts.speak(text);
  };

  playAudioFromBase64 = async base64Audio => {
    this.stopAlert();
    try {
      if (!base64Audio) {
        console.log('No audio data provided');
        return;
      }

      const path = `${RNFS.DocumentDirectoryPath}/temp_audio.mp3`;
      await RNFS.writeFile(path, base64Audio, 'base64');

      Sound.setCategory('Playback');

      // Stop any currently playing sound before playing a new one
      if (this.loadingSound) {
        this.loadingSound.stop(() => console.log('Stopped previous audio'));
      }

      this.loadingSound = new Sound(path, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Failed to load sound:', error);
          return;
        }

        this.loadingSound.play(success => {
          if (!success) {
            console.log('Playback failed');
          }
          this.loadingSound.release();
        });
      });
    } catch (error) {
      console.error('Error playing Base64 audio:', error);
    }
  };
  handleSend = () => {
    // {"target": "MOBILE", "type": "SYSTEM", "category": "INPUT", "message": "yes"}
    const {inputText} = this.state;
    if (inputText.trim() && this.webSocket && this.state.isConnected) {
      const message = JSON.stringify({
        target: 'MOBILE',
        type: 'SYSTEM',
        category: 'INPUT',
        message: inputText,
      });
      console.log('Sending:', message);
      this.showNotification('Message sent to the wizard', false);

      this.webSocket.send(message);
      this.setState({inputText: ''});
    } else {
      console.warn('WebSocket is not connected or input is empty');
    }
  };

  _startRecognizing = async () => {
    this.setState({start_button_text: 'Listening'});

    // Stop any ongoing audio playback
    if (this.loadingSound) {
      this.loadingSound.stop(() => {
        console.log('Stopped Base64 audio playback');
      });
    }

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
      this.setState({start_button_text: 'Start'});
    } catch (e) {
      console.error(e);
    }
  };

  _onStart = () => {
    // update the view to show the user that the app is listening
    console.log('start method called');
    this.stopAlert();
    this.setState(
      {isListening: !this.state.isListening, isStartButtonPressed: true},
      () => {
        console.log('isListening', this.state.isListening);
        if (!this.state.isListening) {
          this._stopRecognizing();
        } else {
          this._startRecognizing();
        }
      },
    );
  };

  // onSingleTap = (event: {nativeEvent: {state: number}}) => {
  //   if (
  //     event.nativeEvent.state === State.ACTIVE &&
  //     !this.state.isStartButtonPressed
  //   ) {
  //     Logger.log_info('User Actions', 'MAIN', 'Single tapped');
  //     if (this.state.isListening) {
  //       this._stopRecognizing();
  //     } else {
  //       this._onStart();
  //     }
  //   }
  // };

  onDoubleTap = (event: {nativeEvent: {state: number}}) => {
    this.stopAlert();
    if (event.nativeEvent.state === State.ACTIVE) {
      Logger.log_info('User Actions', 'MAIN', 'Double tapped');
      // Toggle listening state on double tap
      if (!this.state.isListening) {
        this._startRecognizing();
      } else {
        this._stopRecognizing();
      }
    }
  };

  // Method to show notifications
  showNotification = (message: string, isError: boolean = false) => {
    // @ts-ignore
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
      {
        backgroundColor: isError ? 'red' : 'green',
        color: 'white',
      },
    );
  };

  // Create a method to render the connection status dot
  renderConnectionStatusDot = () => {
    const dotColor = this.state.isConnected ? 'green' : 'red';
    return (
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: dotColor,
          marginLeft: 10,
        }}
      />
    );
  };

  startAlert = () => {
    // Prevent multiple alerts
    console.log('Starting alert sound and vibration');
    if (this.processAlertSound || this.vibrationInterval) return;

    this.processAlertSound = new Sound(
      'alert.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.error('Failed to load alert sound:', error);
          return;
        }
        this.processAlertSound?.setNumberOfLoops(-1); // Loop indefinitely
        this.processAlertSound?.play(success => {
          if (!success) {
            console.error('Failed to play alert sound');
          }
        });
      },
    );

    // Vibrate every 1 second
    this.vibrationInterval = setInterval(() => {
      Vibration.vibrate(500);
    }, 1000);
  };

  stopAlert = () => {
    if (this.processAlertSound) {
      this.processAlertSound.stop(() => {
        this.processAlertSound?.release();
        this.processAlertSound = null;
      });
    }

    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
    }
  };

  render() {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <TapGestureHandler
          ref={this.doubleTapRef}
          numberOfTaps={2}
          onHandlerStateChange={this.onDoubleTap}>
          <View style={styles.container}>
            <View style={styles.spacer} />
            <Text style={styles.helloText}>{this.state.currentProcess}</Text>

            {/* Start Button with Single Tap */}
            <TouchableOpacity onPress={this._onStart}>
              <View style={styles.mainButtonContainer}>
                {this.state.isListening ? (
                  <LottieView
                    source={require('../../assets/animations/animation.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                  />
                ) : (
                  <LinearGradient
                    colors={['#466bd9', '#f50cf8']}
                    style={styles.startButton}
                    start={{x: 0, y: 0.5}} // Start from the left center
                    end={{x: 1, y: 0.5}} // End at the right center
                  >
                    <Text style={styles.startButtonText}>
                      {this.state.start_button_text}
                    </Text>
                  </LinearGradient>
                )}
              </View>
            </TouchableOpacity>

            {/*<Text style={styles.helloText}>*/}
            {/*  You said: {this.state.results[0]}*/}
            {/*</Text>*/}

            <View style={styles.flexibleSpace} />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type something ....."
                value={this.state.inputText}
                placeholderTextColor="#aaa"
                onChangeText={text => this.setState({inputText: text})}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={this.handleSend}>
                {this.renderConnectionStatusDot()}
                <Image
                  source={{
                    uri: 'https://img.icons8.com/ios-filled/50/ffffff/send.png',
                  }}
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TapGestureHandler>
      </GestureHandlerRootView>
    );
  }
}

export default Home;
