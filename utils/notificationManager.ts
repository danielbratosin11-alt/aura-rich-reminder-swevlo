
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations';

const NOTIFICATION_TIME_KEY = '@aura_notification_time';
const NOTIFICATION_ENABLED_KEY = '@aura_notification_enabled';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('aura-daily', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D4AF37',
      sound: 'default',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    
    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
}

export async function scheduleDailyNotification(languageCode: string = 'en', hour: number = 9, minute: number = 0) {
  try {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Get the translated notification text
    const translation = translations[languageCode as keyof typeof translations];
    const notificationBody = translation?.notificationBody || translations.en.notificationBody;
    
    // Schedule daily notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Aura',
        body: notificationBody,
        sound: 'default',
        data: { type: 'daily-reminder' },
        ...(Platform.OS === 'android' && {
          channelId: 'aura-daily',
          color: '#D4AF37',
        }),
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    
    // Save notification settings
    await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, JSON.stringify({ hour, minute }));
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
    
    console.log('Daily notification scheduled successfully');
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
}

export async function cancelDailyNotification() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'false');
    console.log('Daily notification cancelled');
    return true;
  } catch (error) {
    console.error('Error cancelling notification:', error);
    return false;
  }
}

export async function getNotificationSettings() {
  try {
    const timeStr = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
    const enabledStr = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    
    const time = timeStr ? JSON.parse(timeStr) : { hour: 9, minute: 0 };
    const enabled = enabledStr === 'true';
    
    return { time, enabled };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return { time: { hour: 9, minute: 0 }, enabled: false };
  }
}
