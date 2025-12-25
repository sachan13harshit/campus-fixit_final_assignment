export const Colors = {
  background: '#F7F8FA', // Very soft grey/white
  surface: '#FFFFFF',
  primary: '#007AFF', // Classic Apple Blue, or #5E6AD2 for Linear-ish Purple
  primaryDark: '#005ebd',
  textPrimary: '#1A1A1A',
  textSecondary: '#6E6E73',
  textTertiary: '#8E8E93',
  border: '#E5E5EA',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  overlay: 'rgba(0,0,0,0.4)',
};

export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  }
};

export const Layout = {
  radius: 16,
  padding: 20,
};
