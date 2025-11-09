
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  registerForPushNotificationsAsync,
  scheduleDailyNotification,
  cancelDailyNotification,
  getNotificationSettings,
} from '../utils/notificationManager';
import { colors } from '../styles/commonStyles';

const LANGUAGE_KEY = '@aura_language';

interface NotificationSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationSettings({ visible, onClose }: NotificationSettingsProps) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [languageCode, setLanguageCode] = useState('en');

  useEffect(() => {
    loadSettings();
  }, [visible]);

  const loadSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      
      setEnabled(settings.enabled);
      
      const newTime = new Date();
      newTime.setHours(settings.time.hour);
      newTime.setMinutes(settings.time.minute);
      setTime(newTime);
      
      if (savedLanguage) {
        setLanguageCode(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleToggle = async (value: boolean) => {
    try {
      if (value) {
        const hasPermission = await registerForPushNotificationsAsync();
        if (hasPermission) {
          const hour = time.getHours();
          const minute = time.getMinutes();
          await scheduleDailyNotification(languageCode, hour, minute);
          setEnabled(true);
          Alert.alert(
            'Notifications Enabled',
            `You will receive a daily reminder at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          );
        } else {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive daily reminders.'
          );
        }
      } else {
        await cancelDailyNotification();
        setEnabled(false);
        Alert.alert('Notifications Disabled', 'Daily reminders have been turned off.');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedDate && enabled) {
      setTime(selectedDate);
      const hour = selectedDate.getHours();
      const minute = selectedDate.getMinutes();
      await scheduleDailyNotification(languageCode, hour, minute);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <BlurView intensity={Platform.OS === 'ios' ? 80 : 100} style={styles.blurContainer}>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Enable/Disable Toggle */}
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Daily Reminder</Text>
                  <Text style={styles.settingDescription}>
                    Receive a daily notification
                  </Text>
                </View>
                <Switch
                  value={enabled}
                  onValueChange={handleToggle}
                  trackColor={{ false: '#3e3e3e', true: colors.primary }}
                  thumbColor={enabled ? colors.secondary : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>

              {/* Time Picker */}
              {enabled && (
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Notification Time</Text>
                    <Text style={styles.settingDescription}>
                      Choose when to receive your reminder
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.timeButtonText}>
                      {time.getHours().toString().padStart(2, '0')}:
                      {time.getMinutes().toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}

              {/* Info Text */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  The notification will display &quot;You Are Rich Today&quot; in your selected language.
                </Text>
              </View>
            </View>
          </BlurView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  blurContainer: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.8)' : colors.backgroundAlt,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '300',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  timeButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});
