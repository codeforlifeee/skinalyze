import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  Platform,
  StatusBar 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SplashScreenComponent from './components/SplashScreen';

const WEBSITE_URL = 'https://skin-alyze.vercel.app/';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreenComponent onLoadComplete={handleSplashComplete} />;
  }

  // For web platform, use iframe instead of WebView
  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <iframe
            src={WEBSITE_URL}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              margin: 0,
              padding: 0
            }}
            onLoad={() => setLoading(false)}
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  // For native platforms (Android/iOS), use WebView
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      <WebView
        source={{ uri: WEBSITE_URL }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        // Allow mixed content for both HTTP and HTTPS
        mixedContentMode="always"
        // Enable caching for better performance
        cacheEnabled={true}
        // Allow file access
        allowFileAccess={true}
        // Media playback settings
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        // User agent (optional - makes it appear as mobile browser)
        userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
        // ⭐ CRITICAL FIX: Prevent opening in external browser
        onShouldStartLoadWithRequest={(request) => {
          // Return true to allow all navigation within the WebView
          // This prevents external browser from opening
          return true;
        }}
        // Prevent new windows/tabs from opening externally
        setSupportMultipleWindows={false}
        // Handle any window.open() calls to keep them in the app
        onOpenWindow={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          // This prevents window.open from opening external browser
        }}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
