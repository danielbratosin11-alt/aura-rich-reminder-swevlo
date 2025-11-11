
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/IconSymbol";
import NotificationSettings from "@/components/NotificationSettings";
import LanguageSelector from "@/components/LanguageSelector";
import { translations } from "@/utils/translations";
import { generateMembershipId, getMembershipId } from "@/utils/membershipIdGenerator";
import { registerForPushNotificationsAsync, scheduleDailyNotification } from "@/utils/notificationManager";

const LAST_OPENED_KEY = '@aura_last_opened';
const STREAK_KEY = '@aura_streak';
const LANGUAGE_KEY = '@aura_language';

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [streak, setStreak] = useState(0);
  const [memberId, setMemberId] = useState('');
  const [languageCode, setLanguageCode] = useState('en');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    initializeMembershipId();
    loadLanguageAndUpdateDate();
    checkAndUpdateStreak();
    initializeNotifications();
  }, []);

  const initializeMembershipId = async () => {
    try {
      let id = await getMembershipId();
      if (!id) {
        id = await generateMembershipId();
      }
      if (id) {
        setMemberId(id);
      }
    } catch (error) {
      console.error('Error initializing membership ID:', error);
    }
  };

  const loadLanguageAndUpdateDate = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      const lang = savedLanguage || 'en';
      setLanguageCode(lang);
      updateDate(lang);
    } catch (error) {
      console.error('Error loading language:', error);
      updateDate('en');
    }
  };

  const updateDate = (lang: string) => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const locale = lang === 'en' ? 'en-US' : 
                   lang === 'es' ? 'es-ES' :
                   lang === 'fr' ? 'fr-FR' :
                   lang === 'de' ? 'de-DE' :
                   lang === 'it' ? 'it-IT' :
                   lang === 'pt' ? 'pt-PT' :
                   lang === 'ru' ? 'ru-RU' :
                   lang === 'zh' ? 'zh-CN' :
                   lang === 'ja' ? 'ja-JP' :
                   lang === 'ko' ? 'ko-KR' :
                   lang === 'ar' ? 'ar-SA' :
                   lang === 'hi' ? 'hi-IN' :
                   lang === 'pl' ? 'pl-PL' :
                   lang === 'ro' ? 'ro-RO' : 'en-US';
    
    const formattedDate = today.toLocaleDateString(locale, options);
    setCurrentDate(formattedDate);
  };

  const initializeNotifications = async () => {
    try {
      await registerForPushNotificationsAsync();
      
      const notificationSettings = await AsyncStorage.getItem('@aura_notification_time');
      if (notificationSettings) {
        const { hour, minute } = JSON.parse(notificationSettings);
        await scheduleDailyNotification(languageCode, hour, minute);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const checkAndUpdateStreak = async () => {
    try {
      const today = new Date().toDateString();
      const lastOpened = await AsyncStorage.getItem(LAST_OPENED_KEY);
      const savedStreak = await AsyncStorage.getItem(STREAK_KEY);
      
      let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;

      if (lastOpened) {
        const lastDate = new Date(lastOpened);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      await AsyncStorage.setItem(LAST_OPENED_KEY, today);
      await AsyncStorage.setItem(STREAK_KEY, currentStreak.toString());
      setStreak(currentStreak);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const handleLanguageChange = (newLanguageCode: string) => {
    setLanguageCode(newLanguageCode);
    updateDate(newLanguageCode);
  };

  const t = translations[languageCode] || translations.en;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.topRightButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowLanguageSelector(true)}
            activeOpacity={0.7}
          >
            <IconSymbol name="globe" size={20} color="#D4AF37" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowNotificationSettings(true)}
            activeOpacity={0.7}
          >
            <IconSymbol name="bell.fill" size={20} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/d523516b-8bc5-4ca1-ac36-62fd57179c70.jpeg')}
            style={styles.logo}
          />
        </View>

        <Text style={styles.mainMessage}>
          {t.message}
        </Text>

        <Text style={styles.dateText}>
          {currentDate}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>
              {t.dayStreak}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>∞</Text>
            <Text style={styles.statLabel}>
              {t.wealthLevel}
            </Text>
          </View>
        </View>

        {memberId && (
          <View style={styles.memberIdContainer}>
            <Text style={styles.memberIdLabel}>{t.memberId}</Text>
            <Text style={styles.memberIdValue}>{memberId}</Text>
          </View>
        )}

        <Text style={styles.bottomMessage}>
          {t.becauseYouDeserve}
        </Text>
      </LinearGradient>

      <NotificationSettings 
        visible={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onLanguageChange={handleLanguageChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  topRightButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  mainMessage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
    textShadowColor: 'rgba(212, 175, 55, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
    textShadowColor: 'rgba(212, 175, 55, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#D4AF37',
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.9,
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  memberIdContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  memberIdLabel: {
    fontSize: 11,
    color: '#D4AF37',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.8,
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  memberIdValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
    textShadowColor: 'rgba(212, 175, 55, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  bottomMessage: {
    fontSize: 14,
    color: '#D4AF37',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
