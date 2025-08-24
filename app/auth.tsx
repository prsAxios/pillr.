import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";

const { width } = Dimensions.get("window");
const PIN_KEY = "@pillr_pin";

export default function AuthScreen() {
  const router = useRouter();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSettingUpPin, setIsSettingUpPin] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    checkSetup();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const checkSetup = async () => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_KEY);
      setIsFirstTime(!storedPin);
    } catch (error) {
      console.log("Setup check error:", error);
      setIsFirstTime(true);
    }
  };

  const setupPin = async () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    
    if (pin !== confirmPin) {
      setError("PINs don't match");
      return;
    }

    try {
      setIsSettingUpPin(true);
      await AsyncStorage.setItem(PIN_KEY, pin);
      router.replace("/home");
    } catch (err) {
      setError("Failed to save PIN. Please try again.");
      console.error(err);
    } finally {
      setIsSettingUpPin(false);
    }
  };

  const verifyPin = async () => {
    if (enteredPin.length < 4) {
      setError("Please enter your PIN");
      return;
    }

    try {
      setIsVerifyingPin(true);
      const storedPin = await AsyncStorage.getItem(PIN_KEY);

      if (storedPin === enteredPin) {
        router.replace("/home");
      } else {
        setError("Incorrect PIN. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
      console.error(err);
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const setError = (message: string) => {
    Alert.alert("Error", message);
  };

  if (isFirstTime) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.glassmorphism.background, Colors.glassmorphism.surface]} style={styles.gradient} />
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="medkit-outline" size={80} color={Colors.glassmorphism.primary} />
            </View>
          </View>
          <Text style={styles.title}>Pillr</Text>
          <Text style={styles.subtitle}>Your AI-Powered Medication Companion</Text>
          <View style={styles.card}>
            <Text style={styles.welcomeText}>Welcome to Pillr!</Text>
            <Text style={styles.instructionText}>Set up a PIN to secure your medications</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter PIN (4-6 digits)</Text>
              <TextInput 
                style={styles.input} 
                value={pin} 
                onChangeText={setPin} 
                placeholder="Enter PIN" 
                placeholderTextColor={Colors.glassmorphism.textSecondary} 
                keyboardType="numeric" 
                secureTextEntry 
                maxLength={6} 
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm PIN</Text>
              <TextInput 
                style={styles.input} 
                value={confirmPin} 
                onChangeText={setConfirmPin} 
                placeholder="Confirm PIN" 
                placeholderTextColor={Colors.glassmorphism.textSecondary} 
                keyboardType="numeric" 
                secureTextEntry 
                maxLength={6} 
              />
            </View>
            <TouchableOpacity 
              style={[styles.button, isSettingUpPin && styles.buttonDisabled]} 
              onPress={setupPin} 
              disabled={isSettingUpPin}
            >
              <LinearGradient colors={[Colors.glassmorphism.primary, Colors.glassmorphism.primary]} style={styles.buttonGradient}>
                <Ionicons name="keypad-outline" size={24} color={Colors.glassmorphism.background} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{isSettingUpPin ? "Setting up..." : "Set Up PIN"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.glassmorphism.background, Colors.glassmorphism.surface]} style={styles.gradient} />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Ionicons name="medkit-outline" size={80} color={Colors.glassmorphism.primary} />
          </View>
        </View>
        <Text style={styles.title}>Pillr</Text>
        <Text style={styles.subtitle}>Your AI-Powered Medication Companion</Text>
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.instructionText}>Enter your PIN to access your medications</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter PIN</Text>
            <TextInput 
              style={styles.input} 
              value={enteredPin} 
              onChangeText={setEnteredPin} 
              placeholder="Enter PIN" 
              placeholderTextColor={Colors.glassmorphism.textSecondary} 
              keyboardType="numeric" 
              secureTextEntry 
              maxLength={6} 
            />
          </View>
          <TouchableOpacity 
            style={[styles.button, isVerifyingPin && styles.buttonDisabled]} 
            onPress={verifyPin} 
            disabled={isVerifyingPin}
          >
            <LinearGradient colors={[Colors.glassmorphism.primary, Colors.glassmorphism.primary]} style={styles.buttonGradient}>
              <Ionicons name="keypad-outline" size={24} color={Colors.glassmorphism.background} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{isVerifyingPin ? "Verifying..." : "Verify PIN"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
  content: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center", },
  logoContainer: { width: 120, height: 120, backgroundColor: Colors.glassmorphism.glass, borderRadius: 60, justifyContent: "center", alignItems: "center", marginBottom: 30, borderWidth: 1, borderColor: Colors.glassmorphism.glassBorder, shadowColor: Colors.glassmorphism.shadow, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 40, elevation: 20, },
  logoBackground: { width: 100, height: 100, backgroundColor: Colors.glassmorphism.highlight, borderRadius: 50, justifyContent: "center", alignItems: "center", },
  title: { fontSize: 42, fontWeight: "bold", color: Colors.glassmorphism.text, marginBottom: 10, letterSpacing: 2, textShadowColor: Colors.glassmorphism.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15, },
  subtitle: { fontSize: 16, color: Colors.glassmorphism.textSecondary, textAlign: "center", marginBottom: 40, paddingHorizontal: 20, letterSpacing: 0.5, },
  card: { width: "100%", maxWidth: 400, backgroundColor: Colors.glassmorphism.card, borderRadius: 25, padding: 30, alignItems: "center", borderWidth: 1, borderColor: Colors.glassmorphism.cardBorder, shadowColor: Colors.glassmorphism.shadow, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 25, elevation: 20, },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: Colors.glassmorphism.text, marginBottom: 15, letterSpacing: 0.5, },
  instructionText: { fontSize: 15, color: Colors.glassmorphism.textSecondary, textAlign: "center", marginBottom: 30, lineHeight: 22, },
  inputContainer: { width: "100%", marginBottom: 20, },
  inputLabel: { fontSize: 14, color: Colors.glassmorphism.textSecondary, marginBottom: 8, fontWeight: "500", letterSpacing: 0.3, },
  input: { width: "100%", height: 55, backgroundColor: Colors.glassmorphism.glass, borderRadius: 15, paddingHorizontal: 20, fontSize: 18, color: Colors.glassmorphism.text, borderWidth: 1, borderColor: Colors.glassmorphism.glassBorder, shadowColor: Colors.glassmorphism.shadow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5, },
  button: { width: "100%", borderRadius: 18, overflow: "hidden", marginBottom: 15, shadowColor: Colors.glassmorphism.shadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10, },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18, },
  buttonIcon: { marginRight: 10 },
  buttonText: { color: Colors.glassmorphism.background, fontSize: 18, fontWeight: "600", letterSpacing: 0.8, },
});
