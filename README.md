# Skinalyze WebView App

A React Native mobile app built with Expo that wraps the Skinalyze website (https://daant-zydm.vercel.app/) in a native WebView.

## Features

✅ Fullscreen WebView with no extra UI
✅ Safe area handling for notched devices
✅ Proper status bar configuration
✅ JavaScript and DOM storage enabled
✅ Loading indicator while page loads
✅ Custom splash screen with Skinalyze branding
✅ Responsive mobile experience

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build platform
- **react-native-webview** - WebView component for React Native

## Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
├── App.js                  # Main app component with WebView
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── components/
│   └── SplashScreen.js    # Custom splash screen
├── assets/                # App icons and images
└── README.md             # This file
```

## Configuration

### Changing the Website URL

To change the website displayed in the WebView, edit the `uri` in `App.js`:

```javascript
<WebView
  source={{ uri: 'https://your-website-here.com' }}
  // ... other props
/>
```

### App Configuration

Edit `app.json` to configure:
- App name and slug
- App icon and splash screen
- Bundle identifiers
- Permissions
- Version numbers

## Building for Production

### Android

```bash
npm run build:android
```

### iOS

```bash
eas build --platform ios
```

## Dependencies

- `expo`: ~50.0.0
- `react-native-webview`: ^13.16.0
- `react-native-safe-area-context`: 4.8.2
- `expo-status-bar`: ~1.11.1

## Version

Current version: 1.0.3

## License

Private
