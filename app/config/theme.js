// Thème Kelna Store
export const COLORS = {
  primary: '#6A35FF',       // Violet principal
  primaryLight: '#8B5CF6',
  primaryDark: '#4C1D95',
  secondary: '#FFFFFF',
  accent: '#FF6B8B',        // Rose corail
  accentLight: '#FFB3C6',
  background: '#F8F7FC',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#777777',
  textLight: '#AAAAAA',
  border: '#E5E7EB',
  success: '#27AE60',
  warning: '#FFB347',
  error: '#E74C3C',
  star: '#FFD700',
  overlay: 'rgba(0,0,0,0.5)',
};

export const FONTS = {
  bold: { fontWeight: '700' },
  semiBold: { fontWeight: '600' },
  medium: { fontWeight: '500' },
  regular: { fontWeight: '400' },
  light: { fontWeight: '300' },
};

export const SIZES = {
  // Tailles de police
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,

  // Espacement
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Bordures
  radius: 12,
  radiusSmall: 8,
  radiusLarge: 20,
  radiusFull: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#6A35FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export default { COLORS, FONTS, SIZES, SHADOWS };
