
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
      
      const notificationSettings = await AsyncStorage.getItem('@aura_notification_time');
      if (notificationSettings) {
        const { hour, minute } = JSON.parse(notificationSettings);
        await scheduleDailyNotification(languageCode, hour, minute);
      }
      
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
      
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
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
    marginBottom: 20,
    letterSpacing: 0.5,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
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
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  languageName: {
    fontSize: 16,
    color: '#D4AF37',
    letterSpacing: 0.3,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  languageNameSelected: {
    fontWeight: 'bold',
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
