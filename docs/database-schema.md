# Database Schema - Happy Hour Deals App

## Overview
This database schema is designed to support both local mobile app storage (SQLite) and backend server storage (MySQL/PostgreSQL). The schema accommodates Yelp API data, custom happy hour information, user preferences, and caching requirements.

## Entity Relationship Diagram

```
Users (1) ──── (∞) UserVenues ──── (1) Venues
  │                                    │
  │                                    │
  └── (1:∞) UserPreferences            └── (1:∞) HappyHourSpecials
  └── (1:∞) SearchHistory                  └── (1:∞) MenuItems
  └── (1:∞) Notifications                  └── (1:∞) VenuePhotos
                                           └── (1:∞) VenueReviews
```

## Table Definitions

### 1. Users Table
Stores user account information and authentication data.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_image_url TEXT,
    subscription_status ENUM('free', 'premium') DEFAULT 'free',
    subscription_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_subscription (subscription_status, subscription_expires_at)
);
```

### 2. Venues Table
Stores venue information from Yelp API and custom data.

```sql
CREATE TABLE venues (
    id VARCHAR(255) PRIMARY KEY,           -- Yelp business ID
    name VARCHAR(255) NOT NULL,
    alias VARCHAR(255),                    -- Yelp alias
    image_url TEXT,
    url TEXT,                             -- Yelp business page URL
    rating DECIMAL(2,1),                  -- 0.0 to 5.0
    review_count INTEGER DEFAULT 0,
    price_level INTEGER,                  -- 1-4 ($-$$$$)
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    phone VARCHAR(20),
    display_phone VARCHAR(30),
    distance DECIMAL(8,2),                -- Distance from search point (meters)
    
    -- Business details
    transactions JSON,                    -- ['delivery', 'pickup', 'restaurant_reservation']
    categories JSON,                      -- Array of category objects
    hours JSON,                          -- Operating hours structure
    special_hours JSON,                  -- Holiday/special hours
    attributes JSON,                     -- Business attributes (parking, wifi, etc.)
    
    -- Metadata
    is_claimed BOOLEAN DEFAULT FALSE,     -- Yelp claimed status
    is_closed BOOLEAN DEFAULT FALSE,      -- Permanently closed
    
    -- Cache management
    yelp_last_updated TIMESTAMP,         -- Last Yelp data update
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_location (latitude, longitude),
    INDEX idx_rating (rating),
    INDEX idx_price (price_level),
    INDEX idx_updated (yelp_last_updated),
    INDEX idx_distance (distance)
);
```

### 3. Happy Hour Specials Table
Custom happy hour data not available from Yelp API.

```sql
CREATE TABLE happy_hour_specials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venue_id VARCHAR(255) NOT NULL,
    
    -- Schedule information
    day_of_week ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Special details
    special_type ENUM('draft_beer','cocktails','wine','shots','food','appetizers','desserts') NOT NULL,
    title VARCHAR(255),                   -- e.g., "$3 Draft Beers", "Half Price Appetizers"
    description TEXT,
    
    -- Pricing
    happy_hour_price DECIMAL(8,2),
    regular_price DECIMAL(8,2),
    discount_percentage INTEGER,          -- Alternative to pricing
    
    -- Item specifics
    specific_items JSON,                  -- Array of specific items included
    excluded_items JSON,                  -- Array of excluded items
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    verified_date DATE,                   -- Last verification date
    source ENUM('venue_owner','user_submitted','staff_verified','scraped') DEFAULT 'user_submitted',
    created_by INTEGER,                   -- User ID who created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    
    INDEX idx_venue_day (venue_id, day_of_week),
    INDEX idx_time_range (start_time, end_time),
    INDEX idx_type (special_type),
    INDEX idx_active (is_active),
    UNIQUE KEY unique_venue_schedule (venue_id, day_of_week, start_time, end_time, special_type)
);
```

### 4. Menu Items Table
Detailed menu information for drinks and food.

```sql
CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venue_id VARCHAR(255) NOT NULL,
    category ENUM('draft_beer','bottled_beer','cocktails','wine','spirits','food','appetizers','desserts') NOT NULL,
    
    -- Item details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    
    -- Pricing
    regular_price DECIMAL(8,2),
    happy_hour_price DECIMAL(8,2),
    size_options JSON,                    -- e.g., ["12oz", "16oz", "pitcher"]
    
    -- Beverage-specific fields
    abv DECIMAL(4,2),                    -- Alcohol by volume
    beer_style VARCHAR(100),             -- IPA, Lager, etc.
    brewery VARCHAR(100),
    wine_type VARCHAR(50),               -- Red, White, Rosé, Sparkling
    wine_region VARCHAR(100),
    cocktail_ingredients JSON,           -- Array of ingredients
    
    -- Food-specific fields
    calories INTEGER,
    allergens JSON,                      -- Array of allergen information
    dietary_restrictions JSON,           -- vegetarian, vegan, gluten-free, etc.
    spice_level INTEGER,                 -- 1-5 scale
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    seasonal BOOLEAN DEFAULT FALSE,
    happy_hour_only BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    
    INDEX idx_venue_category (venue_id, category),
    INDEX idx_available (is_available),
    INDEX idx_happy_hour (happy_hour_only),
    INDEX idx_price (regular_price)
);
```

### 5. User Venues Table
User interactions with venues (favorites, visits, ratings).

```sql
CREATE TABLE user_venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    venue_id VARCHAR(255) NOT NULL,
    
    -- User interactions
    is_favorite BOOLEAN DEFAULT FALSE,
    visit_count INTEGER DEFAULT 0,
    last_visited TIMESTAMP,
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    user_review TEXT,
    
    -- Personalization data
    preferred_happy_hour_times JSON,     -- User's preferred times for this venue
    favorite_menu_items JSON,           -- Array of favorite menu item IDs
    notes TEXT,                         -- Private user notes
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    
    PRIMARY KEY (user_id, venue_id),
    INDEX idx_favorites (user_id, is_favorite),
    INDEX idx_visited (user_id, last_visited)
);
```

### 6. User Preferences Table
User app preferences and settings.

```sql
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    
    -- Location preferences
    default_radius INTEGER DEFAULT 25,   -- Miles
    home_latitude DECIMAL(10,8),
    home_longitude DECIMAL(11,8),
    work_latitude DECIMAL(10,8),
    work_longitude DECIMAL(11,8),
    
    -- Search preferences
    preferred_categories JSON,           -- Array of preferred venue categories
    preferred_price_levels JSON,         -- Array of preferred price levels [1,2,3,4]
    minimum_rating DECIMAL(2,1) DEFAULT 3.0,
    
    -- Happy hour preferences
    preferred_days JSON,                 -- Array of preferred days
    preferred_times JSON,                -- Array of time ranges
    drink_preferences JSON,              -- Array of preferred drink types
    food_preferences JSON,               -- Array of preferred food types
    
    -- Notification preferences
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    location_based_alerts BOOLEAN DEFAULT TRUE,
    time_based_alerts BOOLEAN DEFAULT TRUE,
    favorite_venue_alerts BOOLEAN DEFAULT TRUE,
    new_venue_alerts BOOLEAN DEFAULT FALSE,
    promotional_notifications BOOLEAN DEFAULT FALSE,
    
    -- App preferences
    preferred_view ENUM('list','map') DEFAULT 'list',
    distance_unit ENUM('miles','kilometers') DEFAULT 'miles',
    theme ENUM('light','dark','auto') DEFAULT 'auto',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_prefs (user_id)
);
```

### 7. Search History Table
Track user search patterns for personalization.

```sql
CREATE TABLE search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    
    -- Search parameters
    search_query VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    radius INTEGER,
    categories JSON,
    price_levels JSON,
    sort_by VARCHAR(50),
    
    -- Results metadata
    results_count INTEGER DEFAULT 0,
    clicked_venue_id VARCHAR(255),
    
    -- Metadata
    search_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (clicked_venue_id) REFERENCES venues(id),
    
    INDEX idx_user_timestamp (user_id, search_timestamp),
    INDEX idx_location (latitude, longitude)
);
```

### 8. Notifications Table
Store notification history and pending notifications.

```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    
    -- Notification details
    type ENUM('location_based','time_based','favorite_venue','new_venue','promotional') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related data
    venue_id VARCHAR(255),
    happy_hour_special_id INTEGER,
    
    -- Delivery details
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    -- Status
    status ENUM('pending','sent','delivered','opened','clicked','failed') DEFAULT 'pending',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    FOREIGN KEY (happy_hour_special_id) REFERENCES happy_hour_specials(id),
    
    INDEX idx_user_status (user_id, status),
    INDEX idx_scheduled (scheduled_for),
    INDEX idx_type (type)
);
```

### 9. Cache Management Table
Track cached data expiration and management.

```sql
CREATE TABLE cache_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    cache_type ENUM('search_results','venue_details','menu_data','reviews','photos') NOT NULL,
    data JSON,
    
    -- Expiration management
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 1,
    
    INDEX idx_expiry (expires_at),
    INDEX idx_type (cache_type),
    INDEX idx_accessed (last_accessed)
);
```

### 10. Venue Photos Table
Store venue photo information from various sources.

```sql
CREATE TABLE venue_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venue_id VARCHAR(255) NOT NULL,
    
    -- Photo details
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    
    -- Source information
    source ENUM('yelp','foursquare','user_uploaded','venue_owner') NOT NULL,
    source_id VARCHAR(255),              -- Original photo ID from source
    
    -- Categorization
    photo_type ENUM('exterior','interior','food','drinks','menu','other') DEFAULT 'other',
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER,                 -- User ID if user uploaded
    is_verified BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    
    INDEX idx_venue (venue_id),
    INDEX idx_primary (venue_id, is_primary),
    INDEX idx_type (photo_type)
);
```

### 11. Venue Reviews Table (Cached from Yelp)
Store cached review data from Yelp API.

```sql
CREATE TABLE venue_reviews (
    id VARCHAR(255) PRIMARY KEY,         -- Yelp review ID
    venue_id VARCHAR(255) NOT NULL,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text TEXT,                          -- Review excerpt from Yelp
    full_review_url TEXT,               -- Link to full review on Yelp
    
    -- Reviewer information
    reviewer_name VARCHAR(255),
    reviewer_image_url TEXT,
    reviewer_profile_url TEXT,
    
    -- Timestamps
    review_created_at TIMESTAMP,        -- When review was created on Yelp
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    
    INDEX idx_venue_rating (venue_id, rating),
    INDEX idx_review_date (venue_id, review_created_at)
);
```

## Data Migration and Seeding

### Initial Data Population
```sql
-- Insert default categories for happy hour specials
INSERT INTO app_metadata (key_name, value_json) VALUES 
('drink_categories', '["draft_beer","bottled_beer","cocktails","wine","spirits","shots"]'),
('food_categories', '["appetizers","small_plates","tacos","wings","nachos","sliders"]'),
('price_levels', '[{"level":1,"symbol":"$","description":"Under $10"},{"level":2,"symbol":"$$","description":"$10-20"},{"level":3,"symbol":"$$$","description":"$20-30"},{"level":4,"symbol":"$$$$","description":"Above $30"}]');
```

## Performance Optimization

### Indexes Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_venue_location_rating ON venues(latitude, longitude, rating);
CREATE INDEX idx_happy_hour_active_time ON happy_hour_specials(is_active, day_of_week, start_time, end_time);
CREATE INDEX idx_user_venue_favorite_updated ON user_venues(user_id, is_favorite, updated_at);

-- Full-text search indexes
CREATE FULLTEXT INDEX idx_venue_name_search ON venues(name);
CREATE FULLTEXT INDEX idx_menu_item_search ON menu_items(name, description);
```

### Cache Cleanup Procedures
```sql
-- Stored procedure to clean expired cache entries
DELIMITER //
CREATE PROCEDURE CleanExpiredCache()
BEGIN
    DELETE FROM cache_entries WHERE expires_at < NOW();
    DELETE FROM venue_reviews WHERE cached_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
END //
DELIMITER ;
```

## Data Validation Rules

### Business Rules
1. Happy hour specials must have start_time < end_time
2. User ratings must be between 1 and 5
3. Venue coordinates must be valid latitude/longitude
4. Cache entries must have future expiration dates
5. Premium subscriptions must have valid expiration dates

### Constraints
```sql
-- Add check constraints
ALTER TABLE happy_hour_specials 
ADD CONSTRAINT chk_time_order CHECK (start_time < end_time);

ALTER TABLE users 
ADD CONSTRAINT chk_subscription_logic 
CHECK (
    (subscription_status = 'free' AND subscription_expires_at IS NULL) OR
    (subscription_status = 'premium' AND subscription_expires_at IS NOT NULL)
);
```

This comprehensive database schema supports all the features required for the Happy Hour Deals app while maintaining data integrity, performance, and scalability.