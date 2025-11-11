
import { LinearGradient } from "expo-linear-gradient";
import { generateMembershipId, getMembershipId } from "@/utils/membershipIdGenerator";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import NotificationSettings from "@/components/NotificationSettings";
import { translations, countryFlags } from "@/utils/translations";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync, scheduleDailyNotification } from "@/utils/notificationManager";
import { StyleSheet, View, Text, Platform, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";
import LanguageSelector from "@/components/LanguageSelector";

const LAST_OPENED_KEY = '@aura_last_opened';
const STREAK_KEY = '@aura_streak';
const LANGUAGE_KEY = '@aura_language';

const { width } = Dimensions.get('window');
const LOGO_SIZE = width * 0.25;

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
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: 'contain',
  },
  mainMessage: {
    fontSize: 42,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'CormorantGaramond_300Light',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 48,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'CormorantGaramond_400Regular',
    color: '#D4AF37',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  memberIdContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  memberIdLabel: {
    fontSize: 12,
    fontFamily: 'CormorantGaramond_400Regular',
    color: '#D4AF37',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  memberIdValue: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    letterSpacing: 3,
  },
  bottomMessage: {
    fontSize: 16,
    fontFamily: 'CormorantGaramond_300Light',
    color: '#D4AF37',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
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
  flagButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
  },
  flagEmoji: {
    fontSize: 24,
  },
});

export default function HomeScreen() {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState('');
  const [streak, setStreak] = useState(0);
  const [memberId, setMemberId] = useState('AURA-LX-0000');
  const [languageCode, setLanguageCode] = useState('en');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
  });

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
                   lang === 'pl' ? 'pl-PL' : 'en-US';
    
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
        <View style={styles.topRightButtons}>
          <TouchableOpacity 
            style={styles.flagButton}
            onPress={() => setShowLanguageSelector(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.flagEmoji}>{countryFlags[languageCode]}</Text>
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
            source={require('@/assets/images/bee3fec5-8253-495c-b47b-4a28ccd9ff32.jpeg')}
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

        <View style={styles.memberIdContainer}>
          <Text style={styles.memberIdLabel}>{t.memberId}</Text>
          <Text style={styles.memberIdValue}>{memberId}</Text>
        </View>

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
