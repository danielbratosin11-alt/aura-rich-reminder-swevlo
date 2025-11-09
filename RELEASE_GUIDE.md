
# Aura App - Release Guide for App Stores

This guide will walk you through the process of releasing your Aura app to both the Google Play Store and Apple App Store.

## Prerequisites

Before you begin, ensure you have:

1. **Expo Account**: Sign up at https://expo.dev
2. **Apple Developer Account**: $99/year - https://developer.apple.com
3. **Google Play Developer Account**: $25 one-time fee - https://play.google.com/console
4. **EAS CLI Installed**: Run `npm install -g eas-cli`

## Step 1: Update Configuration Files

### A. Update app.json

Replace the following placeholders in `app.json`:

1. **Expo Project ID**:
   - Run: `eas init`
   - This will create a project and add the projectId to app.json
   - Or manually add your existing project ID in `extra.eas.projectId`

2. **Bundle Identifiers** (Already updated to):
   - iOS: `com.auraapp.luxury`
   - Android: `com.auraapp.luxury`
   
   **IMPORTANT**: You can change these to your own unique identifiers:
   - Format: `com.yourcompany.appname`
   - Must be unique across all apps
   - Cannot be changed after first release
   - Use lowercase letters, numbers, and dots only

### B. Update eas.json

For iOS submission, update the `submit.production.ios` section:
- `appleId`: Your Apple ID email
- `ascAppId`: Your App Store Connect app ID (get this after creating app in App Store Connect)
- `appleTeamId`: Your Apple Developer Team ID (found in Apple Developer account)

For Android submission:
- Create a service account key in Google Play Console
- Download the JSON file and save as `service-account-key.json` in your project root
- Add this file to `.gitignore` (never commit it!)

## Step 2: Prepare App Store Assets

### Icons
Your current icon is at: `./assets/images/112c7827-2c25-428e-b1c8-66d89163efd7.jpeg`

**Requirements**:
- iOS: 1024x1024 PNG (no transparency, no rounded corners)
- Android: 512x512 PNG (32-bit with alpha)

### Screenshots
You need to take screenshots of your app:

**iOS** (required):
- iPhone 6.7" (iPhone 15 Pro Max): 1290 x 2796 pixels - minimum 3 screenshots
- iPhone 6.5" (iPhone 11 Pro Max): 1242 x 2688 pixels - minimum 3 screenshots

**Android** (required):
- Phone: 1080 x 1920 pixels minimum - 2 to 8 screenshots

**How to take screenshots**:
1. Run your app: `npx expo start`
2. Open on iOS Simulator or Android Emulator
3. Take screenshots of:
   - Main screen with "You Are Rich Today"
   - Language selector modal
   - Notification settings modal
   - Profile screen (if you want to show it)

### Feature Graphic (Android only)
- Size: 1024 x 500 pixels
- Format: JPG or PNG (no transparency)
- Should showcase your app's luxury aesthetic

## Step 3: Create Privacy Policy

A privacy policy is **required** by both app stores.

1. Host the privacy policy on a website (you can use GitHub Pages, Netlify, or your own domain)
2. Update the URL in your app store listings
3. I've created a template in `app-store-assets/PRIVACY_POLICY.md`

## Step 4: Build Your App

### Login to EAS
```bash
eas login
```

### Configure Your Project
```bash
eas init
```

### Build for iOS
```bash
eas build --platform ios --profile production
```

This will:
- Create an IPA file
- Take about 15-30 minutes
- You'll get a download link when complete

### Build for Android
```bash
eas build --platform android --profile production
```

This will:
- Create an AAB (Android App Bundle) file
- Take about 15-30 minutes
- You'll get a download link when complete

## Step 5: Create App Store Listings

### Apple App Store

1. **Go to App Store Connect**: https://appstoreconnect.apple.com
2. **Create a new app**:
   - Click "My Apps" → "+" → "New App"
   - Select iOS
   - Name: "Aura"
   - Primary Language: English
   - Bundle ID: Select `com.auraapp.luxury` (or your custom one)
   - SKU: Can be same as bundle ID
   
3. **Fill in app information**:
   - Use the content from `app-store-assets/STORE_LISTING.md`
   - Upload screenshots
   - Upload app icon (1024x1024)
   - Add description, keywords, etc.
   
4. **Set pricing**: Free (or your preferred pricing)

5. **Upload build**:
   - Download the IPA from EAS
   - Use Transporter app (Mac) or `eas submit` command
   - Or run: `eas submit --platform ios --profile production`

6. **Submit for review**:
   - Answer questionnaires about content
   - Add contact information
   - Submit

**Review time**: Usually 1-3 days

