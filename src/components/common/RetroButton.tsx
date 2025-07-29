import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '@constants/colors';
import {typography} from '@constants/typography';

interface RetroButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'neon' | 'electric' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glowEffect?: boolean;
}

const RetroButton: React.FC<RetroButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  glowEffect = false,
}) => {
  const [scaleValue] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyles = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    if (glowEffect && !disabled) {
      baseStyle.push(styles.glow);
    }
    
    return baseStyle;
  };

  const getTextStyles = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'neon':
        baseStyle.push(styles.neonText);
        break;
      case 'electric':
        baseStyle.push(styles.electricText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostText);
        break;
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'ghost' ? colors.primary.main : colors.primary.contrast}
          size="small"
        />
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <React.Fragment>{icon}</React.Fragment>
        )}
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <React.Fragment>{icon}</React.Fragment>
        )}
      </>
    );
  };

  const renderButton = () => {
    const buttonContent = (
      <Animated.View
        style={[
          getButtonStyles(),
          style,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        {renderContent()}
      </Animated.View>
    );

    // Use gradient for certain variants
    if ((variant === 'primary' || variant === 'neon' || variant === 'electric') && !disabled) {
      let gradientColors;
      
      switch (variant) {
        case 'primary':
          gradientColors = colors.background.gradient.primary;
          break;
        case 'neon':
          gradientColors = [colors.primary.neon, colors.retro.neonPink];
          break;
        case 'electric':
          gradientColors = [colors.secondary.electric, colors.retro.synthwave.cyan];
          break;
        default:
          gradientColors = colors.background.gradient.primary;
      }

      return (
        <LinearGradient
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[getButtonStyles(), style]}
        >
          <Animated.View
            style={[
              styles.gradientContent,
              { transform: [{ scale: scaleValue }] }
            ]}
          >
            {renderContent()}
          </Animated.View>
        </LinearGradient>
      );
    }

    return buttonContent;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={styles.touchable}
    >
      {renderButton()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    overflow: 'visible',
  },
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.dark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Size variants
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  // Variant styles
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
  },
  neon: {
    backgroundColor: colors.primary.neon,
    shadowColor: colors.shadow.neon,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  electric: {
    backgroundColor: colors.secondary.electric,
    shadowColor: colors.shadow.electric,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  
  // Glow effect
  glow: {
    shadowColor: colors.primary.main,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  
  // Disabled state
  disabled: {
    backgroundColor: colors.border.medium,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Gradient content wrapper
  gradientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  
  // Text styles
  text: {
    ...typography.styles.button,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  smallText: {
    fontSize: typography.sizes.bodySmall,
  },
  mediumText: {
    fontSize: typography.sizes.button,
  },
  largeText: {
    fontSize: typography.sizes.bodyLarge,
  },
  
  // Text color variants
  primaryText: {
    color: colors.primary.contrast,
  },
  secondaryText: {
    color: colors.secondary.contrast,
  },
  neonText: {
    color: colors.text.inverse,
    textShadowColor: colors.shadow.neon,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 4,
  },
  electricText: {
    color: colors.text.inverse,
    textShadowColor: colors.shadow.electric,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 4,
  },
  ghostText: {
    color: colors.primary.main,
  },
  disabledText: {
    color: colors.text.tertiary,
  },
});

export default RetroButton;