
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Platform, Animated, Image, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import LanguageSelector from "@/components/LanguageSelector";
import NotificationSettings from "@/components/NotificationSettings";
import { translations, countryFlags } from "@/utils/translations";
import { registerForPushNotificationsAsync, scheduleDailyNotification } from "@/utils/notificationManager";
import { generateMembershipId, getMembershipId } from "@/utils/membershipIdGenerator";

const LAST_OPENED_KEY = "@aura_last_opened";
const STREAK_KEY = "@aura_streak";
const LANGUAGE_KEY = "@aura_language";

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes based on screen dimensions
const LOGO_SIZE = Math.min(SCREEN_WIDTH * 0.3, SCREEN_HEIGHT * 0.15, 150);

export default function HomeScreen() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState("");
  const [dayStreak, setDayStreak] = useState(0);
  const [languageCode, setLanguageCode] = useState("en");
  const [memberId, setMemberId] = useState("");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  
  // Shimmer animation values
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const logoShimmerAnim = useRef(new Animated.Value(0)).current;

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

    // Initialize membership ID
    initializeMembershipId();

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

    // Start shimmer animations
    startShimmerAnimation();
  }, []);

  const startShimmerAnimation = () => {
    // Background shimmer - slower, more subtle
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Logo shimmer - faster, more noticeable
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoShimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoShimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const initializeMembershipId = async () => {
    try {
      const existingId = await getMembershipId();
      if (existingId) {
        setMemberId(existingId);
      } else {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        const lang = saved || 'en';
        const newId = await generateMembershipId(lang);
        setMemberId(newId);
      }
    } catch (error) {
      console.error('Error initializing membership ID:', error);
    }
  };

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
      pl: 'pl-PL',
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

  const handleLanguageChange = async (newLanguageCode: string) => {
    console.log('Language changed to:', newLanguageCode);
    setLanguageCode(newLanguageCode);
    updateDate(newLanguageCode);
    
    // Update membership ID with new country code
    const newId = await getMembershipId();
    if (newId) {
      setMemberId(newId);
    }
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
  const memberIdLabel = translation.memberId;
  const typography = translation.typography;
  const flag = countryFlags[languageCode] || '🌐';

  console.log('Rendering HomeScreen with streak:', dayStreak);
  console.log('Current language:', languageCode, 'Flag:', flag);

  // Interpolate shimmer opacity for background
  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  // Interpolate shimmer for logo
  const logoShimmerOpacity = logoShimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
  });

  // Responsive typography based on screen size and language
  const mainMessageSize = Math.min(SCREEN_WIDTH * 0.1, typography.mainMessageSize);
  const mainMessageLineHeight = mainMessageSize * (typography.mainMessageLineHeight / typography.mainMessageSize);
  const statLabelSize = Math.min(SCREEN_WIDTH * 0.035, typography.statLabelSize);
  const dateSize = Math.min(SCREEN_WIDTH * 0.045, typography.dateSize);
  const bottomMessageSize = Math.min(SCREEN_WIDTH * 0.04, typography.bottomMessageSize);
  const statValueSize = Math.min(SCREEN_WIDTH * 0.1, 42);
  const infinitySize = Math.min(SCREEN_WIDTH * 0.13, 56);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#000000']}
        style={styles.gradient}
      >
        {/* Shimmer overlay for background */}
        <Animated.View 
          style={[
            styles.shimmerOverlay,
            { opacity: shimmerOpacity }
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(212, 175, 55, 0.05)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Top Action Buttons */}
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log('Language button pressed, current state:', showLanguageSelector);
              setShowLanguageSelector(true);
              console.log('Language selector should now be visible');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.flagContainer}>
              <Text style={styles.flagButton}>{flag}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log('Notification button pressed');
              setShowNotificationSettings(true);
            }}
            activeOpacity={0.7}
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
          {/* Logo with shimmer effect */}
          <View style={styles.logoContainer}>
            <Animated.View style={{ opacity: logoShimmerOpacity }}>
              <Image 
                source={require('../../../assets/images/a7f3f6ff-d553-4a60-99dc-2d581ece63d6.jpeg')}
                style={[styles.logo, { width: LOGO_SIZE, height: LOGO_SIZE }]}
                resizeMode="contain"
              />
            </Animated.View>
            {/* Shimmer glow effect around logo */}
            <Animated.View 
              style={[
                styles.logoGlow,
                { 
                  width: LOGO_SIZE + 20, 
                  height: LOGO_SIZE + 20,
                  opacity: logoShimmerOpacity 
                }
              ]}
            />
          </View>

          {/* Main Message - Localized typography */}
          <View style={styles.mainMessageContainer}>
            <Text 
              style={[
                styles.mainMessage, 
                { 
                  fontSize: mainMessageSize,
                  lineHeight: mainMessageLineHeight,
                }
              ]}
            >
              {message}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.dateContainer}>
            <View style={styles.divider} />
            <Text style={[styles.dateText, { fontSize: dateSize }]}>{currentDate}</Text>
            <View style={styles.divider} />
          </View>

          {/* Membership ID */}
          {memberId && (
            <View style={styles.memberIdContainer}>
              <Text style={styles.memberIdLabel}>{memberIdLabel}</Text>
              <View style={styles.memberIdBadge}>
                <Text style={styles.memberIdText}>{memberId}</Text>
              </View>
            </View>
          )}

          {/* Stats Container */}
          <View style={styles.statsContainer}>
            {/* Day Streak */}
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { fontSize: statLabelSize }]}>{dayStreakLabel}</Text>
              <Text style={[styles.statValue, { fontSize: statValueSize }]}>{dayStreak}</Text>
            </View>

            {/* Wealth Level */}
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { fontSize: statLabelSize }]}>{wealthLevelLabel}</Text>
              <Text style={[styles.infinitySymbol, { fontSize: infinitySize }]}>∞</Text>
            </View>
          </View>

          {/* Bottom Message */}
          <View style={styles.bottomMessageContainer}>
            <Text style={[styles.bottomMessage, { fontSize: bottomMessageSize }]}>
              {becauseYouDeserveText}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Modals */}
      {console.log('Rendering LanguageSelector with visible:', showLanguageSelector)}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => {
          console.log('Language selector onClose called');
          setShowLanguageSelector(false);
        }}
        onLanguageChange={handleLanguageChange}
      />
      <NotificationSettings
        visible={showNotificationSettings}
        onClose={() => {
          console.log('Notification settings closed');
          setShowNotificationSettings(false);
        }}
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
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  topButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 15,
    zIndex: 10,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 2,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  flagButton: {
    fontSize: 26,
    lineHeight: 30,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
    paddingBottom: 40,
    zIndex: 2,
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    opacity: 0.9,
  },
  logoGlow: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
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
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  dateContainer: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#D4AF37',
    marginVertical: 12,
    opacity: 0.5,
  },
  dateText: {
    fontFamily: 'CormorantGaramond_300Light',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 1,
  },
  memberIdContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  memberIdLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 12,
    color: '#C9A961',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  memberIdBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  memberIdText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    color: '#D4AF37',
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    gap: 30,
    marginTop: 10,
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
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  infinitySymbol: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  bottomMessageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomMessage: {
    fontFamily: 'CormorantGaramond_300Light',
    color: '#D4AF37',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.8,
  },
});
