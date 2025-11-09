
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, Animated, Image, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import LanguageSelector from "@/components/LanguageSelector";
import NotificationSettings from "@/components/NotificationSettings";
import { translations } from "@/utils/translations";
import { registerForPushNotificationsAsync, scheduleDailyNotification } from "@/utils/notificationManager";

const LAST_OPENED_KEY = "@aura_last_opened";
const STREAK_KEY = "@aura_streak";
const LANGUAGE_KEY = "@aura_language";

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes based on screen dimensions
const LOGO_SIZE = Math.min(SCREEN_WIDTH * 0.3, SCREEN_HEIGHT * 0.15, 150);
const MAIN_MESSAGE_SIZE = Math.min(SCREEN_WIDTH * 0.1, 42);
const STAT_VALUE_SIZE = Math.min(SCREEN_WIDTH * 0.1, 42);
const INFINITY_SIZE = Math.min(SCREEN_WIDTH * 0.13, 56);

export default function HomeScreen() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState("");
  const [dayStreak, setDayStreak] = useState(0);
  const [languageCode, setLanguageCode] = useState("en");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
  });

  useEffect(() => {
    console.log('HomeScreen mounted');
    console.log('Screen dimensions:', SCREEN_WIDTH, 'x', SCREEN_HEIGHT);
    console.log('Logo size:', LOGO_SIZE);
    
    // Load language and update date
    loadLanguageAndUpdateDate();
    
    // Check and update streak
    checkAndUpdateStreak();

    // Initialize notifications
    initializeNotifications();

    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadLanguageAndUpdateDate = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      const lang = saved || 'en';
      setLanguageCode(lang);
      
      // Update date with the loaded language
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
    
    // Get locale code for date formatting
    const localeMap: { [key: string]: string } = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-PT',
      ru: 'ru-RU',
      zh: 'zh-CN',
      ja: 'ja-JP',
      ko: 'ko-KR',
      ar: 'ar-SA',
      hi: 'hi-IN',
      bn: 'bn-BD',
      pa: 'pa-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      tr: 'tr-TR',
      vi: 'vi-VN',
      pl: 'pl-PL',
      uk: 'uk-UA',
      nl: 'nl-NL',
      ro: 'ro-RO',
      el: 'el-GR',
      cs: 'cs-CZ',
      sv: 'sv-SE',
      hu: 'hu-HU',
      fi: 'fi-FI',
      no: 'no-NO',
      da: 'da-DK',
      th: 'th-TH',
      id: 'id-ID',
      ms: 'ms-MY',
      fil: 'fil-PH',
      he: 'he-IL',
      fa: 'fa-IR',
      ur: 'ur-PK',
      sw: 'sw-KE',
    };
    
    const locale = localeMap[lang] || 'en-US';
    setCurrentDate(today.toLocaleDateString(locale, options));
  };

  const initializeNotifications = async () => {
    try {
      await registerForPushNotificationsAsync();
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      const lang = saved || 'en';
      await scheduleDailyNotification(lang);
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const checkAndUpdateStreak = async () => {
    try {
      const lastOpened = await AsyncStorage.getItem(LAST_OPENED_KEY);
      const storedStreak = await AsyncStorage.getItem(STREAK_KEY);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toISOString();

      if (lastOpened) {
        const lastDate = new Date(lastOpened);
        lastDate.setHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log('Last opened:', lastOpened);
        console.log('Days difference:', diffDays);

        if (diffDays === 0) {
          // Same day, keep current streak
          setDayStreak(parseInt(storedStreak || "1"));
        } else if (diffDays === 1) {
          // Next day, increment streak
          const newStreak = parseInt(storedStreak || "0") + 1;
          setDayStreak(newStreak);
          await AsyncStorage.setItem(STREAK_KEY, newStreak.toString());
          await AsyncStorage.setItem(LAST_OPENED_KEY, todayString);
        } else {
          // Streak broken, reset to 1
          setDayStreak(1);
          await AsyncStorage.setItem(STREAK_KEY, "1");
          await AsyncStorage.setItem(LAST_OPENED_KEY, todayString);
        }
      } else {
        // First time opening
        setDayStreak(1);
        await AsyncStorage.setItem(STREAK_KEY, "1");
        await AsyncStorage.setItem(LAST_OPENED_KEY, todayString);
      }
    } catch (error) {
      console.error("Error managing streak:", error);
      setDayStreak(1);
    }
  };

  const handleLanguageChange = (newLanguageCode: string) => {
    setLanguageCode(newLanguageCode);
    updateDate(newLanguageCode);
  };

  if (!fontsLoaded) {
    console.log('Fonts not loaded yet');
    return (
      <View style={styles.container}>
        <Text style={{ color: '#D4AF37', fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }

  const translation = translations[languageCode as keyof typeof translations] || translations.en;
  const message = translation.message;
  const dayStreakLabel = translation.dayStreak;
  const wealthLevelLabel = translation.wealthLevel;
  const becauseYouDeserveText = translation.becauseYouDeserve;

  console.log('Rendering HomeScreen with streak:', dayStreak);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#000000']}
        style={styles.gradient}
      >
        {/* Top Action Buttons */}
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowLanguageSelector(true)}
          >
            <IconSymbol name="globe" size={24} color="#D4AF37" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowNotificationSettings(true)}
          >
            <IconSymbol name="bell.fill" size={24} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo - Responsive sizing */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/images/112c7827-2c25-428e-b1c8-66d89163efd7.jpeg')}
              style={[styles.logo, { width: LOGO_SIZE, height: LOGO_SIZE }]}
              resizeMode="contain"
            />
          </View>

          {/* Main Message - Responsive sizing */}
          <View style={styles.mainMessageContainer}>
            <Text style={[styles.mainMessage, { fontSize: MAIN_MESSAGE_SIZE }]}>{message}</Text>
          </View>

          {/* Date */}
          <View style={styles.dateContainer}>
            <View style={styles.divider} />
            <Text style={styles.dateText}>{currentDate}</Text>
            <View style={styles.divider} />
          </View>

          {/* Stats Container */}
          <View style={styles.statsContainer}>
            {/* Day Streak */}
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{dayStreakLabel}</Text>
              <Text style={[styles.statValue, { fontSize: STAT_VALUE_SIZE }]}>{dayStreak}</Text>
            </View>

            {/* Wealth Level */}
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{wealthLevelLabel}</Text>
              <Text style={[styles.infinitySymbol, { fontSize: INFINITY_SIZE }]}>∞</Text>
            </View>
          </View>

          {/* Bottom Message */}
          <View style={styles.bottomMessageContainer}>
            <Text style={styles.bottomMessage}>{becauseYouDeserveText}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Modals */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onLanguageChange={handleLanguageChange}
      />
      <NotificationSettings
        visible={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
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
  topButtons: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    gap: 15,
    zIndex: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    opacity: 0.9,
  },
  mainMessageContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  mainMessage: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    lineHeight: MAIN_MESSAGE_SIZE * 1.3,
  },
  dateContainer: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#D4AF37',
    marginVertical: 15,
    opacity: 0.5,
  },
  dateText: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: Math.min(SCREEN_WIDTH * 0.045, 18),
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    gap: 30,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    elevation: 8,
  },
  statLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: Math.min(SCREEN_WIDTH * 0.035, 14),
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  infinitySymbol: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  bottomMessageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomMessage: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: Math.min(SCREEN_WIDTH * 0.04, 16),
    color: '#D4AF37',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.8,
  },
});
