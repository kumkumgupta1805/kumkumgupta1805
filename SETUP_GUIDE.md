# Setup Guide - Swasthya Sathi

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
4. Enable Firestore:
   - Go to Firestore Database
   - Create database (start in test mode for development)
5. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll down to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Copy the config object

6. Update `src/services/firebaseConfig.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
   };
   ```

### 3. Firestore Security Rules (for production)

Update your Firestore rules to secure user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

### 5. Test Accounts

After running the app:
1. Create a Patient account (Sign Up → Select "Patient")
2. Create a Doctor account (Sign Up → Select "Doctor")

The app will automatically route users based on their role.

## Assets

The app references these assets in `app.json`:
- `./assets/icon.png` (1024x1024)
- `./assets/splash.png` (1242x2436 recommended)
- `./assets/adaptive-icon.png` (Android, 1024x1024)
- `./assets/favicon.png` (Web, 48x48)

You can create placeholder images or use Expo's default assets generator.

## Troubleshooting

### Firebase Connection Issues
- Ensure your Firebase project has Authentication and Firestore enabled
- Double-check the config values in `firebaseConfig.ts`
- Verify your internet connection

### Navigation Issues
- Ensure all dependencies are installed: `npm install`
- Clear cache: `expo start -c`

### TypeScript Errors
- Run `npx tsc --noEmit` to check for type errors
- Ensure all imports are correct

## Next Steps (Phase 3)

Replace mock API functions in `src/services/api.ts` with actual AWS API calls:
- `getLatestVitals()`
- `getWeeklyVitals()`
- `getAlertLogs()`
- `deactivateBuzzer()`
- `getDoctorPatients()`

