import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import {colors} from '@constants/colors';
import {typography} from '@constants/typography';

const VenueDetailScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={colors.background.gradient.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Venue Details</Text>
          <Text style={styles.subtitle}>Detailed venue information</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    ...typography.styles.displayMedium,
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: colors.shadow.neon,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  subtitle: {
    ...typography.styles.bodyLarge,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

export default VenueDetailScreen;