# Build Instructions for Planka Fitness Diary

## Prerequisites

### Required Software

- **Node.js**: v21.7.3 (or >= 20.0.0)
- **npm**: v10.5.0 or higher
- **Xcode**: 14.0+ (for iOS builds)
- **Android Studio**: Latest version (for Android builds)
- **CocoaPods**: Latest version (for iOS dependencies)

### Install Node.js

```bash
nvm install 21.7.3
nvm use 21.7.3
```

### Install Dependencies

```bash
npm install
```

## Build Process

### 1. Web Build

Build the web assets first (required for native builds):

```bash
npm run build
```

This creates the `dist/` directory with compiled web assets.

### 2. Sync Native Projects

After building web assets, sync with Capacitor:

```bash
npx cap sync
```

This command:

- Copies web assets to native projects
- Updates native dependencies
- Installs CocoaPods for iOS

## iOS Build

### Development Build

1. Open Xcode workspace:

   ```bash
   npx cap open ios
   # or manually: open ios/App/App.xcworkspace
   ```

2. In Xcode:
   - Select your development team (Signing & Capabilities)
   - Select target device or simulator
   - Click Run (⌘R)

### Production Build (App Store)

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select "Any iOS Device (arm64)" as target
3. Product → Archive
4. Follow App Store upload wizard

**Version Info** (already configured):

- Marketing Version: `1.0`
- Build Number: `1`

## Android Build

### Development Build

1. Open Android project:

   ```bash
   npx cap open android
   # or manually: open android/ in Android Studio
   ```

2. In Android Studio:
   - Wait for Gradle sync
   - Select device/emulator
   - Click Run

### Production Build (APK)

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Production Build (AAB for Google Play)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

**Important**: You need to sign the APK/AAB with your keystore before uploading to Google Play.

## Build Scripts

### Quick Build & Sync

```bash
npm run build && npx cap sync
```

### Full Clean Build

```bash
# Clean everything
rm -rf dist node_modules android/app/build ios/App/build

# Reinstall and rebuild
npm install
npm run build
npx cap sync
```

## Configuration Files

### Package Info

- **Version**: Set in `package.json` (currently `1.0.0`)
- **App Name**: "Planka" (set in `capacitor.config.ts`)
- **Bundle ID**: `com.planka.app`

### iOS Configuration

- **File**: `ios/App/App/Info.plist`
- **Version**: Marketing Version = `1.0`, Build = `1`
- **Permissions**: App Tracking Transparency, Background Modes

### Android Configuration

- **Auto-generated** by Capacitor
- **Gradle files**: Located in `android/app/`

## Environment Variables

### Production API

Set in `src/utils/apiUrl.ts`:

- **Native apps**: `https://planka.tech/api`
- **Web production**: `${baseUrl}/api`
- **Web development**: `${baseUrl}:3000`

## Common Issues

### "dist must contain index.html"

**Solution**: Run `npm run build` first

### Capacitor requires Node >= 20

**Solution**: Use nvm to switch: `nvm use 21.7.3`

### CocoaPods installation fails

**Solution**:

```bash
cd ios/App
pod install --repo-update
```

### Android Gradle sync fails

**Solution**: Open Android Studio and sync manually, or:

```bash
cd android
./gradlew clean
```

## Testing

### Development Testing

```bash
# Start dev server
npm start

# Open in browser
open http://localhost:8080
```

### Device Testing

- **iOS**: Use Xcode with connected device
- **Android**: Use Android Studio with connected device
- **Both**: Use actual devices, not just simulators

## Pre-Release Checklist

- [ ] Update version in `package.json`
- [ ] Run `npm run build` successfully
- [ ] Run `npx cap sync` without errors
- [ ] Test on iOS device (not just simulator)
- [ ] Test on Android device (not just emulator)
- [ ] Verify offline functionality works
- [ ] Check all navigation flows
- [ ] Verify API endpoints are production-ready
- [ ] Test authentication flows
- [ ] Verify data persistence
- [ ] Check app icons display correctly
- [ ] Test deep linking (if implemented)
- [ ] Verify push notifications (if implemented)

## Release Process

### iOS (App Store)

1. Archive in Xcode
2. Validate archive
3. Upload to App Store Connect
4. Complete App Store listing
5. Submit for review

### Android (Google Play)

1. Build signed AAB: `./gradlew bundleRelease`
2. Sign with production keystore
3. Upload to Google Play Console
4. Complete Play Store listing
5. Submit for review

## Support

For issues or questions:

- Email: ivankhoda@gmail.com
- Check `package.json` for dependency versions
