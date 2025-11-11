
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";
import { getMembershipId } from "@/utils/membershipIdGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, countryFlags } from "@/utils/translations";

const LANGUAGE_KEY = "@aura_language";
const STREAK_KEY = "@aura_streak";

export default function ProfileScreen() {
  const theme = useTheme();
  const [memberId, setMemberId] = useState("");
  const [languageCode, setLanguageCode] = useState("en");
  const [dayStreak, setDayStreak] = useState(0);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const id = await getMembershipId();
      if (id) {
        setMemberId(id);
      }

      const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (lang) {
        setLanguageCode(lang);
      }

      const streak = await AsyncStorage.getItem(STREAK_KEY);
      if (streak) {
        setDayStreak(parseInt(streak, 10));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#D4AF37', fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }

  const translation = translations[languageCode as keyof typeof translations] || translations.en;
  const flag = countryFlags[languageCode] || '🌐';

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
              <Text style={styles.headerTitle}>Your Aura Profile</Text>
              <View style={styles.headerDivider} />
            </View>

            {/* Membership Card */}
            <View style={styles.membershipCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Limited Membership</Text>
                <IconSymbol name="star.fill" size={24} color="#D4AF37" />
              </View>
              
              <View style={styles.memberIdDisplay}>
                <Text style={styles.memberIdLabel}>{translation.memberId}</Text>
                <View style={styles.memberIdBadge}>
                  <Text style={styles.memberIdText}>{memberId || 'AURA-XX-0000'}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardStats}>
                <View style={styles.cardStat}>
                  <Text style={styles.cardStatLabel}>Status</Text>
                  <Text style={styles.cardStatValue}>Elite</Text>
                </View>
                <View style={styles.cardStatDivider} />
                <View style={styles.cardStat}>
                  <Text style={styles.cardStatLabel}>Since</Text>
                  <Text style={styles.cardStatValue}>2025</Text>
                </View>
              </View>
            </View>

            {/* Language Pack */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <IconSymbol name="globe" size={20} color="#D4AF37" />
                  <Text style={styles.infoLabelText}>Language Pack</Text>
                </View>
                <View style={styles.languageDisplay}>
                  <Text style={styles.flagEmoji}>{flag}</Text>
                  <Text style={styles.infoValue}>
                    {translations[languageCode]?.message.split(' ')[0] || 'English'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Streak Info */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <IconSymbol name="flame.fill" size={20} color="#D4AF37" />
                  <Text style={styles.infoLabelText}>Current Streak</Text>
                </View>
                <Text style={styles.infoValue}>{dayStreak} {dayStreak === 1 ? 'Day' : 'Days'}</Text>
              </View>
            </View>

            {/* Wealth Level */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <IconSymbol name="chart.bar.fill" size={20} color="#D4AF37" />
                  <Text style={styles.infoLabelText}>Wealth Level</Text>
                </View>
                <Text style={styles.infinitySymbol}>∞</Text>
              </View>
            </View>

            {/* Premium Features */}
            <View style={styles.featuresCard}>
              <Text style={styles.featuresTitle}>Premium Features</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <IconSymbol name="checkmark.circle.fill" size={18} color="#D4AF37" />
                  <Text style={styles.featureText}>Daily Wealth Reminders</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="checkmark.circle.fill" size={18} color="#D4AF37" />
                  <Text style={styles.featureText}>Streak Tracking</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="checkmark.circle.fill" size={18} color="#D4AF37" />
                  <Text style={styles.featureText}>Multilingual Support</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="checkmark.circle.fill" size={18} color="#D4AF37" />
                  <Text style={styles.featureText}>Exclusive Member ID</Text>
                </View>
              </View>
            </View>

            {/* Bottom Spacing */}
            <View style={{ height: 40 }} />
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
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: '#D4AF37',
    letterSpacing: 2,
    textAlign: 'center',
  },
  headerDivider: {
    width: 80,
    height: 2,
    backgroundColor: '#D4AF37',
    marginTop: 15,
    opacity: 0.6,
  },
  membershipCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: '#D4AF37',
    letterSpacing: 1,
  },
  memberIdDisplay: {
    alignItems: 'center',
    marginVertical: 15,
  },
  memberIdLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 12,
    color: '#C9A961',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  memberIdBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  memberIdText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: '#D4AF37',
    letterSpacing: 3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.3,
    marginVertical: 20,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cardStat: {
    flex: 1,
    alignItems: 'center',
  },
  cardStatDivider: {
    width: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.3,
  },
  cardStatLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 12,
    color: '#C9A961',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  cardStatValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: '#D4AF37',
  },
  infoCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabelText: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 16,
    color: '#D4AF37',
  },
  languageDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagEmoji: {
    fontSize: 20,
  },
  infoValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: '#D4AF37',
  },
  infinitySymbol: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: '#D4AF37',
  },
  featuresCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  featuresTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: '#D4AF37',
    marginBottom: 15,
    letterSpacing: 1,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 15,
    color: '#D4AF37',
  },
});
