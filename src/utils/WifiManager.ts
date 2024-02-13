import {NativeModules} from 'react-native';
import {Logger} from './Logger.ts';

// Define TypeScript interface for your native module methods
interface DroneBuddyWifiManager {
  enableWifi(
    enable: boolean,
    callback: (error: any, success: boolean) => void,
  ): void;
}

const {DroneBuddyWifiManager} = NativeModules as {
  DroneBuddyWifiManager: DroneBuddyWifiManager;
};

// Usage example
export async function toggleWifi(enable: boolean) {
  try {
    // Callback is expected here, according to the Java method signature
    const result = await new Promise((resolve, reject) => {
      DroneBuddyWifiManager.enableWifi(
        enable,
        (error: any, success: boolean) => {
          if (error) {
            reject(error);
          } else {
            resolve(success);
          }
        },
      );
    });
    Logger.log_success(
      'System Actions',
      ' WIFI MANAGER',
      'WiFi enabled:',
      result,
    );
  } catch (error) {
    Logger.log_error('System Actions', ' WIFI MANAGER', 'WiFi error:', error);
  }
}
