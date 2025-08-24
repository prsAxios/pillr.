import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  getMedications,
  getDoseHistory,
  recordDose,
  Medication,
  DoseHistory,
} from "../../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../constants/Colors";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const { width } = Dimensions.get("window");

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseHistory, setDoseHistory] = useState<DoseHistory[]>([]);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const calendarAnim = useRef(new Animated.Value(0)).current;

  const loadData = useCallback(async () => {
    try {
      const [meds, history] = await Promise.all([
        getMedications(),
        getDoseHistory(),
      ]);
      setMedications(meds);
      setDoseHistory(history);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    }
  }, [selectedDate]);

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(calendarAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(selectedDate);

  const renderCalendar = () => {
    const calendar: JSX.Element[] = [];
    let week: JSX.Element[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add days of the month
    for (let day = 1; day <= days; day++) {
      const date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        day
      );
      const isToday = new Date().toDateString() === date.toDateString();
      const hasDoses = doseHistory.some(
        (dose) =>
          new Date(dose.timestamp).toDateString() === date.toDateString()
      );

      week.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isToday && styles.today,
            hasDoses && styles.hasEvents,
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>
            {day}
          </Text>
          {hasDoses && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );

      if ((firstDay + day) % 7 === 0 || day === days) {
        calendar.push(
          <View key={day} style={styles.calendarWeek}>
            {week}
          </View>
        );
        week = [];
      }
    }

    return calendar;
  };

  const renderMedicationsForDate = () => {
    const dateStr = selectedDate.toDateString();
    const dayDoses = doseHistory.filter(
      (dose) => new Date(dose.timestamp).toDateString() === dateStr
    );

    return medications.map((medication) => {
      const taken = dayDoses.some(
        (dose) => dose.medicationId === medication.id && dose.taken
      );

      return (
        <View key={medication.id} style={styles.medicationCard}>
          <View
            style={[
              styles.medicationColor,
              { backgroundColor: Colors.glassmorphism.primary },
            ]}
          />
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.medicationDosage}>{medication.dosage}</Text>
            <Text style={styles.medicationTime}>{medication.times[0]}</Text>
          </View>
          {taken ? (
            <View style={styles.takenBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.glassmorphism.primary} />
              <Text style={styles.takenText}>Taken</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.takeDoseButton,
                { backgroundColor: Colors.glassmorphism.primary },
              ]}
              onPress={async () => {
                await recordDose(medication.id, true, new Date().toISOString());
                loadData();
              }}
            >
              <Text style={styles.takeDoseText}>Take</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.glassmorphism.background, Colors.glassmorphism.surface]}
        style={styles.headerGradient}
      />

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={Colors.glassmorphism.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>

        <Animated.View 
          style={[
            styles.calendarContainer,
            {
              opacity: calendarAnim,
              transform: [{ scale: calendarAnim }]
            }
          ]}
        >
          <View style={styles.monthHeader}>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() - 1,
                    1
                  )
                )
              }
              style={styles.navButton}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.glassmorphism.text} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {selectedDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() + 1,
                    1
                  )
                )
              }
              style={styles.navButton}
            >
              <Ionicons name="chevron-forward" size={24} color={Colors.glassmorphism.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekdayHeader}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {renderCalendar()}
        </Animated.View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>
            {selectedDate.toLocaleDateString("default", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderMedicationsForDate()}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.glassmorphism.background,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 140 : 120,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.glassmorphism.glass,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.glassmorphism.primary,
    marginLeft: 15,
    letterSpacing: 0.5,
  },
  calendarContainer: {
    backgroundColor: Colors.glassmorphism.card,
    borderRadius: 20,
    margin: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.cardBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.glassmorphism.text,
    letterSpacing: 0.5,
  },
  navButton: {
    padding: 10,
    backgroundColor: Colors.glassmorphism.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    color: Colors.glassmorphism.textSecondary,
    fontWeight: "500",
    fontSize: 14,
  },
  calendarWeek: {
    flexDirection: "row",
    marginBottom: 8,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    margin: 2,
  },
  dayText: {
    fontSize: 16,
    color: Colors.glassmorphism.text,
    fontWeight: "500",
  },
  today: {
    backgroundColor: Colors.glassmorphism.primary + '20',
    borderWidth: 1,
    borderColor: Colors.glassmorphism.primary + '40',
  },
  todayText: {
    color: Colors.glassmorphism.primary,
    fontWeight: "600",
  },
  hasEvents: {
    position: "relative",
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.glassmorphism.primary,
    position: "absolute",
    bottom: "15%",
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: Colors.glassmorphism.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.cardBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  scheduleTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.glassmorphism.text,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  medicationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.glassmorphism.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.cardBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  medicationColor: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginRight: 15,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.glassmorphism.text,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  medicationDosage: {
    fontSize: 15,
    color: Colors.glassmorphism.textSecondary,
    marginBottom: 2,
  },
  medicationTime: {
    fontSize: 15,
    color: Colors.glassmorphism.textSecondary,
  },
  takeDoseButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  takeDoseText: {
    color: Colors.glassmorphism.background,
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  takenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.glassmorphism.glass,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  takenText: {
    color: Colors.glassmorphism.primary,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  navButton: {
    padding: 10,
    backgroundColor: Colors.glassmorphism.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
});
