
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyNotification } from '../utils/notificationManager';
import { translations, languageNames } from '../utils/translations';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChange?: (languageCode: string) => void;
}

const LANGUAGE_KEY = '@aura_language';

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

  const renderLanguageItem = ({ item }: { item: { code: string; name: string } }) => {
    const isSelected = item.code === selectedLanguage;
    
    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.languageItemSelected]}
        onPress={() => saveLanguage(item.code)}
        activeOpacity={0.7}
      >
        <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
          {item.name}
        </Text>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const languages = Object.keys(languageNames).map(code => ({
    code,
    name: languageNames[code],
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(212, 175, 55, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 8,
    marginBottom: 4,
  },
  languageItemSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  languageName: {
    fontSize: 16,
    color: '#D4AF37',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(212, 175, 55, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  languageNameSelected: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(212, 175, 55, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
