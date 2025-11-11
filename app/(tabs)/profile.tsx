
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { translations, countryFlags } from "@/utils/translations";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMembershipId } from "@/utils/membershipIdGenerator";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";

const LANGUAGE_KEY = '@aura_language';
const STREAK_KEY = '@aura_streak';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'CormorantGaramond_300Light',
    color: '#D4AF37',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'CormorantGaramond_400Regular',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  memberIdValue: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'CormorantGaramond_300Light',
    color: '#D4AF37',
    lineHeight: 22,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
});

export default function ProfileScreen() {
  const [memberId, setMemberId] = useState('AURA-LX-0000');
  const [streak, setStreak] = useState(0);
  const [languageCode, setLanguageCode] = useState('en');

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
  });

  const { colors } = useTheme();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const id = await getMembershipId();
      if (id) {
        setMemberId(id);
      }

      const savedStreak = await AsyncStorage.getItem(STREAK_KEY);
      if (savedStreak) {
        setStreak(parseInt(savedStreak, 10));
      }

      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        setLanguageCode(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const t = translations[languageCode] || translations.en;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Profile</Text>
              <Text style={styles.subtitle}>Your Exclusive Membership</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Membership Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.memberId}</Text>
                <Text style={styles.memberIdValue}>{memberId}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.dayStreak}</Text>
                <Text style={styles.infoValue}>{streak} Days</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.wealthLevel}</Text>
                <Text style={styles.infoValue}>∞</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Your ID</Text>
              <Text style={styles.descriptionText}>
                Your membership ID is unique and exclusive. The "LX" designation represents Luxury and Exclusivity, 
                reserved for elite members. Your ID is permanent and will never change, regardless of your language 
                preferences or app settings.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Membership Benefits</Text>
              <Text style={styles.descriptionText}>
                As an Aura member, you receive daily reminders of your prosperity and success. 
                Your streak counter tracks your commitment to acknowledging your wealth, 
                and your infinite wealth level reflects your limitless potential.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
