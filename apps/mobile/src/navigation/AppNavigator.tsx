import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Import auth screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Import app screens
import HomeScreen from '../screens/home/HomeScreen';
import DiscoveryScreen from '../screens/discovery/DiscoveryScreen';
import BookingScreen from '../screens/bookings/BookingScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SocialScreen from '../screens/social/SocialScreen';

// Import provider screens
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import ServiceManagementScreen from '../screens/provider/ServiceManagementScreen';
import ReviewManagementScreen from '../screens/provider/ReviewManagementScreen';

// Import payment screens
import PaymentScreen from '../screens/payments/PaymentScreen';
import PaymentHistoryScreen from '../screens/payments/PaymentHistoryScreen';

// Import chat screens
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';

// Import AI screens
import AIAssistantScreen from '../screens/ai/AIAssistantScreen';

// Define the navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main stack for the client app
function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ title: 'Provider' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Complete Payment' }} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
}

// Main tab navigation for clients
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Social') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={DiscoveryScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Provider stack for the service provider app
function ProviderStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProviderTabs" component={ProviderTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
}

// Provider tab navigation for service providers
function ProviderTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Reviews') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Assistant') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'ProviderProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Services" component={ServiceManagementScreen} options={{ title: 'My Services' }} />
      <Tab.Screen name="Reviews" component={ReviewManagementScreen} options={{ title: 'My Reviews' }} />
      <Tab.Screen name="Messages" component={ChatListScreen} options={{ title: 'Messages' }} />
      <Tab.Screen name="Assistant" component={AIAssistantScreen} options={{ title: 'AI Assistant' }} />
      <Tab.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Onboarding stack
function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}

// Placeholder screens for onboarding
const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
    <Text style={{ fontSize: 24, color: 'white' }}>VibeWell</Text>
  </View>
);

const WelcomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Welcome to VibeWell</Text>
  </View>
);

// Root navigation - handles switching between onboarding and main app
const RootStack = createStackNavigator();

export function AppNavigator() {
  const { user, isLoading, isProvider } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : isProvider ? (
          <RootStack.Screen name="ProviderMain" component={ProviderStackNavigator} />
        ) : (
          <RootStack.Screen name="Main" component={MainStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
} 