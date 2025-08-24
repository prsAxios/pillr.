import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import Colors from "../constants/Colors";
import "../utils/i18n"; // Initialize i18n

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.glassmorphism.background },
          animation: "slide_from_right",
          header: () => null,
          navigationBarHidden: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="home" />
        <Stack.Screen name="medications/add" />
        <Stack.Screen name="medications/scan" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="refills" />
        <Stack.Screen name="history" />
      </Stack>
    </>
  );
}
