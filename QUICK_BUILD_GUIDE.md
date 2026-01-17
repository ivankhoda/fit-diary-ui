# Quick Build Reference - Planka

## 🚀 Quick Commands

### Development

```bash
npm start                    # Start dev server (http://localhost:8080)
```

### Build for Mobile

```bash
npm run build:mobile        # Build web + sync to iOS/Android
```

### Individual Steps

```bash
npm run build               # Build web only
npm run sync                # Sync to native projects
npm run open:ios            # Open Xcode
npm run open:android        # Open Android Studio
```

---

## 📱 Build Process Overview

```
┌─────────────────┐
│  npm run build  │  ← Build web assets (creates dist/)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   npx cap sync  │  ← Copy to iOS/Android + install deps
└────────┬────────┘
         │
         ├─────────────────┐
         ▼                 ▼
    ┌────────┐        ┌─────────┐
    │  iOS   │        │ Android │
    │ Xcode  │        │ Studio  │
    └────────┘        └─────────┘
```

---

## ✅ Current Status

### Completed

- ✅ Info.plist configured
- ✅ Capacitor synced successfully
- ✅ Version set: 1.0.0 (Build 1)
- ✅ Build scripts added to package.json
- ✅ .nvmrc created (Node v21.7.3)
- ✅ Manifest.json fixed
- ✅ Build & sync tested ✅

### Ready for Next Steps

1. Test iOS build in Xcode
2. Test Android build in Android Studio
3. Add English translations
4. Hide/review Coach features

---

## 📋 Files Created/Modified

### New Files

- ✅ `.nvmrc` - Node version lock
- ✅ `BUILD_INSTRUCTIONS.md` - Detailed build guide
- ✅ `PRE_SUBMISSION_CHECKLIST.md` - Complete submission checklist

### Modified Files

- ✅ `ios/App/App/Info.plist` - Privacy keys added
- ✅ `package.json` - Build scripts added
- ✅ `public/manifest.json` - Fixed icon paths

---

## 🎯 What Works Now

1. **Web Build**: ✅

   ```bash
   npm run build
   ```

2. **Capacitor Sync**: ✅

   ```bash
   npx cap sync
   ```

3. **Combined Build**: ✅

   ```bash
   npm run build:mobile
   ```

4. **iOS Ready**: ✅

   - Info.plist configured
   - Versions set
   - Ready to open in Xcode

5. **Android Ready**: ✅
   - Gradle files generated
   - Ready to open in Android Studio

---

## 🔜 Next Priority: Testing

### iOS Testing

```bash
npm run open:ios
```

Then in Xcode:

1. Select your team (Signing & Capabilities)
2. Select device/simulator
3. Click Run ▶️

### Android Testing

```bash
npm run open:android
```

Then in Android Studio:

1. Wait for Gradle sync
2. Select device/emulator
3. Click Run ▶️

---

## 📊 Build Status Summary

| Component       | Status      | Notes                |
| --------------- | ----------- | -------------------- |
| Web Build       | ✅ Working  | dist/ generated      |
| Capacitor Sync  | ✅ Working  | All platforms synced |
| iOS Config      | ✅ Complete | Info.plist updated   |
| Android Config  | ✅ Complete | Auto-generated       |
| Version Numbers | ✅ Set      | 1.0.0 (Build 1)      |
| Build Scripts   | ✅ Added    | package.json updated |
| Documentation   | ✅ Complete | 3 guides created     |

---

## ⚡ Troubleshooting

### Build fails

```bash
npm run build:clean      # Clean build
```

### Sync fails

```bash
rm -rf dist
npm run build:mobile
```

### iOS deps fail

```bash
cd ios/App && pod install --repo-update
```

---

**Setup Status**: ✅ **COMPLETE - Builds properly configured!**

Ready to move to: Testing on real devices

---

For detailed instructions, see:

- `BUILD_INSTRUCTIONS.md` - Complete build guide
- `PRE_SUBMISSION_CHECKLIST.md` - Submission requirements