### Google Play Store

1. **Go to Google Play Console**: https://play.google.com/console
2. **Create a new app**:
   - Click "Create app"
   - App name: "Aura"
   - Default language: English
   - App or game: App
   - Free or paid: Free
   
3. **Complete store listing**:
   - Use content from `app-store-assets/STORE_LISTING.md`
   - Upload screenshots (minimum 2)
   - Upload feature graphic (1024x500)
   - Upload app icon (512x512)
   - Add description, category, etc.
   
4. **Set up app content**:
   - Privacy policy URL (required)
   - App access (no login required)
   - Ads (select "No" if you don't have ads)
   - Content rating questionnaire
   - Target audience
   - News app (No)
   
5. **Upload build**:
   - Download the AAB from EAS
   - Go to "Production" → "Create new release"
   - Upload the AAB file
   - Or run: `eas submit --platform android --profile production`
   
6. **Roll out**:
   - Review release
   - Start rollout to production

**Review time**: Usually a few hours to 1 day

## Step 6: Testing Before Submission

### Internal Testing (Recommended)

**iOS**:
```bash
eas build --platform ios --profile preview
```
- Distribute via TestFlight
- Test with real users before production

**Android**:
```bash
eas build --platform android --profile preview
```
- Creates an APK for testing
- Install on test devices

### What to Test:
- [ ] App opens correctly
- [ ] Main screen displays properly
- [ ] Date updates daily
- [ ] Streak counter increments correctly
- [ ] Language selector works
- [ ] All 100+ languages display correctly
- [ ] Notification settings work
- [ ] Notifications are received at set time
- [ ] App works on different screen sizes
- [ ] Dark mode and light mode both work
- [ ] App doesn't crash

## Step 7: Post-Submission

### Monitor Review Status
- **iOS**: Check App Store Connect daily
- **Android**: Check Google Play Console

### Respond to Rejections
If rejected, common reasons:
- Missing privacy policy
- Incomplete metadata
- App crashes
- Misleading content
- Missing functionality

Fix issues and resubmit.

### After Approval

1. **Update app.json** with store URLs:
   - iOS: `ios.appStoreUrl`
   - Android: `android.playStoreUrl`

2. **Promote your app**:
   - Share on social media
   - Create a landing page
   - Reach out to your target audience

## Step 8: Future Updates

When you want to release an update:

1. **Update version numbers** in `app.json`:
   ```json
   {
     "version": "1.0.1",  // Increment this
     "ios": {
       "buildNumber": "2"  // Increment this
     },
     "android": {
       "versionCode": 2  // Increment this
     }
   }
   ```

2. **Build new version**:
   ```bash
   eas build --platform ios --profile production
   eas build --platform android --profile production
   ```

3. **Submit updates**:
   ```bash
   eas submit --platform ios --profile production
   eas submit --platform android --profile production
   ```

## Troubleshooting

### Build Fails
- Check EAS build logs
- Ensure all dependencies are compatible
- Try clearing cache: `eas build --clear-cache`

### Submission Fails
- Verify bundle identifiers match
- Check that all required metadata is filled
- Ensure privacy policy URL is accessible

### App Rejected
- Read rejection reason carefully
- Fix the specific issue mentioned
- Respond to reviewer if needed
- Resubmit

## Important Notes

1. **Bundle Identifiers**: Cannot be changed after first release
2. **Version Numbers**: Must always increase
3. **Privacy Policy**: Must be accessible and accurate
4. **Testing**: Always test thoroughly before submission
5. **Backups**: Keep copies of all builds and assets
6. **Credentials**: Store securely, never commit to git

## Costs Summary

- **Apple Developer Account**: $99/year
- **Google Play Developer Account**: $25 one-time
- **EAS Build**: Free tier includes limited builds, paid plans available
- **Hosting** (for privacy policy): Free options available

## Resources

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policy**: https://play.google.com/about/developer-content-policy/

## Quick Command Reference

```bash
# Login to EAS
eas login

# Initialize project
eas init

# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production

# Build for testing
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Submit to stores
eas submit --platform ios --profile production
eas submit --platform android --profile production

# Check build status
eas build:list

# View project info
eas project:info
```

## Next Steps

1. [ ] Run `eas init` to set up your project
2. [ ] Update bundle identifiers if needed
3. [ ] Create app store accounts
4. [ ] Take screenshots of your app
5. [ ] Create and host privacy policy
6. [ ] Build production versions
7. [ ] Create app store listings
8. [ ] Submit for review
9. [ ] Monitor review status
10. [ ] Celebrate when approved! 🎉

Good luck with your app store submission! Your Aura app is ready to remind the world that they are rich. ✨
