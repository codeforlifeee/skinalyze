import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  Platform,
  StatusBar,
  Text,
  TouchableOpacity
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SplashScreenComponent from './components/SplashScreen';

// Load login page directly to avoid redirect issues
const WEBSITE_URL = 'https://skin-alyze.vercel.app/login';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(0);
  const [loadTimeout, setLoadTimeout] = useState(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setKey(prevKey => prevKey + 1);
  };

  // Force hide loader after maximum wait time
  React.useEffect(() => {
    if (loading && !showSplash) {
      const timeout = setTimeout(() => {
        console.log('Force hiding loader after timeout');
        setLoading(false);
      }, 15000); // 15 seconds max wait
      
      setLoadTimeout(timeout);
      
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [loading, showSplash]);

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
        key={key}
        source={{ uri: WEBSITE_URL }}
        style={styles.webview}
        onLoadStart={() => {
          setLoading(true);
          setError(null);
        }}
        onLoadEnd={() => {
          console.log('WebView onLoadEnd triggered');
          setLoading(false);
          if (loadTimeout) clearTimeout(loadTimeout);
        }}
        onLoadProgress={({ nativeEvent }) => {
          console.log('Loading progress:', nativeEvent.progress);
          // Hide loader when page is 80% loaded for better UX
          if (nativeEvent.progress > 0.8 && loading) {
            setLoading(false);
            if (loadTimeout) clearTimeout(loadTimeout);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setError('Failed to load website');
          setLoading(false);
          if (loadTimeout) clearTimeout(loadTimeout);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP error:', nativeEvent);
          if (nativeEvent.statusCode >= 400) {
            setError(`Server error: ${nativeEvent.statusCode}`);
            setLoading(false);
            if (loadTimeout) clearTimeout(loadTimeout);
          }
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        bounces={false}
        mixedContentMode="compatibility"
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        allowFileAccess={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        // Allow all navigation within the app
        onShouldStartLoadWithRequest={(request) => {
          // Allow all requests from the same domain
          const url = request.url.toLowerCase();
          if (url.includes('skin-alyze.vercel.app')) {
            return true;
          }
          // Allow common auth redirects
          return true;
        }}
        onNavigationStateChange={(navState) => {
          // Log navigation for debugging
          console.log('Navigation:', navState.url);
        }}
        setSupportMultipleWindows={false}
        onOpenWindow={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
        }}
        // Add timeout handling
        onContentProcessDidTerminate={() => {
          setError('Content process crashed');
          if (loadTimeout) clearTimeout(loadTimeout);
          handleRetry();
        }}
        // Inject JavaScript to help with performance and debugging
        injectedJavaScript={`
          (function() {
            console.log('WebView loaded successfully');
            window.ReactNativeWebView = true;
            
            // Signal React Native when page is truly interactive
            if (document.readyState === 'complete') {
              window.ReactNativeWebView.postMessage('PAGE_LOADED');
            } else {
              window.addEventListener('load', function() {
                setTimeout(function() {
                  window.ReactNativeWebView.postMessage('PAGE_LOADED');
                }, 1000);
              });
            }
            
            // Optimize images for mobile
            const images = document.querySelectorAll('img');
            images.forEach(img => {
              img.loading = 'lazy';
            });
          })();
          true;
        `}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'PAGE_LOADED') {
            console.log('Page fully loaded from JavaScript');
            setLoading(false);
            if (loadTimeout) clearTimeout(loadTimeout);
          }
        }}
      />
      
      {loading && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading Skinalyze...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
