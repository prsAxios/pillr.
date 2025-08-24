import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";

const PIN_KEY = "@pillr_pin";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      ),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      try {
        // Check if PIN is stored
        const storedPin = await AsyncStorage.getItem(PIN_KEY);
        
        if (!storedPin) {
          // No PIN set up, go to home (first time user)
          router.replace("/home");
        } else {
          // PIN exists, go to auth screen for verification
          router.replace("/auth");
        }
      } catch (error) {
        console.log("Auth check error, going to home:", error);
        router.replace("/home");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Subtle background pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.patternLine} />
        <View style={styles.patternLine} />
        <View style={styles.patternLine} />
      </View>

      {/* Animated glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnim,
            transform: [{ scale: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.3]
            }) }],
          },
        ]}
      >
        <View style={styles.glow} />
      </Animated.View>
      
      {/* Main logo and branding */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoAnim,
            transform: [{ scale: logoAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1]
            }) }],
          },
        ]}
      >
        <View style={styles.logoBackground}>
          <View style={styles.logoIcon}>
            <Ionicons name="medical" size={60} color={Colors.glassmorphism.primary} />
          </View>
        </View>
        
        <Animated.View
          style={[
            styles.brandingContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              }) }],
            },
          ]}
        >
          <Text style={styles.appName}>Pillr</Text>
          <Text style={styles.tagline}>Your AI-Powered Medication Companion</Text>
        </Animated.View>
      </Animated.View>

      {/* Subtle loading indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.loadingDots}>
          <View style={[styles.dot, { opacity: 0.3 }]} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 1 }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.glassmorphism.background,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
  },
  patternLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: Colors.glassmorphism.primary,
    opacity: 0.1,
  },
  glowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.glassmorphism.primary,
    opacity: 0.03,
    shadowColor: Colors.glassmorphism.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 100,
    elevation: 20,
  },
  logoContainer: {
    alignItems: "center",
    zIndex: 1,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.glassmorphism.glass,
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.glassmorphism.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.glassmorphism.highlight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassmorphism.glassBorder,
  },
  brandingContainer: {
    alignItems: "center",
  },
  appName: {
    color: Colors.glassmorphism.primary,
    fontSize: 48,
    fontWeight: "300",
    letterSpacing: 8,
    marginBottom: 16,
    fontFamily: 'System',
  },
  tagline: {
    color: Colors.glassmorphism.textSecondary,
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.glassmorphism.primary,
  },
});
