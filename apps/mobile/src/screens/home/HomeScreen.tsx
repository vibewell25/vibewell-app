import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

// Placeholder data for featured providers
const featuredProviders = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialty: 'Yoga Instructor',
    rating: 4.9,
    reviews: 124,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialty: 'Massage Therapist',
    rating: 4.8,
    reviews: 98,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    specialty: 'Nutritionist',
    rating: 4.7,
    reviews: 87,
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

// Placeholder data for wellness categories
const wellnessCategories = [
  { id: '1', name: 'Yoga', icon: '🧘‍♀️' },
  { id: '2', name: 'Massage', icon: '💆‍♀️' },
  { id: '3', name: 'Nutrition', icon: '🥗' },
  { id: '4', name: 'Meditation', icon: '🧠' },
  { id: '5', name: 'Fitness', icon: '💪' },
  { id: '6', name: 'Therapy', icon: '🗣️' },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const firstName = user?.user_metadata?.first_name || 'Wellness Seeker';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {firstName}</Text>
          <Text style={styles.subGreeting}>Find your wellness match today</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar Placeholder */}
      <TouchableOpacity 
        style={styles.searchBar}
        onPress={() => navigation.navigate('Discover')}
      >
        <Text style={styles.searchText}>Search for wellness providers...</Text>
      </TouchableOpacity>
      
      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {wellnessCategories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Featured Providers */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Providers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Add AI Try-On Feature Section */}
      <View style={styles.aiTryOnContainer}>
        <View style={styles.aiTryOnContent}>
          <Text style={styles.aiTryOnTitle}>Virtual Beauty Try-On</Text>
          <Text style={styles.aiTryOnDescription}>
            Try makeup, hair colors, and skincare products before you buy
          </Text>
          <TouchableOpacity 
            style={styles.aiTryOnButton}
            onPress={() => navigation.navigate('Assistant')}
          >
            <Text style={styles.aiTryOnButtonText}>Try It Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.aiTryOnImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1596446593710-2c9c72e1155a?ixlib=rb-4.0.3' }}
            style={styles.aiTryOnImage}
            resizeMode="cover"
          />
        </View>
      </View>
      
      {/* Add Feature Buttons Section */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>New Features</Text>
        <View style={styles.featureButtonsRow}>
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => navigation.navigate('HealthDashboard')}
          >
            <Text style={styles.featureButtonIcon}>❤️</Text>
            <Text style={styles.featureButtonText}>Health Dashboard</Text>
            <Text style={styles.featureDescription}>Track metrics & connect wearables</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => navigation.navigate('WellnessPlan')}
          >
            <Text style={styles.featureButtonIcon}>🎯</Text>
            <Text style={styles.featureButtonText}>Wellness Plan</Text>
            <Text style={styles.featureDescription}>Personalized goals & challenges</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => navigation.navigate('Community')}
          >
            <Text style={styles.featureButtonIcon}>👥</Text>
            <Text style={styles.featureButtonText}>Community</Text>
            <Text style={styles.featureDescription}>Enhanced social features</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.providersContainer}>
        {featuredProviders.map((provider) => (
          <TouchableOpacity 
            key={provider.id} 
            style={styles.providerCard}
            onPress={() => {
              // Navigate to provider detail screen (to be implemented)
              alert(`Viewing ${provider.name}'s profile`);
            }}
          >
            <Image 
              source={{ uri: provider.image }} 
              style={styles.providerImage} 
              resizeMode="cover"
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {provider.rating}</Text>
                <Text style={styles.reviewsText}>({provider.reviews} reviews)</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Upcoming Appointments Placeholder */}
      <View style={styles.appointmentsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.noAppointmentsContainer}>
          <Text style={styles.noAppointmentsText}>No upcoming appointments</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('Discover')}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.grey900,
  },
  subGreeting: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginTop: SPACING.xs,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: FONTS.bodyLarge,
  },
  searchBar: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    color: COLORS.grey500,
    marginLeft: SPACING.sm,
    fontSize: FONTS.bodyMedium,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: '600',
    color: COLORS.grey900,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  categoriesContainer: {
    marginTop: SPACING.xs,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
    width: 80,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  categoryName: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey800,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: FONTS.bodyMedium,
    fontWeight: '500',
  },
  providersContainer: {
    paddingHorizontal: SPACING.lg,
  },
  providerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  providerImage: {
    width: '100%',
    height: 150,
  },
  providerInfo: {
    padding: SPACING.md,
  },
  providerName: {
    fontSize: FONTS.bodyLarge,
    fontWeight: '600',
    color: COLORS.grey900,
  },
  providerSpecialty: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginTop: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  ratingText: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '500',
    color: COLORS.grey900,
  },
  reviewsText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    marginLeft: SPACING.xs,
  },
  appointmentsContainer: {
    marginBottom: SPACING.xxl,
  },
  noAppointmentsContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  noAppointmentsText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginBottom: SPACING.md,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  bookButtonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  aiTryOnContainer: {
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  aiTryOnContent: {
    padding: SPACING.lg,
  },
  aiTryOnTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  aiTryOnDescription: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey700,
    marginBottom: SPACING.md,
  },
  aiTryOnButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  aiTryOnButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONTS.bodyMedium,
  },
  aiTryOnImageContainer: {
    height: 150,
    width: '100%',
  },
  aiTryOnImage: {
    width: '100%',
    height: '100%',
  },
  featuresContainer: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  featureButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureButton: {
    width: '30%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
    minHeight: 120,
  },
  featureButtonIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  featureButtonText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
    fontWeight: '500',
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default HomeScreen; 