import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useAppDispatch} from '@store/hooks';
import {completeOnboarding} from '@store/slices/authSlice';
import {colors} from '@constants/colors';

const OnboardingScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleGetStarted = () => {
    dispatch(completeOnboarding());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Happy Hour Deals</Text>
          <Text style={styles.subtitle}>
            Discover the best happy hour deals near you
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>🍺 Find Great Deals</Text>
            <Text style={styles.featureDescription}>
              Discover happy hour specials at restaurants and bars nearby
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>📍 Location-Based</Text>
            <Text style={styles.featureDescription}>
              Search within customizable radius from your location
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureTitle}>⭐ Real Reviews</Text>
            <Text style={styles.featureDescription}>
              See ratings and reviews from real customers
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
  },
  feature: {
    marginBottom: 32,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  getStartedButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButtonText: {
    color: colors.primary.contrast,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;