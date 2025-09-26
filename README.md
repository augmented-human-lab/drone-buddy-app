To generate documentation for your repository, you can use a `README.md` file as the main documentation file. Below is a template for the `README.md` file based on the context of your project:

```markdown
# React Native Voice Assistant

## Overview
This repository contains a React Native application that integrates voice recognition, text-to-speech (TTS), and WebSocket communication. The app is designed to process user voice commands, send them to a server, and receive responses, including audio playback.

## Features
- **Voice Recognition**: Uses `@react-native-voice/voice` for speech-to-text functionality.
- **Text-to-Speech (TTS)**: Uses `react-native-tts` for converting text to speech.
- **WebSocket Communication**: Enables real-time communication with a server.
- **Audio Playback**: Plays audio responses from the server using `react-native-sound`.
- **Gesture Handling**: Supports double-tap gestures using `react-native-gesture-handler`.
- **Custom Animations**: Includes Lottie animations for visual feedback.
- **Cross-Platform Support**: Works on both Android and iOS platforms.

## Prerequisites
- Node.js and npm installed.
- React Native CLI installed.
- Android Studio or Xcode for running the app on an emulator or device.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MalshaDeZ/your-repo-name.git
   cd your-repo-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install native dependencies:
   ```bash
   npx react-native link
   ```

## Running the App
### Android
1. Start the Metro bundler:
   ```bash
   npx react-native start
   ```
2. Run the app on an Android device or emulator:
   ```bash
   npx react-native run-android
   ```

### iOS
1. Install CocoaPods dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```
2. Start the Metro bundler:
   ```bash
   npx react-native start
   ```
3. Run the app on an iOS device or simulator:
   ```bash
   npx react-native run-ios
   ```

## Project Structure
- `src/components`: Contains React Native components, including the `Home` screen.
- `src/utils`: Utility files such as the `Logger`.
- `assets`: Static assets like animations and sounds.
- `AppNavigator.tsx`: Navigation configuration for the app.

## Key Dependencies
- **React Native**: Core framework for building the app.
- **@react-native-voice/voice**: Speech-to-text functionality.
- **react-native-tts**: Text-to-speech functionality.
- **react-native-sound**: Audio playback.
- **react-native-gesture-handler**: Gesture handling.
- **react-native-linear-gradient**: Gradient effects.
- **lottie-react-native**: Animations.

## Configuration
### WebSocket Server
- Update the `SERVER_IP` and `SERVER_PORT` in `src/components/home/Home.tsx` to match your server's IP and port.

### Permissions
- **Android**: Ensure microphone permissions are requested in `AndroidManifest.xml`.
- **iOS**: Add the following keys to `Info.plist`:
  ```xml
  <key>NSMicrophoneUsageDescription</key>
  <string>This app needs access to your microphone.</string>
  ```

## Troubleshooting
- **WebSocket Connection Issues**: Ensure the server is running and accessible at the specified IP and port.
- **Audio Playback Issues**: Verify that the audio file is correctly encoded in Base64 format.

## License
This project is licensed under the [MIT License](LICENSE).

## Author
- **MalshaDeZ** - [GitHub Profile](https://github.com/MalshaDeZ)


