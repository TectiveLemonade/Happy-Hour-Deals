import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import {colors} from '@constants/colors';
import {typography} from '@constants/typography';

const HomeScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={colors.background.gradient.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Find Your Perfect</Text>
            <Text style={styles.titleAccent}>Happy Hour</Text>
            <View style={styles.neonAccent} />
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Discover amazing deals at restaurants and bars near you
            </Text>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    position: 'relative',
  },
  title: {
    ...typography.styles.displayLarge,
    color: colors.text.inverse,
    textAlign: 'center',
    textShadowColor: colors.shadow.neon,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  titleAccent: {
    ...typography.styles.displayLarge,
    color: colors.secondary.electric,
    textAlign: 'center',
    textShadowColor: colors.shadow.electric,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  neonAccent: {
    position: 'absolute',
    bottom: 10,
    width: 100,
    height: 4,
    backgroundColor: colors.secondary.electric,
    shadowColor: colors.shadow.electric,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  subtitle: {
    ...typography.styles.bodyLarge,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;