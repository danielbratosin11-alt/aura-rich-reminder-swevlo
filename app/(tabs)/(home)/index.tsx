
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, Animated, Image, TouchableOpacity } from "react-native";
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
    
    // Load language
    loadLanguage();
    
    // Format current date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));

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

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved) {
        setLanguageCode(saved);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
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
  };

  if (!fontsLoaded) {
    console.log('Fonts not loaded yet');
    return (
      <View style={styles.container}>
        <Text style={{ color: '#D4AF37', fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }

  const message = translations[languageCode as keyof typeof translations]?.message || translations.en.message;

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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/images/112c7827-2c25-428e-b1c8-66d89163efd7.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Main Message */}
          <View style={styles.mainMessageContainer}>
            <Text style={styles.mainMessage}>{message}</Text>
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
              <Text style={styles.statLabel}>DAY STREAK</Text>
              <Text style={styles.statValue}>{dayStreak}</Text>
            </View>

            {/* Wealth Level */}
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>WEALTH LEVEL</Text>
              <Text style={styles.infinitySymbol}>∞</Text>
            </View>
          </View>

          {/* Bottom Message */}
          <View style={styles.bottomMessageContainer}>
            <Text style={styles.bottomMessage}>Because you deserve the reminder</Text>
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
    top: Platform.OS === 'ios' ? 60 : 40,
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
    ...Platform.select({
      ios: {
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    opacity: 0.9,
  },
  mainMessageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mainMessage: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 42,
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    lineHeight: 52,
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
    fontSize: 18,
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
    ...Platform.select({
      ios: {
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  statLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 14,
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 42,
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  infinitySymbol: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 56,
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
    fontSize: 16,
    color: '#D4AF37',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.8,
  },
});
