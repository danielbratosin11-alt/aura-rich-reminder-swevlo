
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#D4AF37',    // Gold
  secondary: '#FFD700',  // Bright Gold
  accent: '#C9A961',     // Muted Gold
  background: '#000000', // Pure Black
  backgroundAlt: '#0A0A0A', // Slightly lighter black
  text: '#D4AF37',       // Gold text
  textSecondary: '#C9A961', // Muted gold for secondary text
  card: '#0A0A0A',       // Dark card background
  white: '#FFFFFF',
  black: '#000000',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(212, 175, 55, 0.3)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
