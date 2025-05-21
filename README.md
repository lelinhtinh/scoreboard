# Scoreboard

This project was generated and implemented by AI (GitHub Copilot). I will not handle or respond to any reported issues or bugs—please ask your own AI assistant for help if you encounter problems.

However, all pull requests (PRs) are welcome and appreciated!

## Development Guide

### Running the App on Web

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the development server:

   ```sh
   npm run dev
   ```

3. Open your browser and navigate to the local address provided in the terminal (e.g., <http://localhost:5173>).

### Building and Running as an Android App

1. (One-time) Initialize Capacitor if you haven't already:

   ```sh
   npx cap init
   ```
   - App name: Scoreboard
   - App id: io.github.lelinhtinh.scoreboard
   - Web dir: dist

2. Build the web app for production:

   ```sh
   npm run build
   ```

3. Copy the build output to the native Android project:

   ```sh
   npx cap copy android
   ```

4. Open the Android project in Android Studio:

   ```sh
   npx cap open android
   ```

5. In Android Studio:
   - Wait for Gradle sync to complete.
   - Connect a device or start an emulator.
   - Click **Run** (the green triangle) to install and launch the app.
   - To generate APK/AAB for distribution: Go to **Build > Build APK(s)** or **Build Bundle(s)**.

#### Notes for Developers

- After making changes to the web code, always repeat steps 2 and 3 before running or building the Android app again.
- To update the app launcher icon, use Android Studio's **Image Asset** tool to replace icons in `android/app/src/main/res/mipmap-*`.
- All Capacitor dependencies are already included in `package.json`.
- For advanced native features, refer to the [Capacitor documentation](https://capacitorjs.com/docs).
