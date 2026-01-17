# Pre-Submission Checklist for Planka

## Version: 1.0.0 | Build: 1

---

## 🔧 Technical Configuration

### ✅ Basic Setup (COMPLETED)

- [x] App ID configured: `com.planka.app`
- [x] App Name: "Planka"
- [x] Version: 1.0.0 (Marketing Version: 1.0, Build: 1)
- [x] Capacitor synced successfully
- [x] iOS Info.plist updated with privacy keys
- [x] Manifest.json icons fixed
- [x] Node.js v21.7.3 configured (.nvmrc added)

### 📱 iOS Configuration

- [x] Info.plist privacy descriptions added
- [x] Export compliance key added (ITSAppUsesNonExemptEncryption = false)
- [x] App Transport Security configured
- [x] Background modes enabled (fetch, notifications)
- [ ] **TODO**: Test build in Xcode with signing
- [ ] **TODO**: Verify provisioning profiles
- [ ] **TODO**: Create App Store Connect listing

### 🤖 Android Configuration

- [x] Capacitor sync completed
- [x] Gradle files auto-generated
- [ ] **TODO**: Create signing keystore
- [ ] **TODO**: Configure signing in gradle
- [ ] **TODO**: Test release build
- [ ] **TODO**: Create Google Play Console listing

---

## 🎨 Assets & UI

### Icons

- [x] Web icons: 192x192, 512x512
- [x] iOS icons: All sizes (20px - 1024px)
- [ ] **TODO**: Verify app icon displays correctly on device
- [ ] **TODO**: Create App Store screenshots (6.5", 5.5")
- [ ] **TODO**: Create Google Play screenshots
- [ ] **TODO**: Optional: Create app preview video

### Splash Screen

- [x] Configured in capacitor.config.ts
- [ ] **TODO**: Verify splash screen on actual devices
- [ ] **TODO**: Test on different screen sizes

---

## 📝 Legal & Content

### Documentation

- [x] Privacy Policy (currently Russian only)
- [x] Terms of Use (currently Russian only)
- [x] Account Deletion page
- [ ] **CRITICAL**: Add English translations for Privacy/Terms
- [ ] **TODO**: Prepare App Store description (both stores)
- [ ] **TODO**: Add app keywords for SEO

### Contact

- [x] Support email: ivankhoda@gmail.com

---

## 🚀 Features Review

### ✅ User Features (REVIEWED)

- [x] Authentication (Login/Registration/Recovery)
- [x] Profile management
- [x] Exercises (own, base, coach-owned)
- [x] Workouts tracking
- [x] Training goals
- [x] Plans management
- [x] Stats & analytics
- [x] Offline support
- [x] Internationalization (en/ru)

### ⚠️ Coach Features (NEEDS REVIEW)

- [ ] **CRITICAL**: Review Coach features or hide for v1.0
- [ ] **Option 1**: Complete Coach features testing
- [ ] **Option 2**: Hide Coach mode toggle for v1.0 release
- [ ] Decision needed before submission

---

## 🧪 Testing

### Build Testing

- [ ] **REQUIRED**: Build succeeds without errors
  ```bash
  npm run build:mobile
  ```
- [ ] **REQUIRED**: iOS builds in Xcode
- [ ] **REQUIRED**: Android builds APK/AAB successfully

### Device Testing (CRITICAL)

- [ ] Test on actual iPhone (not just simulator)
- [ ] Test on actual Android device (not just emulator)
- [ ] Test on different iOS versions (iOS 15+)
- [ ] Test on different Android versions (Android 8+)
- [ ] Test on different screen sizes

### Functionality Testing

- [ ] User registration works
- [ ] Login/logout works
- [ ] Password recovery works
- [ ] Create workout
- [ ] Add exercises to workout
- [ ] Complete workout
- [ ] View stats
- [ ] Create training goal
- [ ] Create plan
- [ ] Offline mode works
- [ ] Data syncs when back online
- [ ] App survives background/foreground
- [ ] Push notifications work (if enabled)
- [ ] Share functionality works

### Network Testing

- [ ] Test with WiFi
- [ ] Test with mobile data
- [ ] Test offline → online transition
- [ ] Test poor network conditions
- [ ] Verify API endpoints are production-ready

### Edge Cases

- [ ] App works after force quit
- [ ] Data persists after app restart
- [ ] Large dataset handling
- [ ] Memory usage is acceptable
- [ ] Battery drain is reasonable

