/**
 * Brand color palette for Swasthya Sathi
 * Following Material 3 design principles with medical theme
 */
export const colors = {
  // Primary - Soft Blue
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
  },
  
  // Status Colors
  status: {
    normal: '#4CAF50',      // Green
    warning: '#FF9800',     // Yellow/Orange
    critical: '#F44336',    // Red
    info: '#2196F3',        // Blue
  },
  
  // Neutral
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
  
  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
  },
  
  // Text
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
  },
  
  // Shadows
  shadow: {
    sm: 'rgba(0, 0, 0, 0.05)',
    md: 'rgba(0, 0, 0, 0.1)',
    lg: 'rgba(0, 0, 0, 0.15)',
  },
} as const;

export type ColorKey = keyof typeof colors;

