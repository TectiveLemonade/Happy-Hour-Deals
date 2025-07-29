import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {colors} from '@constants/colors';

interface LoadingScreenProps {
  message?: string;
  size?: 'small' | 'large';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={colors.primary.main}
        style={styles.spinner}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoadingScreen;