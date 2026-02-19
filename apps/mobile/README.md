# LoadDrop Mobile (Expo)

Run: `npx expo start`

## App Store prep

1. Add assets to `assets/`: `icon.png` (1024x1024), `splash-icon.png`, `adaptive-icon.png`, `favicon.png`.
2. Configure `app.json`: bump `version`, set `ios.bundleIdentifier` and `android.package`.
3. Install EAS: `npm i -g eas-cli` and run `eas build --platform all` (requires Expo account).
4. Optional: Add `expo-camera` for listing photos, `expo-notifications` for push, `expo-local-authentication` for biometrics, `expo-haptics` for feedback.