---

## 🔒 Security & Privacy

### API Configuration

- [x] Production API: https://planka.tech/api
- [ ] **TODO**: Verify SSL certificate is valid
- [ ] **TODO**: Test API rate limiting
- [ ] **TODO**: Verify error handling for API failures

### Data & Privacy

- [ ] Review what data is collected
- [ ] Verify GDPR compliance (if applicable)
- [ ] Test account deletion
- [ ] Verify data is actually deleted
- [ ] Check local data encryption (if needed)

---

## 📦 App Store Specific

### Apple App Store

- [ ] Apple Developer account active ($99/year)
- [ ] Certificates created
- [ ] Provisioning profiles configured
- [ ] App Store Connect app created
- [ ] Fill out App Information:
  - [ ] Name: "Planka - Fitness Diary"
  - [ ] Subtitle
  - [ ] Description (English)
  - [ ] Keywords
  - [ ] Support URL
  - [ ] Marketing URL (optional)
  - [ ] Category: Health & Fitness
  - [ ] Age rating
- [ ] Upload screenshots (required sizes)
- [ ] Set pricing (Free/Paid)
- [ ] Configure in-app purchases (if any)
- [ ] Set availability regions
- [ ] Submit for review

### Google Play Store

- [ ] Google Play Developer account active ($25 one-time)
- [ ] Create signing key
- [ ] Upload signed AAB
- [ ] Fill out Store Listing:
  - [ ] App name: "Planka - Fitness Diary"
  - [ ] Short description (80 chars)
  - [ ] Full description (4000 chars)
  - [ ] Screenshots (min 2, max 8)
  - [ ] Feature graphic (1024x500)
  - [ ] Category: Health & Fitness
  - [ ] Content rating questionnaire
  - [ ] Target audience
  - [ ] Contact details
- [ ] Set pricing & distribution
- [ ] Submit for review

---

## 🐛 Known Issues to Fix

### Critical (Must fix before submission)

- [ ] Add English translations for Privacy Policy & Terms
- [ ] Decide on Coach features (hide or complete)
- [ ] Test on real devices
- [ ] Create signing certificates

### High Priority (Should fix)

- [ ] Fix TypeScript version warning
- [ ] Add comprehensive error boundaries
- [ ] Improve error messages for users
- [ ] Optimize bundle size

### Medium Priority (Nice to have)

- [ ] Add first-time user onboarding
- [ ] Add analytics (privacy-friendly)
- [ ] Add crash reporting
- [ ] Improve accessibility (ARIA labels)

---

## 📊 Performance Checklist

- [ ] App loads in < 3 seconds
- [ ] No memory leaks detected
- [ ] Smooth scrolling/animations
- [ ] Images optimized
- [ ] Bundle size reasonable (< 50MB)
- [ ] Lazy loading implemented where appropriate

---

## ✅ Final Pre-Submission Steps

1. [ ] All "CRITICAL" items above completed
2. [ ] Version numbers updated if needed
3. [ ] Build number incremented if resubmitting
4. [ ] All testing completed successfully
5. [ ] Screenshots and assets prepared
6. [ ] Store listings completed
7. [ ] Privacy policy accessible from app
8. [ ] Terms of use accessible from app
9. [ ] Support contact information provided
10. [ ] Archive/Build uploaded to respective store

---

## 📅 Estimated Timeline

**Current Status**: ~60% complete

**Remaining Work**:

1. English translations: 1-2 days
2. Coach features decision: 1 day
3. Device testing: 2-3 days
4. App Store assets: 1-2 days
5. Store listings: 1 day
6. Final polish: 1-2 days

**Total**: ~7-10 days to submission-ready

---

## 🚦 Status Summary

**Ready for Submission**: ❌ Not Yet

**Blockers**:

1. Missing English translations (Legal pages)
2. Coach features need review
3. No device testing completed
4. Missing App Store assets
5. No signing certificates configured

**Next Steps**:

1. Add English translations
2. Hide or complete Coach features
3. Test on real devices
4. Create App Store/Play Store listings

---

## 📞 Support

For build issues: Check BUILD_INSTRUCTIONS.md
For feature questions: ivankhoda@gmail.com

---

_Last Updated: January 16, 2026_
_Version: 1.0.0 (Build 1)_
