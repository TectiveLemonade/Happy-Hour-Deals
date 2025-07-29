// Retro-Modern Typography System
export const typography = {
  // Font families - Modern with retro character
  fonts: {
    primary: 'SF Pro Display', // iOS default, clean and modern
    secondary: 'SF Pro Text',  // For body text
    mono: 'SF Mono',          // For code/data display
    display: 'Avenir Next',   // For large headings with geometric feel
    retro: 'Futura',          // Classic retro font for accents
  },
  
  // Font weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
    black: '900',
  },
  
  // Font sizes with retro-modern scaling
  sizes: {
    // Display sizes - for hero sections
    displayLarge: 48,    // Hero titles
    displayMedium: 36,   // Section headers
    displaySmall: 28,    // Card titles
    
    // Heading sizes - structured hierarchy
    h1: 32,              // Main page titles
    h2: 24,              // Section titles
    h3: 20,              // Subsection titles
    h4: 18,              // Component titles
    h5: 16,              // Small titles
    h6: 14,              // Micro titles
    
    // Body text sizes
    bodyLarge: 17,       // Primary body text
    bodyMedium: 15,      // Secondary body text
    bodySmall: 13,       // Tertiary body text
    
    // UI element sizes
    button: 16,          // Button text
    caption: 12,         // Captions and labels
    overline: 11,        // Overline text
    micro: 10,           // Very small text
  },
  
  // Line heights for optimal readability
  lineHeights: {
    tight: 1.1,          // For large display text
    normal: 1.4,         // For headings
    relaxed: 1.6,        // For body text
    loose: 1.8,          // For long-form content
  },
  
  // Letter spacing for retro-modern feel
  letterSpacing: {
    tighter: -0.05,      // For large headings
    tight: -0.025,       // For medium headings
    normal: 0,           // Default
    wide: 0.025,         // For small text
    wider: 0.05,         // For overlines and labels
    widest: 0.1,         // For emphasis
  },
  
  // Text styles combining the above
  styles: {
    // Display styles
    heroTitle: {
      fontSize: 48,
      fontWeight: '800',
      lineHeight: 1.1,
      letterSpacing: -0.05,
      fontFamily: 'Avenir Next',
    },
    displayLarge: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.025,
    },
    displayMedium: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: -0.025,
    },
    
    // Heading styles
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: 0,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    
    // Body styles
    bodyLarge: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0.025,
    },
    
    // Special styles
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: 0.025,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.2,
      letterSpacing: 0.025,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: 0.025,
    },
    overline: {
      fontSize: 11,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: 0.1,
      textTransform: 'uppercase' as const,
    },
    
    // Retro accent styles
    neonText: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: 0.05,
      textShadowColor: 'rgba(255, 69, 0, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
    glowText: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: 0.025,
      textShadowColor: 'rgba(0, 217, 255, 0.5)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },
  },
};