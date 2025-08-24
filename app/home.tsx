import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import Colors from "../constants/Colors";
import LanguageSelector from "../components/LanguageSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

interface Medication {
  id: number;
  name: string;
  time: string;
  taken: boolean;
  dosage: string;
  totalDoses: number;
  takenDoses: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todaysProgress, setTodaysProgress] = useState({ total: 0, taken: 0 });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const quickActionsAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();

    // Staggered animation for quick actions
    setTimeout(() => {
      Animated.timing(quickActionsAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, 300);

    // Load medications and calculate progress
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const storedMedications = await AsyncStorage.getItem('medications');
      if (storedMedications) {
        const parsedMedications = JSON.parse(storedMedications);
        setMedications(parsedMedications);
        
        // Calculate today's progress
        const today = new Date().toDateString();
        const todaysMeds = parsedMedications.filter((med: Medication) => {
          // For demo purposes, show all medications as today's
          return true;
        });
        
        const total = todaysMeds.reduce((sum: number, med: Medication) => sum + med.totalDoses, 0);
        const taken = todaysMeds.reduce((sum: number, med: Medication) => sum + med.takenDoses, 0);
        
        setTodaysProgress({ total, taken });
        
        // Animate progress
        Animated.timing(progressAnim, { 
          toValue: total > 0 ? taken / total : 0, 
          duration: 1000, 
          useNativeDriver: false 
        }).start();
      } else {
        // Load demo data if no stored medications
        loadDemoData();
      }
    } catch (error) {
      console.error('Error loading medications:', error);
      loadDemoData();
    }
  };

  const loadDemoData = () => {
    const demoMedications: Medication[] = [
      { id: 1, name: 'Aspirin', time: '9:00 AM', taken: false, dosage: '100mg', totalDoses: 2, takenDoses: 1 },
      { id: 2, name: 'Vitamin D', time: '12:00 PM', taken: true, dosage: '1000 IU', totalDoses: 1, takenDoses: 1 },
      { id: 3, name: 'Omega-3', time: '6:00 PM', taken: false, dosage: '1000mg', totalDoses: 1, takenDoses: 0 },
      { id: 4, name: 'Calcium', time: '8:00 PM', taken: false, dosage: '500mg', totalDoses: 1, takenDoses: 0 },
    ];
    
    setMedications(demoMedications);
    const total = demoMedications.reduce((sum, med) => sum + med.totalDoses, 0);
    const taken = demoMedications.reduce((sum, med) => sum + med.takenDoses, 0);
    setTodaysProgress({ total, taken });
    
    // Animate progress
    Animated.timing(progressAnim, { 
      toValue: total > 0 ? taken / total : 0, 
      duration: 1000, 
      useNativeDriver: false 
    }).start();
  };

  const handleTakeDose = async (medicationId: number) => {
    try {
      const updatedMedications = medications.map(med => {
        if (med.id === medicationId && med.takenDoses < med.totalDoses) {
          return { ...med, takenDoses: med.takenDoses + 1 };
        }
        return med;
      });
      
      setMedications(updatedMedications);
      await AsyncStorage.setItem('medications', JSON.stringify(updatedMedications));
      
      // Update progress
      const total = updatedMedications.reduce((sum, med) => sum + med.totalDoses, 0);
      const taken = updatedMedications.reduce((sum, med) => sum + med.takenDoses, 0);
      setTodaysProgress({ total, taken });
      
      // Animate progress
      Animated.timing(progressAnim, { 
        toValue: total > 0 ? taken / total : 0, 
        duration: 500, 
        useNativeDriver: false 
      }).start();
      
      Alert.alert('Success', 'Dose marked as taken!');
    } catch (error) {
      console.error('Error updating medication:', error);
      Alert.alert('Error', 'Failed to update medication. Please try again.');
    }
  };

  const QUICK_ACTIONS = [
    {
      id: 'scan',
      title: t('scanMedication'),
      icon: 'camera-outline',
      action: () => router.push('/medications/scan'),
      color: Colors.glassmorphism.primary,
      description: 'AI-powered medication scanning'
    },
    {
      id: 'add',
      title: t('addMedication'),
      icon: 'add-circle-outline',
      action: () => router.push('/medications/add'),
      color: Colors.glassmorphism.primary,
      description: 'Manual medication entry'
    },
    {
      id: 'dose',
      title: t('takeDose'),
      icon: 'checkmark-circle-outline',
      action: () => handleTakeDose(1), // Demo action
      color: Colors.glassmorphism.success,
      description: 'Mark dose as taken'
    },
    {
      id: 'calendar',
      title: t('viewCalendar'),
      icon: 'calendar-outline',
      action: () => router.push('/calendar'),
      color: Colors.glassmorphism.primary,
      description: 'View medication schedule'
    },
  ];

  const renderQuickAction = (action: any, index: number) => {
    return (
      <Animated.View
        key={action.id}
        style={[
          styles.quickActionCard,
          {
            opacity: quickActionsAnim,
            transform: [
              {
                translateY: quickActionsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={action.action}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[action.color, action.color]}
            style={styles.quickActionGradient}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name={action.icon} size={32} color={Colors.glassmorphism.background} />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
            <Text style={styles.quickActionDescription}>{action.description}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderProgressSpinner = () => {
    if (todaysProgress.total === 0) return null;

    const progress = todaysProgress.total > 0 ? todaysProgress.taken / todaysProgress.total : 0;
    const remaining = todaysProgress.total - todaysProgress.taken;

    return (
      <Animated.View style={[styles.progressContainer, { opacity: fadeAnim }]}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressSubtitle}>
            {todaysProgress.taken} of {todaysProgress.total} doses taken
          </Text>
        </View>
        
        <View style={styles.progressCircle}>
          <View style={styles.progressRing}>
            <Animated.View 
              style={[
                styles.progressFill,
                { 
                  transform: [{ 
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }
              ]} 
            />
          </View>
          <View style={styles.progressCenter}>
            <Text style={styles.progressPercentage}>
              {Math.round(progress * 100)}%
            </Text>
            <Text style={styles.progressRemaining}>
              {remaining} remaining
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderTodayMedications = () => {
    if (medications.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="medical-outline" size={48} color={Colors.glassmorphism.textSecondary} />
          <Text style={styles.emptyStateText}>{t('noMedications')}</Text>
        </View>
      );
    }

    return medications.map((medication, index) => (
      <Animated.View
        key={medication.id}
        style={[
          styles.medicationCard,
          {
            opacity: quickActionsAnim,
            transform: [
              {
                translateY: quickActionsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.medicationInfo}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text style={styles.medicationDetails}>
            {medication.dosage} • {medication.time}
          </Text>
          <Text style={styles.medicationProgress}>
            {medication.takenDoses}/{medication.totalDoses} doses taken
          </Text>
        </View>
        <View style={styles.medicationStatus}>
          {medication.takenDoses >= medication.totalDoses ? (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.glassmorphism.background} />
              <Text style={styles.completedText}>Complete</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.takeDoseButton}
              onPress={() => handleTakeDose(medication.id)}
            >
              <Text style={styles.takeDoseText}>Take</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    ));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.glassmorphism.background, Colors.glassmorphism.surface]}
        style={styles.gradient}
      />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.subtitle}>Welcome to Pillr</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowNotifications(true)}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.glassmorphism.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Ionicons name="language-outline" size={24} color={Colors.glassmorphism.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          
          {/* Progress Spinner */}
          {renderProgressSpinner()}
          
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {QUICK_ACTIONS.map((action, index) => renderQuickAction(action, index))}
            </View>
          </View>

          {/* Today's Medications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('todayMedications')}</Text>
            <View style={styles.medicationsList}>
              {renderTodayMedications()}
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationsModal}>
            <LinearGradient
              colors={[Colors.glassmorphism.card, Colors.glassmorphism.surface]}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('notifications')}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowNotifications(false)}
                >
                  <Ionicons name="close" size={24} color={Colors.glassmorphism.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
                <View style={styles.notificationItem}>
                  <Ionicons name="information-circle" size={20} color={Colors.glassmorphism.primary} />
                  <Text style={styles.notificationText}>
                    Welcome to Pillr! Your AI-powered medication companion.
                  </Text>
                </View>
                <View style={styles.notificationItem}>
                  <Ionicons name="camera" size={20} color={Colors.glassmorphism.success} />
                  <Text style={styles.notificationText}>
                    Try our new AI medication scanner for quick setup!
                  </Text>
                </View>
                <View style={styles.notificationItem}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.glassmorphism.success} />
                  <Text style={styles.notificationText}>
                    Track your daily progress with our visual progress spinner.
                  </Text>
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Language Selector */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.glassmorphism.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.glassmorphism.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glassmorphism.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },

  // Content
  content: { flex: 1, paddingHorizontal: 20 },
  mainContent: { paddingVertical: 20 },

  // Sections
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.glassmorphism.text,
    marginBottom: 20,
    letterSpacing: 0.5,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  quickActionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.glassmorphism.background + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.glassmorphism.background,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    color: Colors.glassmorphism.background + 'CC',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Medications List
  medicationsList: { gap: 12 },
  medicationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.glassmorphism.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.cardBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  medicationInfo: { flex: 1 },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.glassmorphism.text,
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
    color: Colors.glassmorphism.textSecondary,
    marginBottom: 2,
  },
  medicationProgress: {
    fontSize: 12,
    color: Colors.glassmorphism.textSecondary,
  },
  medicationStatus: { alignItems: 'center' },
  takenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glassmorphism.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  takenText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.glassmorphism.background,
    marginLeft: 4,
  },
  takeDoseButton: {
    backgroundColor: Colors.glassmorphism.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  takeDoseText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.glassmorphism.background,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glassmorphism.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.glassmorphism.background,
    marginLeft: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.glassmorphism.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsModal: {
    width: width - 40,
    maxHeight: height * 0.7,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 25,
  },
  modalGradient: { flex: 1 },
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
  notificationsList: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.glassmorphism.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.glassmorphism.text,
    marginLeft: 12,
    lineHeight: 20,
  },

  // Progress Spinner
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.glassmorphism.text,
    marginBottom: 5,
  },
  progressSubtitle: {
    fontSize: 14,
    color: Colors.glassmorphism.textSecondary,
  },
  progressCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: Colors.glassmorphism.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRing: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 10,
    borderColor: Colors.glassmorphism.glassBorder,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 10,
    borderColor: Colors.glassmorphism.primary,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.glassmorphism.text,
    marginBottom: 5,
  },
  progressRemaining: {
    fontSize: 14,
    color: Colors.glassmorphism.textSecondary,
  },
});
