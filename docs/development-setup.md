# Happy Hour Deals App - Development Setup Guide

This guide will help you set up the development environment for the Happy Hour Deals mobile app.

## Prerequisites

### System Requirements
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **React Native CLI**: Latest version
- **Git**: For version control

### Platform-Specific Requirements

#### iOS Development
- **macOS**: Required for iOS development
- **Xcode**: Latest version from Mac App Store
- **iOS Simulator**: Included with Xcode
- **CocoaPods**: For iOS dependency management

#### Android Development
- **Android Studio**: Latest version
- **Android SDK**: API level 29 or higher
- **Java Development Kit (JDK)**: Version 11 or higher
- **Android Virtual Device (AVD)**: For testing

## Installation Steps

### 1. Clone the Repository
```bash
git clone [repository-url]
cd happy-hour-app
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Yelp Fusion API
YELP_API_KEY=your_yelp_api_key_here

# Custom Backend API (optional)
REACT_APP_API_URL=http://localhost:3000/api

# Development settings
NODE_ENV=development
DEBUG=true
```

**Important**: Never commit your `.env` file to version control.

### 4. API Setup

Follow the [Yelp API Setup Guide](./yelp-api-setup.md) to obtain your API credentials.

### 5. Development Tools Setup

#### ESLint and Prettier
Configuration files are already included:
- `.eslintrc.js`
- `.prettierrc`

#### TypeScript
The project uses TypeScript with configuration in `tsconfig.json`.

#### Flipper (Optional)
For advanced debugging, install [Flipper](https://fbflipper.com/).

## Running the App

### Development Mode

#### iOS
```bash
# Start Metro bundler
npm start

# Run on iOS simulator (in a new terminal)
npm run ios

# Or run on specific simulator
npx react-native run-ios --simulator="iPhone 14"
```

#### Android
```bash
# Start Metro bundler
npm start

# Run on Android emulator (in a new terminal)
npm run android

# Or run on connected device
npx react-native run-android --device
```

### Build for Production

#### iOS
```bash
# Build release version
npm run build:ios

# Or use Xcode for more control
open ios/HappyHourDeals.xcworkspace
```

#### Android
```bash
# Build release APK
npm run build:android

# Build release bundle (for Play Store)
cd android && ./gradlew bundleRelease
```

## Project Structure Overview

```
happy-hour-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Generic components
│   │   ├── venue/          # Venue-specific components
│   │   ├── search/         # Search components
│   │   └── menu/           # Menu display components
│   ├── screens/            # App screens
│   │   ├── auth/           # Authentication screens
│   │   ├── main/           # Main app screens
│   │   ├── venue/          # Venue detail screens
│   │   └── profile/        # User profile screens
│   ├── navigation/         # Navigation configuration
│   ├── store/              # Redux store and slices
│   ├── services/           # API and external services
│   ├── utils/              # Utilities and helpers
│   └── assets/             # Images, fonts, static files
├── docs/                   # Documentation
├── tests/                  # Test files
└── config/                 # Configuration files
```

## Key Features Implemented

### ✅ Completed Features
- **Retro-Modern Design System**: Custom color palette and typography
- **Redux Store Architecture**: Complete state management setup
- **Yelp API Integration**: Service layer for restaurant data
- **Authentication Flow**: Login/register with Redux integration
- **Database Schema**: Comprehensive data structure design
- **Component Library**: Reusable retro-themed components

### 🚧 In Development
- **Location Services**: GPS integration and location permissions
- **Search Interface**: Venue search with filters
- **Map Integration**: Interactive map with venue markers
- **Venue Details**: Detailed venue information display

### 📋 Planned Features
- **Happy Hour Data**: Custom API for happy hour specials
- **Menu Display**: Draft beer and cocktail listings
- **Push Notifications**: Location and time-based alerts
- **Premium Features**: Subscription model and premium content

## Development Guidelines

### Code Style
- Follow the established TypeScript patterns
- Use the retro-modern design system consistently
- Implement proper error handling
- Write tests for critical functionality

### Git Workflow
1. Create feature branches from `main`
2. Use descriptive commit messages
3. Test on both iOS and Android before merging
4. Review code changes with team members

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (when implemented)
npm run test:e2e
```

### Debugging

#### React Native Debugger
1. Install React Native Debugger
2. Enable debugging in the app (Cmd+D on iOS, Cmd+M on Android)
3. Select "Debug JS Remotely"

#### Flipper Integration
1. Open Flipper
2. Connect your device/simulator
3. View logs, network requests, and Redux state

## API Integration

### Yelp Fusion API
- **Base URL**: `https://api.yelp.com/v3`
- **Authentication**: Bearer token
- **Rate Limits**: 300-5000 calls/day depending on plan
- **Documentation**: See `docs/api-integration-strategy.md`

### Custom Backend (Future)
- **Base URL**: `http://localhost:3000/api`
- **Purpose**: Happy hour specific data
- **Features**: Menu items, specials, user preferences

## Performance Optimization

### Image Optimization
- Use `react-native-fast-image` for better caching
- Implement lazy loading for venue images
- Optimize image sizes for mobile screens

### API Optimization
- Implement intelligent caching strategies
- Use request batching where possible
- Add offline support for critical features

### Bundle Size
- Analyze bundle size with `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-bundle.js --analyze`
- Remove unused dependencies
- Use dynamic imports for large components

## Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear cache and restart
npx react-native start --reset-cache
```

#### iOS Build Issues
```bash
# Clean Xcode build
cd ios && xcodebuild clean && cd ..

# Reinstall pods
cd ios && pod deintegrate && pod install && cd ..
```

#### Android Build Issues
```bash
# Clean Gradle build
cd android && ./gradlew clean && cd ..

# Reset React Native
npx react-native run-android --reset-cache
```

#### Module Resolution Issues
```bash
# Clear all caches
rm -rf node_modules
rm package-lock.json
npm install
```

### Environment Issues

1. **Node Version**: Use Node Version Manager (nvm) to manage versions
2. **Python Issues**: Ensure Python 2.7 is available for some native modules
3. **Permissions**: Check file permissions for build directories

## Deployment

### iOS Deployment
1. Configure signing certificates in Xcode
2. Set up App Store Connect
3. Archive and upload through Xcode

### Android Deployment
1. Generate signing key for production
2. Configure Play Store Console
3. Upload AAB file through console

## Resources

### Documentation Links
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Yelp Fusion API Documentation](https://www.yelp.com/developers/documentation/v3)
- [React Navigation Documentation](https://reactnavigation.org/)

### Design Resources
- [Retro-Modern Color Palette](./colors.md)
- [Typography System](./typography.md)
- [Component Guidelines](./components.md)

### Community
- [React Native Community Discord](https://discord.gg/react-native)
- [Stack Overflow - React Native](https://stackoverflow.com/questions/tagged/react-native)
- [GitHub Issues](https://github.com/your-repo/issues)

## Support

For development support:
1. Check existing documentation
2. Search GitHub issues
3. Ask in team Slack/Discord
4. Create detailed bug reports with reproduction steps

Happy coding! 🍺📱