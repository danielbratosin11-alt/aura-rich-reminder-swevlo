
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  registerForPushNotificationsAsync,
  scheduleDailyNotification,
  cancelDailyNotification,
  getNotificationSettings,
} from '../utils/notificationManager';

interface NotificationSettingsProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGE_KEY = '@aura_language';

export default function NotificationSettings({ visible, onClose }: NotificationSettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      if (settings) {
        setNotificationsEnabled(settings.enabled);
        const time = new Date();
        time.setHours(settings.hour, settings.minute);
        setNotificationTime(time);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const handleToggle = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);
      
      if (value) {
        const hasPermission = await registerForPushNotificationsAsync();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive daily reminders.'
          );
          setNotificationsEnabled(false);
          return;
        }
        
        const languageCode = await AsyncStorage.getItem(LANGUAGE_KEY) || 'en';
        await scheduleDailyNotification(
          languageCode,
          notificationTime.getHours(),
          notificationTime.getMinutes()
        );
      } else {
        await cancelDailyNotification();
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedDate && notificationsEnabled) {
      setNotificationTime(selectedDate);
      
      try {
        const languageCode = await AsyncStorage.getItem(LANGUAGE_KEY) || 'en';
        await scheduleDailyNotification(
          languageCode,
          selectedDate.getHours(),
          selectedDate.getMinutes()
        );
      } catch (error) {
        console.error('Error updating notification time:', error);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Notification Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Daily Reminders</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#3e3e3e', true: '#D4AF37' }}
              thumbColor={notificationsEnabled ? '#FFD700' : '#f4f3f4'}
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Notification Time</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timeText}>
                  {notificationTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={notificationTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  settingLabel: {
    fontSize: 16,
    color: '#D4AF37',
    letterSpacing: 0.3,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  timeSection: {
    marginTop: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  timeLabel: {
    fontSize: 14,
    color: '#D4AF37',
    marginBottom: 12,
    letterSpacing: 0.3,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  timeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  closeButton: {
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
});
