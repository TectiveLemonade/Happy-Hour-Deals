# Happy Hour Deals Mobile App

A cross-platform mobile application that helps users discover nearby happy hour deals at restaurants and bars using location-based services and the Yelp Fusion API.

## Project Overview

This app provides users with real-time access to happy hour deals within customizable radius distances (10, 25, 50 miles), featuring detailed menu information for draft beers, cocktails, and food specials.

## Features

### Core Features
- Location-based happy hour discovery
- Customizable search radius (10, 25, 50 miles)
- Restaurant and bar details with ratings and reviews
- Menu integration with draft beer and cocktail specials
- Map and list view for venue discovery
- Offline caching for seamless experience

### Premium Features
- Extended search radius beyond 50 miles
- Ad-free experience
- Exclusive partnership deals
- Advanced filtering options
- Priority customer support

## Technical Architecture

### Technology Stack
- **Framework**: React Native (cross-platform)
- **API Integration**: Yelp Fusion API
- **Location Services**: @react-native-community/geolocation
- **Maps**: react-native-maps
- **Storage**: @react-native-async-storage/async-storage
- **Notifications**: react-native-push-notification

### API Integration Strategy
- **Primary**: Yelp Fusion API for business discovery and details
- **Backup**: Foursquare Places API for additional coverage
- **Supplementary**: Manual data curation for happy hour specifics
- **Rate Limiting**: Intelligent caching and request optimization

## Project Structure

```
happy-hour-app/
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/             # App screens/pages
│   ├── services/            # API integration and data services
│   ├── utils/               # Helper functions and utilities
│   ├── navigation/          # App navigation configuration
│   └── assets/              # Images, fonts, and static resources
├── docs/                    # Project documentation
├── tests/                   # Test files
└── config/                  # Configuration files
```

## Development Phases

### Phase 1: Technical Foundation (Weeks 1-3)
- Yelp API integration and authentication
- App architecture design
- Database schema creation
- Core project setup

### Phase 2: MVP Development (Weeks 4-10)
- Location services implementation
- Basic search and results display
- User interface components
- Offline caching system

### Phase 3: Enhanced Features (Weeks 8-14)
- Detailed menu integration
- Push notifications
- User personalization
- Social features

### Phase 4: Monetization (Weeks 12-18)
- Premium subscription model
- Restaurant partnerships
- Advanced features
- Analytics and optimization

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Yelp Fusion API credentials

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd happy-hour-app

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run the app
npm run ios     # for iOS
npm run android # for Android
```

## API Documentation

### Yelp Fusion API Integration
- **Rate Limits**: 5,000 calls/day (free tier)
- **Authentication**: Bearer token
- **Key Endpoints**:
  - `/businesses/search` - Location-based venue discovery
  - `/businesses/{id}` - Detailed business information
  - `/businesses/{id}/reviews` - Customer reviews
  - `/businesses/{id}/photos` - Venue photos

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.