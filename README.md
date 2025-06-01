# Scoreboard

A modern, multilingual scoreboard application built with React, TypeScript, and Capacitor. This project was generated and implemented by AI (GitHub Copilot).

## ✨ Features

- 🎯 **Flexible Scoring System**: Track scores for multiple teams with customizable point values
- 🌍 **Multilingual Support**: Available in 16 languages (English, Vietnamese, Spanish, French, German, Japanese, Korean, Portuguese, Simplified Chinese, Arabic, Hindi, Russian, Italian, Dutch, Thai, Indonesian)
- 📱 **Cross-Platform**: Runs as a web app or native Android application
- ⚙️ **Customizable Settings**: Adjust team names, colors, winning conditions, and scoring rules
- 🔄 **Round-Based Gameplay**: Track multiple rounds with automatic win detection
- 💫 **Modern UI**: Beautiful interface built with Tailwind CSS and Radix UI components
- 🧪 **Well Tested**: Comprehensive test suite with 81+ tests
- 📱 **Progressive Web App**: Installable with offline capabilities

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Internationalization**: i18next with automatic language detection
- **Mobile**: Capacitor for Android deployment
- **Testing**: Vitest with React Testing Library
- **Build Tool**: Vite
- **Validation**: Zod schemas

## 🚀 Quick Start

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- For Android builds: Android Studio

## 📖 Development Guide

### 🌐 Running the App on Web

1. **Install dependencies**:
   ```sh
   npm install
   ```

2. **Start the development server**:
   ```sh
   npm run dev
   ```

3. **Open your browser** and navigate to the local address provided in the terminal (e.g., <http://localhost:5173>).

### 📱 Building and Running as an Android App

1. **(One-time) Initialize Capacitor** if you haven't already:
   ```sh
   npx cap init
   ```
   Configuration:
   - App name: `Scoreboard`
   - App id: `io.github.lelinhtinh.scoreboard`
   - Web dir: `dist`

2. **Build the web app for production**:
   ```sh
   npm run build
   ```

3. **Copy the build output to the native Android project**:
   ```sh
   npx cap copy android
   ```

4. **Open the Android project in Android Studio**:
   ```sh
   npx cap open android
   ```

5. **In Android Studio**:
   - Wait for Gradle sync to complete
   - Connect a device or start an emulator
   - Click **Run** (the green triangle) to install and launch the app
   - To generate APK/AAB for distribution: Go to **Build > Build APK(s)** or **Build Bundle(s)**

## 🧪 Testing

Run the test suite to ensure everything works correctly:

```sh
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui
```

## 🏗️ Building for Production

```sh
# Build for web deployment
npm run build

# Preview the production build
npm run preview

# Deploy to GitHub Pages (if configured)
npm run deploy
```

## 🌍 Supported Languages

The application supports 16 languages with automatic browser language detection:

- 🇺🇸 English
- 🇻🇳 Tiếng Việt (Vietnamese)
- 🇪🇸 Español (Spanish)
- 🇫🇷 Français (French)
- 🇩🇪 Deutsch (German)
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)
- 🇧🇷 Português (Portuguese)
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇸🇦 العربية (Arabic)
- 🇮🇳 हिंदी (Hindi)
- 🇷🇺 Русский (Russian)
- 🇮🇹 Italiano (Italian)
- 🇳🇱 Nederlands (Dutch)
- 🇹🇭 ไทย (Thai)
- 🇮🇩 Bahasa Indonesia (Indonesian)

## 🎮 How to Use

1. **Set up teams**: Configure team names and colors in the settings
2. **Choose scoring system**: Set win conditions and point values
3. **Start playing**: Tap on team scores to increment, long-press to edit manually
4. **Track rounds**: The app automatically tracks rounds and declares winners
5. **Swap teams**: Use the swap button to change team positions
6. **Reset game**: Use the menu to start a new game

## ⚙️ Configuration Options

- **Team Names**: Customize team names (default: Team A, Team B)
- **Team Colors**: Choose from preset color schemes
- **Win Conditions**: Set target score or number of rounds to win
- **Scoring**: Configure point increments and maximum scores
- **Language**: Automatic detection with manual override option

## 💡 Developer Notes

- **Version Management**: The Android app version is automatically synchronized with `package.json`. The build script reads the version and calculates the version code automatically, with reliable fallback values
- **Troubleshooting**: If you get build errors, the system uses fallback values (version 1.2.0, code 10200) and will show debug output during build
- After making changes to the web code, use the convenient commands:
  - `npm run android:build` - Build web app and copy to Android (recommended)
  - Or manually: `npm run build && npx cap copy android`
- To update the app launcher icon, use Android Studio's **Image Asset** tool to replace icons in `android/app/src/main/res/mipmap-*`
- Use the npm scripts for easier development:
  - `npm run android:build` - Build web app and copy to Android
  - `npm run android:open` - Open Android project in Android Studio
  - `npm run cap:sync` - Sync Capacitor plugins and dependencies
- All Capacitor dependencies are already included in `package.json`
- For advanced native features, refer to the [Capacitor documentation](https://capacitorjs.com/docs)
- The project uses TypeScript strict mode for better type safety
- Components are tested with React Testing Library and Vitest
- Translations are managed through JSON files in `src/i18n/locales/`

## 🤝 Contributing

This project was generated and implemented by AI (GitHub Copilot). While I will not handle or respond to any reported issues or bugs (please ask your own AI assistant for help if you encounter problems), **all pull requests (PRs) are welcome and appreciated!**

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works (`npm run test:run`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📂 Project Structure

```text
src/
├── components/         # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── *.tsx           # Feature components
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization
│   └── locales/        # Translation files
├── lib/                # Utility libraries
├── test/               # Test utilities and mocks
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ using React, TypeScript, and AI assistance*
