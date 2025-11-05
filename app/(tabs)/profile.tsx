
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import React from "react";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";

export default function ProfileScreen() {
  const theme = useTheme();

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <IconSymbol name="person.circle.fill" size={80} color="#D4AF37" />
              <Text style={styles.title}>Your Aura</Text>
              <Text style={styles.subtitle}>Luxury is a state of mind</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>About Aura</Text>
                <Text style={styles.cardText}>
                  Aura is your daily reminder of abundance and prosperity. 
                  Open the app every day to maintain your streak and affirm your wealth mindset.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Philosophy</Text>
                <Text style={styles.cardText}>
                  True wealth begins in the mind. By acknowledging your richness daily, 
                  you cultivate an abundant mindset that attracts prosperity.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Your Journey</Text>
                <Text style={styles.cardText}>
                  Every day you open Aura, you&apos;re reinforcing your commitment to 
                  abundance. Your streak is a testament to your dedication.
                </Text>
              </View>
            </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 36,
    color: '#D4AF37',
    marginTop: 20,
    letterSpacing: 2,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: 16,
    color: '#C9A961',
    marginTop: 10,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  section: {
    gap: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 12,
    padding: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    boxShadow: '0px 4px 20px rgba(212, 175, 55, 0.15)',
    elevation: 5,
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: '#D4AF37',
    marginBottom: 12,
    letterSpacing: 1,
  },
  cardText: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 16,
    color: '#C9A961',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
});
