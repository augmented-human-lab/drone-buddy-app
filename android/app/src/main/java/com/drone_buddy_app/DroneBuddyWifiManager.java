package com.drone_buddy_app;

import android.net.wifi.WifiManager;
import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class DroneBuddyWifiManager extends ReactContextBaseJavaModule {

  private final WifiManager wifiManager;

  public DroneBuddyWifiManager(ReactApplicationContext reactContext) {
    super(reactContext);
    wifiManager = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
  }

  @Override
  public String getName() {
    return "DroneBuddyWifiManager";
  }

  @ReactMethod
  public void enableWifi(boolean enable, Callback callback) {
    wifiManager.setWifiEnabled(enable);
    callback.invoke(null, enable);
  }
}
