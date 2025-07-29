import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '@constants/colors';
import {typography} from '@constants/typography';

const {width: screenWidth} = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32;

interface RetroVenueCardProps {
  venue: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    priceLevel?: number;
    distance?: number;
    imageUrl?: string;
    categories: Array<{
      alias: string;
      title: string;
    }>;
    address: {
      line1?: string;
      city?: string;
      state?: string;
    };
  };
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
  showHappyHourBadge?: boolean;
  happyHourText?: string;
}

const RetroVenueCard: React.FC<RetroVenueCardProps> = ({
  venue,
  onPress,
  onFavoritePress,
  isFavorite,
  showHappyHourBadge = false,
  happyHourText = 'Happy Hour Now',
}) => {
  const renderPriceLevel = () => {
    if (!venue.priceLevel) return null;
    
    const priceColor = colors.price[`level${venue.priceLevel}` as keyof typeof colors.price];
    const dollarSigns = '$'.repeat(venue.priceLevel);
    
    return (
      <View style={[styles.priceLevel, {borderColor: priceColor}]}>
        <Text style={[styles.priceLevelText, {color: priceColor}]}>
          {dollarSigns}
        </Text>
      </View>
    );
  };

  const renderRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <Icon name="star" size={16} color={colors.rating.star} />
        <Text style={styles.ratingText}>{venue.rating.toFixed(1)}</Text>
        <Text style={styles.reviewCountText}>({venue.reviewCount})</Text>
      </View>
    );
  };

  const renderDistance = () => {
    if (!venue.distance) return null;
    
    const distanceInMiles = (venue.distance / 1609.34).toFixed(1);
    
    return (
      <View style={styles.distanceContainer}>
        <Icon name="location-on" size={14} color={colors.text.secondary} />
        <Text style={styles.distanceText}>{distanceInMiles} mi</Text>
      </View>
    );
  };

  const renderCategories = () => {
    const displayCategories = venue.categories.slice(0, 2);
    
    return (
      <View style={styles.categoriesContainer}>
        {displayCategories.map((category, index) => (
          <View key={category.alias} style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category.title}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderHappyHourBadge = () => {
    if (!showHappyHourBadge) return null;
    
    return (
      <LinearGradient
        colors={colors.background.gradient.neon}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.happyHourBadge}
      >
        <Icon name="local-bar" size={12} color={colors.text.inverse} />
        <Text style={styles.happyHourText}>{happyHourText}</Text>
      </LinearGradient>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {venue.imageUrl ? (
            <Image
              source={{uri: venue.imageUrl}}
              style={styles.venueImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="restaurant" size={32} color={colors.text.tertiary} />
            </View>
          )}
          
          {/* Overlay Elements */}
          <TouchableOpacity
            onPress={onFavoritePress}
            style={styles.favoriteButton}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          >
            <View style={styles.favoriteIconContainer}>
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={20}
                color={isFavorite ? colors.status.error : colors.text.inverse}
              />
            </View>
          </TouchableOpacity>
          
          {renderHappyHourBadge()}
          {renderPriceLevel()}
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.venueName} numberOfLines={1}>
              {venue.name}
            </Text>
            {renderDistance()}
          </View>

          <View style={styles.metadata}>
            {renderRating()}
            {renderCategories()}
          </View>

          <View style={styles.address}>
            <Icon name="location-on" size={14} color={colors.text.secondary} />
            <Text style={styles.addressText} numberOfLines={1}>
              {venue.address.line1}, {venue.address.city}, {venue.address.state}
            </Text>
          </View>
        </View>

        {/* Neon Accent Border */}
        <View style={styles.accentBorder} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.shadow.dark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    borderRadius: 16,
    backgroundColor: colors.background.paper,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  
  // Image section
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Overlay elements
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  favoriteIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    backdropFilter: 'blur(10px)',
  },
  
  happyHourBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: colors.shadow.neon,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  happyHourText: {
    ...typography.styles.caption,
    color: colors.text.inverse,
    marginLeft: 4,
    fontWeight: '600',
  },
  
  priceLevel: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  priceLevelText: {
    ...typography.styles.caption,
    fontWeight: '700',
  },
  
  // Content section
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  venueName: {
    ...typography.styles.h4,
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginLeft: 2,
  },
  
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.styles.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewCountText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  
  categoriesContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryTag: {
    backgroundColor: colors.transparent.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  categoryText: {
    ...typography.styles.caption,
    color: colors.primary.main,
    fontWeight: '500',
  },
  
  address: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  
  // Neon accent
  accentBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary.main,
    shadowColor: colors.shadow.neon,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});

export default RetroVenueCard;