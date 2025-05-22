import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

// Mock user data
const userData = {
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Wellness enthusiast passionate about holistic health and mindfulness practices.',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  memberSince: 'January 2023',
};

// Define setting types
type ToggleSetting = {
  id: string;
  title: string;
  description: string;
  type: 'toggle';
  value: boolean;
};

type NavigateSetting = {
  id: string;
  title: string;
  description: string;
  type: 'navigate';
  screen: string;
};

type Setting = ToggleSetting | NavigateSetting;

// Settings options
const settingsOptions: Setting[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Receive booking reminders and updates',
    type: 'toggle',
    value: true,
  },
  {
    id: 'darkMode',
    title: 'Dark Mode',
    description: 'Switch between light and dark theme',
    type: 'toggle',
    value: false,
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Manage your data and privacy preferences',
    type: 'navigate',
    screen: 'PrivacySettings',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    description: 'Manage your payment options',
    type: 'navigate',
    screen: 'PaymentMethods',
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Contact support or view FAQs',
    type: 'navigate',
    screen: 'HelpSupport',
  },
  {
    id: 'about',
    title: 'About VibeWell',
    description: 'Learn more about our app and mission',
    type: 'navigate',
    screen: 'About',
  },
];

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<Setting[]>(settingsOptions);

  const handleToggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) => {
        if (setting.id === id && setting.type === 'toggle') {
          return { ...setting, value: !setting.value };
        }
        return setting;
      })
    );
  };

  const handleNavigate = (screen: string) => {
    // This would navigate to the specified screen
    // For now, just show an alert
    Alert.alert('Navigation', `Navigating to ${screen}`);
  };

  const handleEditProfile = () => {
    // This would navigate to the edit profile screen
    // For now, just show an alert
    Alert.alert('Edit Profile', 'Edit profile functionality to be implemented');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by the AuthContext
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: userData.avatar }} 
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
            <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{userData.email}</Text>
          </View>
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{userData.phone}</Text>
          </View>
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bio</Text>
            <Text style={styles.detailValue}>{userData.bio}</Text>
          </View>
        </View>
      </View>

      {/* Bookings Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Bookings</Text>
        <TouchableOpacity 
          style={styles.bookingSummary}
          onPress={() => navigation.navigate('Bookings')}
        >
          <View>
            <Text style={styles.bookingCount}>0</Text>
            <Text style={styles.bookingLabel}>Upcoming</Text>
          </View>
          <View style={styles.bookingDivider} />
          <View>
            <Text style={styles.bookingCount}>0</Text>
            <Text style={styles.bookingLabel}>Past</Text>
          </View>
          <View style={styles.bookingDivider} />
          <View>
            <Text style={styles.bookingCount}>0</Text>
            <Text style={styles.bookingLabel}>Canceled</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsContainer}>
          {settings.map((setting) => (
            <View key={setting.id}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                {setting.type === 'toggle' ? (
                  <Switch
                    value={setting.value}
                    onValueChange={() => handleToggleSetting(setting.id)}
                    trackColor={{ false: COLORS.grey300, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                ) : (
                  <TouchableOpacity 
                    onPress={() => handleNavigate(setting.screen)}
                    style={styles.navigateButton}
                  >
                    <Text style={styles.navigateButtonText}>›</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.separator} />
            </View>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Version Info */}
      <Text style={styles.versionText}>VibeWell v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  nameContainer: {
    marginLeft: SPACING.md,
  },
  name: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.grey900,
  },
  memberSince: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONTS.bodySmall,
    fontWeight: '500',
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.md,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
  },
  detailRow: {
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey900,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grey200,
    marginVertical: SPACING.xs,
  },
  bookingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  bookingCount: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.grey900,
    textAlign: 'center',
  },
  bookingLabel: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    textAlign: 'center',
    marginTop: 2,
  },
  bookingDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.grey200,
  },
  settingsContainer: {
    backgroundColor: COLORS.white,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '500',
    color: COLORS.grey900,
  },
  settingDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    marginTop: 2,
  },
  navigateButton: {
    padding: SPACING.xs,
  },
  navigateButtonText: {
    fontSize: FONTS.h2,
    color: COLORS.grey500,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: FONTS.bodyMedium,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: FONTS.bodySmall,
    color: COLORS.grey500,
    marginBottom: SPACING.xxl,
  },
});

export default ProfileScreen; 