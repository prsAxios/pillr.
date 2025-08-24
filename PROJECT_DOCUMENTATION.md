# Pillr - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Flow](#architecture--flow)
3. [File Structure & Dependencies](#file-structure--dependencies)
4. [Core Components](#core-components)
5. [Authentication System](#authentication-system)
6. [Navigation & Routing](#navigation--routing)
7. [UI/UX Design System](#uiux-design-system)
8. [Data Management](#data-management)
9. [Animations & Interactions](#animations--interactions)
10. [Platform-Specific Features](#platform-specific-features)
11. [Development & Build Process](#development--build-process)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Pillr** is an AI-powered medication reminder application built with React Native and Expo. The app provides a secure, intuitive interface for managing medications, tracking doses, scheduling reminders, and monitoring refills with a sophisticated glassmorphism design.

### Key Features
- **Secure Authentication**: Biometric (Face ID/Touch ID) + PIN-based authentication
- **Medication Management**: Add, edit, and track medications with detailed scheduling
- **Smart Reminders**: Push notification system for medication doses
- **Refill Tracking**: Monitor medication supplies and get refill alerts
- **Calendar View**: Visual calendar interface for medication schedules
- **History Tracking**: Comprehensive dose history and analytics
- **Modern UI**: Pure black and white glassmorphism design with smooth animations

---

## Architecture & Flow

### Application Flow
```
App Launch → Splash Screen → Authentication Check → Route Decision
                                    ↓
                            ┌─────────────┬─────────────┐
                            │   No PIN   │   Has PIN  │
                            │  (First    │ (Returning │
                            │   Time)    │   User)    │
                            └─────────────┴─────────────┘
                                    ↓
                            ┌─────────────┬─────────────┐
                            │   Home      │   Auth     │
                            │  (Setup)    │ (Verify)   │
                            └─────────────┴─────────────┘
                                    ↓
                            ┌─────────────┬─────────────┐
                            │ PIN Setup  │ PIN Verify │
                            │  Flow      │  Flow      │
                            └─────────────┴─────────────┘
                                    ↓
                            ┌─────────────┬─────────────┐
                            │   Home      │   Home     │
                            │  Screen     │  Screen    │
                            └─────────────┴─────────────┘
```

### State Management
- **Local Storage**: AsyncStorage for persistent data (PIN, medications, history)
- **Component State**: React hooks for local component state
- **Navigation State**: Expo Router for navigation state management
- **Authentication State**: Local state + AsyncStorage for PIN persistence

---

## File Structure & Dependencies

### Project Configuration Files

#### `package.json`
```json
{
  "name": "pillr",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-local-authentication": "~14.0.0",
    "@react-native-async-storage/async-storage": "1.21.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-notifications": "~0.27.0"
  }
}
```

**Purpose**: Defines project metadata, dependencies, and scripts
**Key Dependencies**:
- `expo`: Core Expo framework
- `expo-router`: File-based routing system
- `expo-local-authentication`: Biometric authentication
- `@react-native-async-storage/async-storage`: Persistent storage
- `expo-linear-gradient`: Gradient effects
- `expo-notifications`: Push notifications

#### `app.json`
```json
{
  "expo": {
    "name": "Pillr",
    "slug": "pillr",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "plugins": [
      "expo-router",
      ["expo-splash-screen", {...}]
    ]
  }
}
```

**Purpose**: Expo project configuration and metadata
**Key Settings**:
- App name and branding
- Splash screen configuration
- Plugin configurations
- Platform-specific settings

#### `tsconfig.json`
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

**Purpose**: TypeScript configuration for type safety and IntelliSense

---

## Core Components

### Entry Points

#### `app/_layout.tsx` - Root Layout
**Purpose**: Root navigation container and global configuration
**Key Features**:
- Stack navigation setup
- Status bar configuration
- Global background color
- Navigation animations

```typescript
export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.glassmorphism.background },
          animation: "slide_from_right",
        }}
      >
        {/* Navigation screens */}
      </Stack>
    </>
  );
}
```

#### `app/index.tsx` - Splash Screen
**Purpose**: Initial app launch screen with authentication routing logic
**Key Features**:
- Animated logo and branding
- Authentication state check
- Conditional routing based on PIN existence
- Smooth entrance animations

**Authentication Logic**:
```typescript
const checkAuth = async () => {
  try {
    const storedPin = await AsyncStorage.getItem(PIN_KEY);
    
    if (!storedPin) {
      router.replace("/home"); // First time user
    } else {
      router.replace("/auth"); // Returning user
    }
  } catch (error) {
    router.replace("/home"); // Fallback
  }
};
```

**Animation System**:
```typescript
useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, { toValue: 1, duration: 1200 }),
    Animated.spring(scaleAnim, { toValue: 1, tension: 10, friction: 2 }),
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2000 }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2000 }),
    ]))
  ]).start();
}, []);
```

### Authentication System

#### `app/auth.tsx` - Authentication Screen
**Purpose**: Handles both PIN setup (first time) and PIN verification (returning users)
**Key Features**:
- Dual-mode operation (setup vs. verification)
- Biometric authentication support
- PIN validation and confirmation
- Secure storage using AsyncStorage

**PIN Setup Flow**:
```typescript
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
    await AsyncStorage.setItem(PIN_KEY, pin);
    router.replace("/home");
  } catch (err) {
    setError("Failed to save PIN. Please try again.");
  }
};
```

**PIN Verification Flow**:
```typescript
const verifyPin = async () => {
  try {
    const storedPin = await AsyncStorage.getItem(PIN_KEY);
    
    if (storedPin === enteredPin) {
      router.replace("/home");
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  } catch (err) {
    setError("An error occurred during verification.");
  }
};
```

**Biometric Authentication**:
```typescript
const authenticateWithBiometrics = async () => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access Pillr",
      cancelLabel: "Use PIN",
    });

    if (result.success) {
      router.replace("/home");
    } else if (result.error === "user_fallback") {
      setIsVerifyingPin(true); // Fallback to PIN
    }
  } catch (err) {
    setError("Biometric authentication failed.");
  }
};
```

### Main Application Screens

#### `app/home.tsx` - Home Dashboard
**Purpose**: Central hub for medication management and quick actions
**Key Features**:
- Quick action buttons (Add Medication, Take Dose, View Calendar)
- Today's medications with dose tracking
- Progress indicators and status badges
- Notifications modal with glassmorphism design

**Quick Actions System**:
```typescript
const QUICK_ACTIONS = [
  {
    id: 'add',
    title: 'Add Medication',
    icon: 'add-circle-outline',
    action: () => router.push('/medications/add'),
    color: Colors.glassmorphism.primary
  },
  {
    id: 'dose',
    title: 'Take Dose',
    icon: 'checkmark-circle-outline',
    action: () => handleTakeDose(),
    color: Colors.glassmorphism.success
  },
  // ... more actions
];
```

**Circular Progress Component**:
```typescript
const CircularProgress = ({ progress, size = 60, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.progressContainer}>
      <Svg width={size} height={size}>
        <Circle
          stroke={Colors.glassmorphism.glassBorder}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={Colors.glassmorphism.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );
};
```

#### `app/medications/add.tsx` - Add Medication
**Purpose**: Comprehensive medication setup and configuration
**Key Features**:
- Multi-step form with sections
- Time picker and date selection
- Dosage and frequency options
- Notification preferences
- Form validation

**Form Structure**:
```typescript
const [formData, setFormData] = useState({
  name: '',
  dosage: '',
  frequency: 'daily',
  time: new Date(),
  startDate: new Date(),
  endDate: null,
  notifications: true,
  notes: ''
});
```

**Section-based Layout**:
```typescript
const sections = [
  { id: 'basic', title: 'Basic Information', icon: 'information-circle-outline' },
  { id: 'schedule', title: 'Schedule & Timing', icon: 'time-outline' },
  { id: 'notifications', title: 'Notifications', icon: 'notifications-outline' },
  { id: 'notes', title: 'Additional Notes', icon: 'document-text-outline' }
];
```

#### `app/calendar/index.tsx` - Calendar View
**Purpose**: Visual calendar interface for medication scheduling
**Key Features**:
- Monthly calendar grid
- Event indicators for medication doses
- Daily schedule view
- Dose tracking and completion

**Calendar Logic**:
```typescript
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= lastDay || days.length < 42) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
};
```

**Event Rendering**:
```typescript
const renderEventDots = (date: Date) => {
  const dayEvents = getEventsForDate(date);
  
  return dayEvents.map((event, index) => (
    <View
      key={index}
      style={[
        styles.eventDot,
        { backgroundColor: event.completed ? Colors.glassmorphism.success : Colors.glassmorphism.primary }
      ]}
    />
  ));
};
```

#### `app/refills/index.tsx` - Refill Management
**Purpose**: Track medication supplies and manage refills
**Key Features**:
- Medication inventory tracking
- Refill reminders and alerts
- Progress bars for supply levels
- Quick refill actions

**Supply Tracking**:
```typescript
const calculateSupplyStatus = (medication) => {
  const daysRemaining = Math.ceil(medication.pillsRemaining / medication.dailyDoses);
  
  if (daysRemaining <= 3) return 'critical';
  if (daysRemaining <= 7) return 'low';
  if (daysRemaining <= 14) return 'medium';
  return 'good';
};
```

#### `app/history/index.tsx` - Dose History
**Purpose**: Comprehensive tracking of medication adherence and history
**Key Features**:
- Chronological dose history
- Filtering by date ranges
- Status indicators (taken, missed, skipped)
- Data export and clearing

**History Grouping**:
```typescript
const groupHistoryByDate = (history) => {
  const groups = {};
  
  history.forEach(item => {
    const date = new Date(item.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  });
  
  return Object.entries(groups).sort(([a], [b]) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
};
```

---

## UI/UX Design System

### Color Scheme (`constants/Colors.ts`)

**Pure Black and White Glassmorphism Theme**:
```typescript
glassmorphism: {
  primary: '#ffffff',           // Pure white for primary actions
  secondary: '#f0f0f0',        // Slightly off-white for secondary elements
  background: '#000000',        // Pure black background
  surface: '#0a0a0a',          // Dark grey for elevated surfaces
  card: 'rgba(255, 255, 255, 0.08)',      // White with transparency
  cardBorder: 'rgba(255, 255, 255, 0.12)', // Semi-transparent borders
  text: '#ffffff',              // Pure white text
  textSecondary: 'rgba(255, 255, 255, 0.7)', // Secondary text
  glass: 'rgba(255, 255, 255, 0.05)',        // Glass elements
  glassBorder: 'rgba(255, 255, 255, 0.1)',   // Glass borders
  shadow: 'rgba(0, 0, 0, 0.5)',              // Shadows
  highlight: 'rgba(255, 255, 255, 0.15)',    // Interactive highlights
}
```

### Design Principles
1. **Glassmorphism**: Translucent elements with subtle borders and shadows
2. **Pure Contrast**: Black backgrounds with white elements for maximum readability
3. **Layered Depth**: Multiple transparency levels for visual hierarchy
4. **Smooth Transitions**: Consistent animation timing and easing
5. **Accessibility**: High contrast ratios and clear visual feedback

### Component Styling Patterns

**Glassmorphism Cards**:
```typescript
const cardStyles = {
  backgroundColor: Colors.glassmorphism.card,
  borderRadius: 25,
  borderWidth: 1,
  borderColor: Colors.glassmorphism.cardBorder,
  shadowColor: Colors.glassmorphism.shadow,
  shadowOffset: { width: 0, height: 15 },
  shadowOpacity: 0.4,
  shadowRadius: 25,
  elevation: 20,
};
```

**Input Fields**:
```typescript
const inputStyles = {
  backgroundColor: Colors.glassmorphism.glass,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: Colors.glassmorphism.glassBorder,
  shadowColor: Colors.glassmorphism.shadow,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 5,
};
```

---

## Animations & Interactions

### Animation System Overview

**GSAP-like Animations**: Custom animation system built with React Native's Animated API
**Animation Types**: Fade, slide, scale, and staggered animations
**Performance**: Uses `useNativeDriver: true` where possible for optimal performance

### Common Animation Patterns

**Entrance Animations**:
```typescript
const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(50)).current;
const scaleAnim = useRef(new Animated.Value(0.9)).current;

useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
  ]).start();
}, []);
```

**Staggered Animations**:
```typescript
const animateItems = (items, delay = 100) => {
  items.forEach((item, index) => {
    Animated.timing(item.anim, {
      toValue: 1,
      duration: 600,
      delay: index * delay,
      useNativeDriver: true
    }).start();
  });
};
```

**Interactive Animations**:
```typescript
const handlePressIn = () => {
  Animated.spring(scaleAnim, {
    toValue: 0.95,
    tension: 100,
    friction: 5,
    useNativeDriver: true
  }).start();
};

const handlePressOut = () => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    tension: 100,
    friction: 5,
    useNativeDriver: true
  }).start();
};
```

---

## Data Management

### Storage Strategy

**AsyncStorage Keys**:
- `@pillr_pin`: User authentication PIN
- `@pillr_medications`: Medication list and configurations
- `@pillr_dose_history`: Dose tracking history
- `@pillr_refills`: Refill tracking data
- `@pillr_notifications`: Notification preferences

**Data Structure Examples**:

**Medication Object**:
```typescript
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'custom';
  time: Date;
  startDate: Date;
  endDate?: Date;
  notifications: boolean;
  notes?: string;
  pillsRemaining: number;
  dailyDoses: number;
}
```

**Dose History Item**:
```typescript
interface DoseHistory {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: Date;
  status: 'taken' | 'missed' | 'skipped';
  dosage: string;
  notes?: string;
}
```

### Data Persistence

**Storage Operations**:
```typescript
// Save data
const saveData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// Load data
const loadData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
};
```

---

## Navigation & Routing

### Expo Router Configuration

**File-based Routing**: Each file in the `app/` directory becomes a route
**Stack Navigation**: Uses React Navigation's Stack Navigator under the hood
**Deep Linking**: Automatic deep linking support for external app integration

**Route Structure**:
```
/                   → Splash Screen (index.tsx)
/auth              → Authentication (auth.tsx)
/home              → Home Dashboard (home.tsx)
/medications/add   → Add Medication (medications/add.tsx)
/calendar          → Calendar View (calendar/index.tsx)
/refills           → Refill Management (refills/index.tsx)
/history           → Dose History (history/index.tsx)
```

**Navigation Methods**:
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to screen
router.push('/medications/add');

// Replace current screen
router.replace('/home');

// Go back
router.back();
```

---

## Platform-Specific Features

### iOS Features
- **Face ID/Touch ID**: Native biometric authentication
- **Haptic Feedback**: Tactile response for interactions
- **Status Bar**: Light content style for dark theme
- **Safe Area**: Automatic safe area handling

### Android Features
- **Fingerprint**: Biometric authentication support
- **Material Design**: Consistent with Android design patterns
- **Back Button**: Hardware back button support
- **Elevation**: Shadow effects using elevation property

### Cross-Platform Considerations
- **Responsive Design**: Adapts to different screen sizes
- **Platform APIs**: Uses platform-specific APIs when available
- **Fallbacks**: Graceful degradation for unsupported features

---

## Development & Build Process

### Development Setup

**Prerequisites**:
- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

**Installation**:
```bash
# Clone repository
git clone <repository-url>
cd medicine-reminder-app

# Install dependencies
npm install

# Start development server
npm start
```

**Development Commands**:
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

### Build Process

**Expo Build**:
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

**EAS Build** (Recommended):
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
```

---

## Troubleshooting

### Common Issues & Solutions

**1. Authentication Bypass**
- **Issue**: App redirects to home without PIN verification
- **Solution**: Check PIN storage in AsyncStorage and authentication flow logic

**2. Animation Performance**
- **Issue**: Animations are choppy or slow
- **Solution**: Use `useNativeDriver: true` where possible, optimize animation complexity

**3. Storage Issues**
- **Issue**: Data not persisting between app launches
- **Solution**: Verify AsyncStorage implementation and error handling

**4. Navigation Problems**
- **Issue**: Routes not working or navigation errors
- **Solution**: Check file structure in `app/` directory and route naming

**5. Build Failures**
- **Issue**: App fails to build or run
- **Solution**: Verify dependencies, clear cache, check platform-specific requirements

### Debug Tools

**Expo DevTools**:
- Built-in debugging and inspection tools
- Network request monitoring
- Performance profiling

**React Native Debugger**:
- Advanced debugging capabilities
- Redux DevTools integration
- Network inspection

**Console Logging**:
```typescript
// Development logging
if (__DEV__) {
  console.log('Debug info:', data);
}

// Error logging
console.error('Error occurred:', error);
```

---

## Future Enhancements

### Planned Features
1. **Cloud Sync**: Multi-device data synchronization
2. **AI Integration**: Smart medication recommendations
3. **Health Integration**: Apple Health/Google Fit integration
4. **Offline Support**: Enhanced offline functionality
5. **Analytics**: Medication adherence analytics and insights

### Technical Improvements
1. **State Management**: Redux or Zustand for complex state
2. **Testing**: Unit and integration test coverage
3. **Performance**: React Native performance optimizations
4. **Accessibility**: Enhanced accessibility features
5. **Internationalization**: Multi-language support

---

## Conclusion

Pillr represents a modern, secure, and user-friendly approach to medication management. The application combines cutting-edge mobile development technologies with thoughtful UX design to create an intuitive healthcare companion.

The project demonstrates best practices in:
- **Security**: Biometric authentication and secure PIN storage
- **Performance**: Optimized animations and efficient data management
- **Design**: Consistent glassmorphism design system
- **Architecture**: Clean separation of concerns and modular components
- **User Experience**: Smooth interactions and intuitive navigation

This documentation provides a comprehensive overview of the project's architecture, implementation details, and development workflow. For specific technical questions or implementation details, refer to the relevant code sections and component documentation.
