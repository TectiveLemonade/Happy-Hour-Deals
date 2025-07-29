# Yelp Fusion API Setup Guide

This guide will walk you through obtaining and configuring Yelp Fusion API credentials for the Happy Hour Deals app.

## Step 1: Create a Yelp Developer Account

1. Go to the [Yelp Developers website](https://www.yelp.com/developers)
2. Click "Create App" or "Get Started"
3. Sign in with your existing Yelp account or create a new one
4. Complete your developer profile if prompted

## Step 2: Create a New App

1. Once logged in, navigate to "Manage App" or click "Create New App"
2. Fill out the application form:
   - **App Name**: Happy Hour Deals (or your preferred name)
   - **Industry**: Food & Beverages
   - **Company**: Your company name or personal name
   - **Website**: Your app's website or GitHub repository
   - **Description**: A mobile app for discovering happy hour deals at nearby restaurants and bars
   - **Why do you need access to the API?**: To provide users with real-time restaurant and bar information for happy hour discovery

3. Agree to the terms of service and submit your application

## Step 3: Get Your API Key

1. After approval (usually instant), you'll be redirected to your app dashboard
2. Copy your **API Key** - this is your Bearer token for authentication
3. Note your rate limits:
   - **Free Tier**: 300 calls per day
   - **Trial**: 5,000 calls per day (limited time)

## Step 4: Configure the App

### Environment Variables

Create a `.env` file in your project root and add your API key:

```bash
# Yelp Fusion API
YELP_API_KEY=your_api_key_here

# Optional: Custom backend API
REACT_APP_API_URL=http://localhost:3000/api
```

### React Native Config

If using `react-native-config`, add to your `.env` file:

```bash
YELP_API_KEY=your_api_key_here
```

### iOS Configuration

For iOS, you may need to add the API key to your `Info.plist`:

```xml
<key>YelpAPIKey</key>
<string>$(YELP_API_KEY)</string>
```

### Android Configuration

For Android, add to your `gradle.properties`:

```properties
YELP_API_KEY=your_api_key_here
```

## Step 5: Test Your Setup

### Using the API Service

```typescript
import YelpAPI from '@services/api/yelpApi';

// Initialize with your API key
const yelpApi = new YelpAPI(process.env.YELP_API_KEY);

// Test search
const testSearch = async () => {
  try {
    const results = await yelpApi.searchBusinesses({
      latitude: 37.7749,
      longitude: -122.4194,
      categories: 'bars,restaurants',
      limit: 10,
    });
    
    console.log('Search successful:', results.businesses.length, 'venues found');
  } catch (error) {
    console.error('Search failed:', error.message);
  }
};
```

## API Limits and Best Practices

### Rate Limits
- **Free Tier**: 300 calls/day
- **Starter Plan**: $7.99 for 1,000 calls
- **Professional Plan**: $25 for 5,000 calls
- **Premium Plan**: $75 for 25,000 calls

### Optimization Strategies
1. **Implement Caching**: Cache results for 2-24 hours depending on data type
2. **Batch Requests**: Get maximum results per API call (up to 50)
3. **Smart Prefetching**: Load popular venues during off-peak hours
4. **Use Geolocation Wisely**: Larger search radius = more results per call

### Required Attribution

You must display Yelp attribution as required by their terms:

```jsx
// Example attribution component
const YelpAttribution = () => (
  <View style={styles.attribution}>
    <Text style={styles.attributionText}>
      Powered by{' '}
      <Text 
        style={styles.link}
        onPress={() => Linking.openURL('https://www.yelp.com')}
      >
        Yelp
      </Text>
    </Text>
  </View>
);
```

## Available API Endpoints

### 1. Business Search
- **Endpoint**: `/businesses/search`
- **Purpose**: Find businesses by location and criteria
- **Rate Impact**: 1 call per request
- **Max Results**: 50 per call, 1000 total

### 2. Business Details
- **Endpoint**: `/businesses/{id}`
- **Purpose**: Get detailed information about a specific business
- **Rate Impact**: 1 call per business
- **Includes**: Hours, photos, reviews, attributes

### 3. Business Reviews
- **Endpoint**: `/businesses/{id}/reviews`
- **Purpose**: Get up to 3 review excerpts
- **Rate Impact**: 1 call per business
- **Limitation**: Excerpt only, full reviews redirect to Yelp

### 4. Business Photos (Premium)
- **Endpoint**: `/businesses/{id}/photos`
- **Purpose**: Get additional business photos
- **Rate Impact**: 1 call per business
- **Requirement**: Professional or Premium plan

## Error Handling

Common errors and solutions:

### 400 Bad Request
```javascript
// Check your parameters
{
  "error": {
    "code": "VALIDATION_ERROR",
    "description": "Please specify a location or latitude and longitude"
  }
}
```

### 401 Unauthorized
```javascript
// Invalid API key
{
  "error": {
    "code": "TOKEN_INVALID",
    "description": "API access denied"
  }
}
```

### 429 Too Many Requests
```javascript
// Rate limit exceeded
{
  "error": {
    "code": "ACCESS_LIMIT_REACHED",
    "description": "You've reached the access limit for this endpoint"
  }
}
```

## Testing Your Integration

### Test Search Parameters
```javascript
const testParams = {
  // Required
  latitude: 37.7749,
  longitude: -122.4194,
  
  // Optional filters
  term: 'happy hour',
  categories: 'bars,restaurants,nightlife',
  price: '1,2,3',
  radius: 1609, // 1 mile in meters
  sort_by: 'distance',
  limit: 20,
  open_now: true,
};
```

### Verify Response Format
```javascript
const expectedResponse = {
  businesses: [
    {
      id: "business-id",
      name: "Business Name",
      image_url: "https://...",
      is_closed: false,
      url: "https://www.yelp.com/biz/...",
      review_count: 100,
      categories: [{alias: "bars", title: "Bars"}],
      rating: 4.5,
      coordinates: {latitude: 37.7749, longitude: -122.4194},
      transactions: ["delivery"],
      price: "$$",
      location: {
        address1: "123 Main St",
        city: "San Francisco",
        zip_code: "94102",
        country: "US",
        state: "CA",
      },
      phone: "+14155551234",
      display_phone: "(415) 555-1234",
      distance: 150.23
    }
  ],
  total: 500,
  region: {
    center: {longitude: -122.4194, latitude: 37.7749}
  }
};
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is copied correctly
   - Check that your app is approved
   - Ensure you're using Bearer token authentication

2. **No Results Returned**
   - Check latitude/longitude coordinates
   - Verify location has businesses in the specified categories
   - Try expanding search radius

3. **Rate Limit Hit Early**
   - Implement caching to reduce API calls
   - Check for duplicate requests
   - Consider upgrading your plan

4. **CORS Issues (Web Development)**
   - Yelp API requires server-side calls
   - Use a proxy server or backend API

### Contact Support

If you encounter issues:
- Check the [Yelp Developers FAQ](https://www.yelp.com/developers/faq)
- Post in the [Yelp Developer Forum](https://www.yelp.com/developers/support)
- Email developer support at fusion@yelp.com

## Next Steps

After setting up the Yelp API:

1. **Implement Custom Backend**: For happy hour specific data
2. **Add Image Caching**: To improve performance
3. **Set Up Analytics**: To track API usage
4. **Plan for Scale**: Monitor usage and upgrade as needed
5. **Add Error Handling**: For production-ready error management

Remember to never commit your API keys to version control. Use environment variables and add your `.env` file to `.gitignore`.