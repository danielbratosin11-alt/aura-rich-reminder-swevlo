
import { scheduleDailyNotification } from '../utils/notificationManager';
import { translations, languageNames, countryFlags } from '../utils/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { colors } from '../styles/commonStyles';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChange?: (languageCode: string) => void;
}

const LANGUAGE_KEY = '@aura_language';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.gold,
    ...Platform.select({
      ios: {
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  languageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 16,
  },
  languageName: {
    fontSize: 18,
    fontFamily: 'CormorantGaramond_400Regular',
    color: colors.text,
    letterSpacing: 0.5,
  },
  selectedBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.background,
    letterSpacing: 1,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.gold,
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default function LanguageSelector({ visible, onClose, onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    if (visible) {
      loadLanguage();
    }
  }, [visible]);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const saveLanguage = async (languageCode: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
      setSelectedLanguage(languageCode);
      
      // Reschedule notification with new language
      const notificationSettings = await AsyncStorage.getItem('@aura_notification_time');
      if (notificationSettings) {
        const { hour, minute } = JSON.parse(notificationSettings);
        await scheduleDailyNotification(languageCode, hour, minute);
      }
      
      // Call the callback to update parent component
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
      
      // Close modal after selection
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const renderLanguageItem = ({ item }: { item: { code: string; name: string; flag: string } }) => {
    const isSelected = item.code === selectedLanguage;
    
    return (
      <TouchableOpacity
        style={styles.languageItem}
        onPress={() => saveLanguage(item.code)}
        activeOpacity={0.7}
      >
        <View style={styles.languageItemContent}>
          <Text style={styles.flag}>{item.flag}</Text>
          <Text style={styles.languageName}>{item.name}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>SELECTED</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const languages = Object.keys(languageNames).map(code => ({
    code,
    name: languageNames[code],
    flag: countryFlags[code],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Select Language</Text>
          
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
          />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>CLOSE</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
