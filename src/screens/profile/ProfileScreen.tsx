import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import {useAppSelector} from '@store/hooks';
import {colors} from '@constants/colors';
import {typography} from '@constants/typography';

const ProfileScreen: React.FC = () => {
  const {user} = useAppSelector(state => state.auth);

  return (
    <LinearGradient
      colors={colors.background.gradient.secondary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Profile</Text>
          {user && (
            <Text style={styles.subtitle}>
              Welcome, {user.firstName} {user.lastName}!
            </Text>
          )}
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
    textShadowColor: colors.shadow.electric,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  subtitle: {
    ...typography.styles.bodyLarge,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

export default ProfileScreen;