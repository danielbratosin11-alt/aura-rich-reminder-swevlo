
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { translations, languageNames, countryFlags } from '../utils/translations';
import { scheduleDailyNotification } from '../utils/notificationManager';
import { updateMembershipIdCountry } from '../utils/membershipIdGenerator';
import { colors } from '../styles/commonStyles';

const LANGUAGE_KEY = '@aura_language';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChange?: (languageCode: string) => void;
}

export default function LanguageSelector({ visible, onClose, onLanguageChange }: LanguageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved) {
        setSelectedLanguage(saved);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const saveLanguage = async (languageCode: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
      setSelectedLanguage(languageCode);
      
      // Update membership ID country code
      await updateMembershipIdCountry(languageCode);
      
      // Reschedule notification with new language
      await scheduleDailyNotification(languageCode);
      
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const languages = Object.keys(translations).map(code => ({
    code,
    name: languageNames[code] || code,
    flag: countryFlags[code] || '🌐',
  }));

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLanguageItem = ({ item }: { item: { code: string; name: string; flag: string } }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === selectedLanguage && styles.selectedLanguageItem,
      ]}
      onPress={() => saveLanguage(item.code)}
    >
      <View style={styles.languageItemContent}>
        <Text style={styles.flagEmoji}>{item.flag}</Text>
        <Text
          style={[
            styles.languageName,
            item.code === selectedLanguage && styles.selectedLanguageName,
          ]}
        >
          {item.name}
        </Text>
      </View>
      {item.code === selectedLanguage && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>SELECTED</Text>
        </View>
      )}
    </TouchableOpacity>
  );

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
                <Text style={styles.title}>Select Your Language Pack</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search languages..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Language List */}
              <FlatList
                data={filteredLanguages}
                renderItem={renderLanguageItem}
                keyExtractor={(item) => item.code}
                style={styles.list}
                showsVerticalScrollIndicator={false}
              />
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.85)' : colors.backgroundAlt,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '300',
  },
  searchContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  list: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.15)',
    marginBottom: 2,
  },
  selectedLanguageItem: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 10,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  languageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagEmoji: {
    fontSize: 28,
    marginRight: 15,
  },
  languageName: {
    fontSize: 17,
    color: colors.textSecondary,
    flex: 1,
  },
  selectedLanguageName: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 11,
    color: colors.black,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
