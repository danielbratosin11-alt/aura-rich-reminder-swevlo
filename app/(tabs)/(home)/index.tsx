
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text, Platform, Animated } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { CormorantGaramond_300Light, CormorantGaramond_400Regular } from "@expo-google-fonts/cormorant-garamond";
import { LinearGradient } from "expo-linear-gradient";

const LAST_OPENED_KEY = "@aura_last_opened";
const STREAK_KEY = "@aura_streak";

export default function HomeScreen() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState("");
  const [dayStreak, setDayStreak] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
  });

  useEffect(() => {
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
      )}
      <View style={styles.container}>
        <LinearGradient
          colors={['#000000', '#0A0A0A', '#000000']}
          style={styles.gradient}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Main Message */}
            <View style={styles.mainMessageContainer}>
              <Text style={styles.mainMessage}>You Are Rich</Text>
              <Text style={styles.mainMessage}>Today</Text>
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
                <Text style={styles.statLabel}>Day Streak</Text>
                <Text style={styles.statValue}>{dayStreak}</Text>
              </View>

              {/* Wealth Level */}
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Wealth Level</Text>
                <Text style={styles.infinitySymbol}>∞</Text>
              </View>
            </View>

            {/* Bottom Message */}
            <View style={styles.bottomMessageContainer}>
              <Text style={styles.bottomMessage}>Because you deserve the reminder</Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    </>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  mainMessageContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  mainMessage: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
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
    color: '#C9A961',
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    boxShadow: '0px 4px 20px rgba(212, 175, 55, 0.15)',
    elevation: 5,
  },
  statLabel: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 14,
    color: '#C9A961',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
  },
  statValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 42,
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  infinitySymbol: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 56,
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bottomMessageContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 80,
  },
  bottomMessage: {
    fontFamily: 'CormorantGaramond_300Light',
    fontSize: 16,
    color: '#C9A961',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.8,
  },
});
