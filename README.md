# Flash Cards Mobile App

A React Native mobile application for learning English and Polish vocabulary with Russian translations. The app features interactive flash cards with context examples and progress tracking.

## Features

- **Dual Language Support**: Switch between English and Polish vocabulary sets
- **Interactive Flash Cards**: Tap to flip cards and reveal translations
- **Context Examples**: View usage examples with Russian translations
- **Progress Tracking**: Mark words as learned/unlearned and track your progress
- **Search & Filter**: Find specific words and filter by learned status
- **Offline Support**: All data is stored locally for offline use
- **Beautiful UI**: Modern, intuitive interface with smooth animations

## Screenshots

The app includes three main screens:
1. **Home Screen**: Language selection and progress overview
2. **Learning Screen**: Interactive flash card learning with navigation
3. **Word List Screen**: Complete vocabulary list with search and filtering

## Installation & Setup

### Prerequisites

- Node.js (>= 18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flash-cards-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Development Mode

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS** (macOS only)
   ```bash
   npm run ios
   ```

### Building for Production

#### Android APK

1. **Generate a signed APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **The APK will be located at:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

#### Android App Bundle (AAB)

1. **Generate an app bundle**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. **The AAB will be located at:**
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FlashCard.tsx   # Individual flash card component
│   ├── CardNavigator.tsx # Navigation between cards
│   ├── WordList.tsx    # Vocabulary list component
│   ├── LanguageSelector.tsx # Language selection
│   └── Header.tsx      # Navigation header
├── screens/            # Main app screens
│   ├── HomeScreen.tsx  # Main entry point
│   ├── LearningScreen.tsx # Flash card learning
│   └── WordListScreen.tsx # Complete word list
├── services/           # Business logic and data handling
│   ├── csvParser.ts    # CSV parsing utilities
│   ├── csvLoader.ts    # CSV data loading
│   └── storage.ts      # Local storage management
└── types/              # TypeScript type definitions
    └── index.ts        # App-wide type definitions
```

## Data Structure

The app uses CSV files for vocabulary data with the following structure:

```csv
Item,Translation,Context,Context translation
annual,годовой,annual payment for life,ежегодный пожизненный платеж
```

- **Item**: The word in English or Polish
- **Translation**: Russian translation
- **Context**: Usage example (optional)
- **Context translation**: Russian translation of the context (optional)

## Key Features Explained

### Flash Card Learning
- Tap cards to flip between word and translation
- View context examples when available
- Mark words as learned/unlearned
- Navigate between cards with progress tracking

### Word Management
- Search through all vocabulary
- Filter by learned/unlearned status
- View complete word list with translations
- Quick access to mark words as learned

### Offline Functionality
- All vocabulary data is parsed and stored locally
- No internet connection required after initial setup
- Progress and learned status persist between sessions

## Customization

### Adding New Vocabulary

1. **Update CSV data** in `src/services/csvLoader.ts`
2. **Add new words** following the existing format
3. **Rebuild the app** to include new vocabulary

### Styling

The app uses a consistent design system with:
- Primary color: `#2196f3` (blue)
- Success color: `#4CAF50` (green)
- Warning color: `#FF5722` (red)
- Background: `#f8f9fa` (light gray)

### Localization

The app supports multiple languages for the interface. To add new languages:
1. Create translation files
2. Update the language selection logic
3. Add new vocabulary sets

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start -- --reset-cache
   ```

2. **Android build issues**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS build issues**
   ```bash
   cd ios && pod deintegrate && pod install && cd ..
   ```

### Performance Tips

- The app is optimized for smooth animations and fast navigation
- Large vocabulary sets are handled efficiently with lazy loading
- Local storage operations are asynchronous to prevent UI blocking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
