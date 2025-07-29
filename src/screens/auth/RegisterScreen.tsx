import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {LinearGradient} from 'expo-linear-gradient';

import {useAppDispatch, useAppSelector} from '@store/hooks';
import {registerUser} from '@store/slices/authSlice';
import {AuthStackParamList} from '@navigation/AuthNavigator';
import LoadingScreen from '@components/common/LoadingScreen';
import RetroButton from '@components/common/RetroButton';
import {colors} from '@constants/colors';
import {typography} from '@constants/typography';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(registerUser({email, password, firstName, lastName})).unwrap();
      Alert.alert('Success', 'Account created successfully!');
    } catch (err) {
      Alert.alert('Registration Failed', error || 'An error occurred during registration');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Creating your account..." />;
  }

  return (
    <LinearGradient
      colors={colors.background.gradient.secondary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the happy hour revolution</Text>
              <View style={styles.neonAccent} />
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>FIRST NAME</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter your first name"
                    placeholderTextColor={colors.text.tertiary}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>LAST NAME</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter your last name"
                    placeholderTextColor={colors.text.tertiary}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    placeholderTextColor={colors.text.tertiary}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <RetroButton
                title="CREATE ACCOUNT"
                onPress={handleRegister}
                variant="electric"
                size="large"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                glowEffect
                style={styles.registerButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  title: {
    ...typography.styles.displayMedium,
    color: colors.text.inverse,
    marginBottom: 8,
    textShadowColor: colors.shadow.electric,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  subtitle: {
    ...typography.styles.bodyLarge,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  neonAccent: {
    position: 'absolute',
    bottom: -20,
    width: 60,
    height: 3,
    backgroundColor: colors.secondary.electric,
    shadowColor: colors.shadow.electric,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...typography.styles.overline,
    color: colors.text.inverse,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: colors.border.dark,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.shadow.dark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.inverse,
    fontWeight: '500',
  },
  registerButton: {
    marginTop: 32,
    borderRadius: 12,
  },
});

export default RegisterScreen;