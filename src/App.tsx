import React from 'react';
import {StatusBar, StyleSheet, View, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '@constants/colors';
import {typography} from '@constants/typography';

const App: React.FC = () => {
  return (
    <LinearGradient
      colors={colors.background.gradient.primary}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.secondary.main}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Happy Hour Deals</Text>
        <Text style={styles.subtitle}>Find Your Perfect Happy Hour</Text>
        <View style={styles.neonAccent} />
        <Text style={styles.description}>
          Discover amazing deals at restaurants and bars near you with our retro-modern interface
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  title: {
    ...typography.styles.displayLarge,
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: colors.shadow.neon,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  subtitle: {
    ...typography.styles.displayMedium,
    color: colors.secondary.electric,
    textAlign: 'center',
    marginBottom: 32,
    textShadowColor: colors.shadow.electric,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  neonAccent: {
    width: 120,
    height: 4,
    backgroundColor: colors.secondary.electric,
    shadowColor: colors.shadow.electric,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 15,
    marginBottom: 32,
  },
  description: {
    ...typography.styles.bodyLarge,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});

export default App;