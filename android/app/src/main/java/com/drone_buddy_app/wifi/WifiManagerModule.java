package com.drone_buddy_app.wifi;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Build;

import androidx.annotation.RequiresApi;

import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.net.wifi.SupplicantState;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.util.Log;

import com.facebook.react.bridge.Callback;

import java.net.UnknownHostException;
import java.net.InetAddress;

import android.content.Context;

import android.net.wifi.WifiManager;
import android.os.Build;
public class WifiManagerModule extends ReactContextBaseJavaModule {

    private ConnectivityManager mConnectivityManager;
    private ConnectivityManager.NetworkCallback mNetworkCallback;

    public WifiManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d("WifiManager", "Routing network requests through WiFi: Constructor called");
        this.mConnectivityManager = (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
    }

    @Override
    public String getName() {
        return "WifiManager";
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    public void routeNetworkRequestsThroughWifi(String ssidPrefix, Callback callback) {
        Log.d("WifiManager", "Routing network requests through WiFi: Called");
        // ensure prior network callback is invalidated
        unregisterNetworkCallback(mNetworkCallback);

        // new NetworkRequest with WiFi transport type
        NetworkRequest request = new NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_NOT_RESTRICTED)
                .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
                .build();

        // network callback to listen for network changes
        mNetworkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                // on new network ready to use
                String currentSSID = getNetworkSsid(getReactApplicationContext());
                Log.d("WifiManager", "Routing network requests through WiFi: Success");
                Log.d("WifiManager", currentSSID);
                if (currentSSID.startsWith(ssidPrefix)) {
                    releaseNetworkRoute();
                    createNetworkRoute(network);
                    callback.invoke(null, "network route"); // First parameter null indicates no error

                } else {
                    releaseNetworkRoute();
                }
            }
        };
        mConnectivityManager.requestNetwork(request, mNetworkCallback);
    }

    @ReactMethod
    private void checkWifiState() {
        Network activeNetwork = mConnectivityManager.getActiveNetwork();
        if (activeNetwork != null) {
            // Get capabilities for the active network
            NetworkCapabilities capabilities = mConnectivityManager.getNetworkCapabilities(activeNetwork);

            if (capabilities != null) {
                if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                    // Wi-Fi is the active connection
                    Log.d("NetworkStatus", "Active network is Wi-Fi");
                } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                    // Mobile data is the active connection
                    Log.d("NetworkStatus", "Active network is Mobile Data");
                }
                // Add additional checks if other network types are of interest, e.g., TRANSPORT_ETHERNET
            }
        } else {
            // No active network
            Log.d("NetworkStatus", "No active network");
        }
        boolean isSupported = false;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            WifiManager wifiManager = (WifiManager) getReactApplicationContext().getSystemService(Context.WIFI_SERVICE);
            if (wifiManager != null) {
                isSupported = wifiManager.isMakeBeforeBreakWifiSwitchingSupported();
            }
        }else {
            Log.d("NetworkStatus", "No active network");

        }

    }

    private String getNetworkSsid(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        int ipAddress = wifiInfo.getIpAddress();
// Convert to byte array of length 4
        String ipAddressString = "";
        byte[] ipAddressBytes = {
                (byte) (ipAddress & 0xFF),
                (byte) ((ipAddress >> 8) & 0xFF),
                (byte) ((ipAddress >> 16) & 0xFF),
                (byte) ((ipAddress >> 24) & 0xFF)
        };

        try {
            InetAddress inetAddress = InetAddress.getByAddress(ipAddressBytes);
            ipAddressString = inetAddress.getHostAddress();
            Log.d("WifiManager", "IP Address: " + ipAddressString);
        } catch (UnknownHostException e) {
            Log.e("WifiManager", "Unable to get host address.");
        }

        if (wifiInfo.getSupplicantState() == SupplicantState.COMPLETED) {
            return ipAddressString.replace("\"", "");
        }
        return "";
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private void unregisterNetworkCallback(ConnectivityManager.NetworkCallback networkCallback) {
        if (networkCallback != null) {
            try {
                mConnectivityManager.unregisterNetworkCallback(networkCallback);
            } catch (Exception ignore) {
            } finally {
                mNetworkCallback = null;
            }
        }
    }

//    private boolean releaseNetworkRoute() {
//        boolean processBoundToNetwork = false;
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//            processBoundToNetwork = mConnectivityManager.bindProcessToNetwork(null);
//        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
//            processBoundToNetwork = ConnectivityManager.setProcessDefaultNetwork(null);
//        }
//        return processBoundToNetwork;
//    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private boolean createNetworkRoute(Network network) {
        boolean processBoundToNetwork = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            processBoundToNetwork = mConnectivityManager.bindProcessToNetwork(network);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            processBoundToNetwork = ConnectivityManager.setProcessDefaultNetwork(network);
        }
        checkWifiState();
        return processBoundToNetwork;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private Boolean releaseNetworkRoute() {
        boolean processBoundToNetwork = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            processBoundToNetwork = mConnectivityManager.bindProcessToNetwork(null);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            processBoundToNetwork = ConnectivityManager.setProcessDefaultNetwork(null);
        }
        return processBoundToNetwork;
    }
}
