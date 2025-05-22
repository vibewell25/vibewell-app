export const COLORS = {
  // Primary palette
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  
  // Secondary palette
  secondary: '#F5F5DC',
  secondaryLight: '#FFFFF0',
  secondaryDark: '#E6E6CA',
  
  // Accent palette
  accent: '#FF5722',
  accentLight: '#FF8A65',
  accentDark: '#E64A19',
  
  // Neutral palette
  white: '#FFFFFF',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',
  black: '#000000',
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Transparent
  transparent: 'transparent',
};

export const FONTS = {
  // Font families
  heading: 'Raleway-Bold',
  body: 'Inter-Regular',
  
  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  
  // Line heights
  lineHeightH1: 36,
  lineHeightH2: 28,
  lineHeightH3: 24,
  lineHeightBody: 24,
  lineHeightSmall: 20,
};

export const SPACING = {
  // Base spacing unit: 4px
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

const theme = {
  colors: COLORS,
  fonts: FONTS,
  spacing: SPACING,
  shadows: SHADOWS,
  borderRadius: BORDER_RADIUS,
};

export default theme; 