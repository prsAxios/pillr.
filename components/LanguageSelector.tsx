import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  
  // Animation refs
  const modalAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Start entrance animations
      Animated.parallel([
        Animated.timing(modalAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      // Reset animations
      modalAnim.setValue(0);
      contentAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    
    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const renderLanguageOption = (language: Language) => {
    const isSelected = selectedLanguage === language.code;
    
    return (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageOption,
          isSelected && styles.languageOptionSelected
        ]}
        onPress={() => handleLanguageSelect(language.code)}
        activeOpacity={0.7}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.languageFlag}>{language.flag}</Text>
          <View style={styles.languageText}>
            <Text style={[
              styles.languageName,
              isSelected && styles.languageNameSelected
            ]}>
              {language.name}
            </Text>
            <Text style={[
              styles.languageNativeName,
              isSelected && styles.languageNativeNameSelected
            ]}>
              {language.nativeName}
            </Text>
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark" size={20} color={Colors.glassmorphism.background} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: modalAnim }]}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
        
        <Animated.View style={[
          styles.modalContent,
          {
            opacity: contentAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <LinearGradient
            colors={[Colors.glassmorphism.card, Colors.glassmorphism.surface]}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={Colors.glassmorphism.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Language Options */}
            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {languages.map(renderLanguageOption)}
            </ScrollView>
            
            {/* Footer */}
            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>
                Language changes will be applied immediately
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: width - 40,
    maxHeight: height * 0.8,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 25,
  },
  modalGradient: {
    flex: 1,
  },
  
  // Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassmorphism.glassBorder,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.glassmorphism.text,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glassmorphism.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  
  // Language List
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.glassmorphism.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  languageOptionSelected: {
    backgroundColor: Colors.glassmorphism.primary,
    borderColor: Colors.glassmorphism.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 28,
    marginRight: 16,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.glassmorphism.text,
    marginBottom: 2,
  },
  languageNameSelected: {
    color: Colors.glassmorphism.background,
  },
  languageNativeName: {
    fontSize: 14,
    color: Colors.glassmorphism.textSecondary,
  },
  languageNativeNameSelected: {
    color: Colors.glassmorphism.background + 'CC',
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.glassmorphism.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Footer
  modalFooter: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.glassmorphism.glassBorder,
  },
  footerText: {
    fontSize: 14,
    color: Colors.glassmorphism.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
