import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import {
  getMedications,
  Medication,
  updateMedication,
} from "../../utils/storage";
import { scheduleRefillReminder } from "../../utils/notifications";
import Colors from "../../constants/Colors";

const { width } = Dimensions.get("window");

export default function RefillTrackerScreen() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const loadMedications = useCallback(async () => {
    try {
      const allMedications = await getMedications();
      setMedications(allMedications);
    } catch (error) {
      console.error("Error loading medications:", error);
    }
  }, []);

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
    ]).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [loadMedications])
  );

  const handleRefill = async (medication: Medication) => {
    try {
      const updatedMedication = {
        ...medication,
        currentSupply: medication.totalSupply,
        lastRefillDate: new Date().toISOString(),
      };

      await updateMedication(updatedMedication);
      await loadMedications();

      Alert.alert(
        "Refill Recorded",
        `${medication.name} has been refilled to ${medication.totalSupply} units.`
      );
    } catch (error) {
      console.error("Error recording refill:", error);
      Alert.alert("Error", "Failed to record refill. Please try again.");
    }
  };

  const getSupplyStatus = (medication: Medication) => {
    const percentage =
      (medication.currentSupply / medication.totalSupply) * 100;
    if (percentage <= medication.refillAt) {
      return {
        status: "Low",
        color: Colors.glassmorphism.error,
        backgroundColor: Colors.glassmorphism.error + '20',
      };
    } else if (percentage <= 50) {
      return {
        status: "Medium",
        color: Colors.glassmorphism.warning,
        backgroundColor: Colors.glassmorphism.warning + '20',
      };
    } else {
      return {
        status: "Good",
        color: Colors.glassmorphism.primary,
        backgroundColor: Colors.glassmorphism.primary + '20',
      };
    }
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
          <Text style={styles.headerTitle}>Refill Tracker</Text>
        </View>

        <ScrollView
          style={styles.medicationsContainer}
          showsVerticalScrollIndicator={false}
        >
          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color={Colors.glassmorphism.textTertiary} />
              <Text style={styles.emptyStateText}>No medications to track</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/medications/add")}
              >
                <Text style={styles.addButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </View>
          ) : (
            medications.map((medication, index) => {
              const supplyStatus = getSupplyStatus(medication);
              const supplyPercentage =
                (medication.currentSupply / medication.totalSupply) * 100;

              return (
                <Animated.View 
                  key={medication.id} 
                  style={[
                    styles.medicationCard,
                    {
                      opacity: fadeAnim,
                      transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                      ]
                    }
                  ]}
                >
                  <View style={styles.medicationHeader}>
                    <View
                      style={[
                        styles.medicationColor,
                        { backgroundColor: Colors.glassmorphism.primary },
                      ]}
                    />
                    <View style={styles.medicationInfo}>
                      <Text style={styles.medicationName}>
                        {medication.name}
                      </Text>
                      <Text style={styles.medicationDosage}>
                        {medication.dosage}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: supplyStatus.backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: supplyStatus.color },
                        ]}
                      >
                        {supplyStatus.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.supplyContainer}>
                    <View style={styles.supplyInfo}>
                      <Text style={styles.supplyLabel}>Current Supply</Text>
                      <Text style={styles.supplyValue}>
                        {medication.currentSupply} units
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <Animated.View
                          style={[
                            styles.progressBar,
                            {
                              width: `${supplyPercentage}%`,
                              backgroundColor: supplyStatus.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {Math.round(supplyPercentage)}%
                      </Text>
                    </View>
                    <View style={styles.refillInfo}>
                      <Text style={styles.refillLabel}>
                        Refill at: {medication.refillAt}%
                      </Text>
                      {medication.lastRefillDate && (
                        <Text style={styles.lastRefillDate}>
                          Last refill:{" "}
                          {new Date(
                            medication.lastRefillDate
                          ).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.refillButton,
                      {
                        backgroundColor:
                          supplyPercentage < 100 ? Colors.glassmorphism.primary : Colors.glassmorphism.glass,
                      },
                    ]}
                    onPress={() => handleRefill(medication)}
                    disabled={supplyPercentage >= 100}
                  >
                    <Text style={styles.refillButtonText}>Record Refill</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          )}
        </ScrollView>
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
  medicationsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  medicationCard: {
    backgroundColor: Colors.glassmorphism.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.cardBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  medicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  medicationColor: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginRight: 16,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.glassmorphism.text,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  medicationDosage: {
    fontSize: 15,
    color: Colors.glassmorphism.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  supplyContainer: {
    marginBottom: 20,
  },
  supplyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  supplyLabel: {
    fontSize: 15,
    color: Colors.glassmorphism.textSecondary,
    fontWeight: "500",
  },
  supplyValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.glassmorphism.text,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: Colors.glassmorphism.glass,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: Colors.glassmorphism.textSecondary,
    marginTop: 6,
    textAlign: "right",
    fontWeight: "500",
  },
  refillInfo: {
    marginTop: 12,
  },
  refillLabel: {
    fontSize: 13,
    color: Colors.glassmorphism.textSecondary,
    fontWeight: "500",
  },
  lastRefillDate: {
    fontSize: 13,
    color: Colors.glassmorphism.textTertiary,
    marginTop: 4,
  },
  refillButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  refillButtonText: {
    color: Colors.glassmorphism.background,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: Colors.glassmorphism.card,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.cardBorder,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.glassmorphism.textSecondary,
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: Colors.glassmorphism.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  addButtonText: {
    color: Colors.glassmorphism.background,
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
