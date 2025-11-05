
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";

export default function ProfileScreen() {
  const theme = useTheme();

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#D4AF37', fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <IconSymbol name="crown" size={60} color="#D4AF37" />
              <Text style={styles.title}>Aura</Text>
              <Text style={styles.subtitle}>The Luxury Reminder</Text>
            </View>

            {/* Philosophy Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Philosophy</Text>
              <View style={styles.divider} />
              <Text style={styles.bodyText}>
                In a world that constantly reminds us of what we lack, Aura stands as a beacon of abundance. 
                This is not just an app—it&apos;s a daily affirmation of your worth, your success, and your prosperity.
              </Text>
            </View>

            {/* Features Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.divider} />
              
              <View style={styles.featureItem}>
                <IconSymbol name="sparkles" size={24} color="#D4AF37" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Daily Affirmation</Text>
                  <Text style={styles.featureDescription}>
                    Start each day with a powerful reminder of your wealth and success
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <IconSymbol name="flame" size={24} color="#D4AF37" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Streak Tracking</Text>
                  <Text style={styles.featureDescription}>
                    Build consistency and watch your commitment grow day by day
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <IconSymbol name="infinity" size={24} color="#D4AF37" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Infinite Wealth</Text>
                  <Text style={styles.featureDescription}>
                    Your wealth level knows no bounds—it&apos;s limitless
                  </Text>
                </View>
              </View>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.divider} />
              <Text style={styles.bodyText}>
                Aura was created for those who understand that wealth is not just about money—it&apos;s a mindset, 
                a lifestyle, and a daily practice. Every time you open this app, you&apos;re reinforcing your 
                commitment to abundance and prosperity.
              </Text>
            </View>

            {/* Quote */}
            <View style={styles.quoteContainer}>
              <Text style={styles.quote}>
                &quot;Wealth is the ability to fully experience life.&quot;
              </Text>
              <Text style={styles.quoteAuthor}>— Henry David Thoreau</Text>
            </View>

            {/* Bottom Padding for Tab Bar */}
            <View style={{ height: 100 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    color: '#D4AF37',
    marginTop: 20,
    letterSpacing: 3,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: 18,
    color: '#C9A961',
    marginTop: 10,
    letterSpacing: 2,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: '#D4AF37',
    marginBottom: 10,
    letterSpacing: 1,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#D4AF37',
    marginBottom: 20,
    opacity: 0.5,
  },
  bodyText: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 16,
    color: '#C9A961',
    lineHeight: 26,
    letterSpacing: 0.5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingLeft: 10,
  },
  featureText: {
    flex: 1,
    marginLeft: 20,
  },
  featureTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: '#D4AF37',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  featureDescription: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 14,
    color: '#C9A961',
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  quoteContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D4AF37',
    marginVertical: 20,
    opacity: 0.8,
  },
  quote: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: 18,
    color: '#C9A961',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  quoteAuthor: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 14,
    color: '#D4AF37',
    letterSpacing: 1,
  },
});
