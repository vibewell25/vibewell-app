import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

// Placeholder data for providers
const providers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialty: 'Yoga Instructor',
    rating: 4.9,
    reviews: 124,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    tags: ['yoga', 'meditation', 'wellness'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialty: 'Massage Therapist',
    rating: 4.8,
    reviews: 98,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    tags: ['massage', 'relaxation', 'therapy'],
  },
  {
    id: '3',
    name: 'Emma Wilson',
    specialty: 'Nutritionist',
    rating: 4.7,
    reviews: 87,
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    tags: ['nutrition', 'diet', 'health'],
  },
  {
    id: '4',
    name: 'James Rodriguez',
    specialty: 'Personal Trainer',
    rating: 4.9,
    reviews: 156,
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    tags: ['fitness', 'strength', 'cardio'],
  },
  {
    id: '5',
    name: 'Olivia Parker',
    specialty: 'Meditation Coach',
    rating: 4.8,
    reviews: 92,
    image: 'https://randomuser.me/api/portraits/women/54.jpg',
    tags: ['meditation', 'mindfulness', 'stress-relief'],
  },
  {
    id: '6',
    name: 'Daniel Kim',
    specialty: 'Physical Therapist',
    rating: 4.9,
    reviews: 118,
    image: 'https://randomuser.me/api/portraits/men/43.jpg',
    tags: ['therapy', 'rehabilitation', 'recovery'],
  },
];

// Filter categories
const filterCategories = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Yoga' },
  { id: '3', name: 'Massage' },
  { id: '4', name: 'Nutrition' },
  { id: '5', name: 'Fitness' },
  { id: '6', name: 'Meditation' },
  { id: '7', name: 'Therapy' },
];

const DiscoveryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('1'); // Default to 'All'
  const [filteredProviders, setFilteredProviders] = useState(providers);

  // Handle search and filtering
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterProviders(text, activeFilter);
  };

  const handleFilterSelect = (filterId: string) => {
    setActiveFilter(filterId);
    filterProviders(searchQuery, filterId);
  };

  const filterProviders = (query: string, filterId: string) => {
    let results = [...providers];
    
    // Apply text search if query exists
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      results = results.filter(
        provider => 
          provider.name.toLowerCase().includes(lowercasedQuery) || 
          provider.specialty.toLowerCase().includes(lowercasedQuery) ||
          provider.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }
    
    // Apply category filter if not 'All'
    if (filterId !== '1') {
      const filterName = filterCategories.find(cat => cat.id === filterId)?.name.toLowerCase() || '';
      results = results.filter(
        provider => 
          provider.specialty.toLowerCase().includes(filterName) || 
          provider.tags.some(tag => tag.toLowerCase().includes(filterName))
      );
    }
    
    setFilteredProviders(results);
  };

  const renderProviderCard = ({ item }: { item: typeof providers[0] }) => (
    <TouchableOpacity 
      style={styles.providerCard}
      onPress={() => {
        // Navigate to provider detail screen (to be implemented)
        alert(`Viewing ${item.name}'s profile`);
      }}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.providerImage} 
        resizeMode="cover"
      />
      <View style={styles.providerInfo}>
        <Text style={styles.providerName}>{item.name}</Text>
        <Text style={styles.providerSpecialty}>{item.specialty}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
        </View>
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search wellness providers..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      {/* Filter Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filterCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterChip,
              activeFilter === category.id && styles.activeFilterChip
            ]}
            onPress={() => handleFilterSelect(category.id)}
          >
            <Text 
              style={[
                styles.filterText,
                activeFilter === category.id && styles.activeFilterText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'} found
        </Text>
      </View>
      
      {/* Provider List */}
      {filteredProviders.length > 0 ? (
        <FlatList
          data={filteredProviders}
          renderItem={renderProviderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.providersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No providers found</Text>
          <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBarContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.bodyMedium,
    ...SHADOWS.small,
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: SPACING.lg,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.grey300,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey700,
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  resultsHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey200,
  },
  resultsText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey700,
  },
  providersList: {
    padding: SPACING.lg,
  },
  providerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
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
  tagsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  tagChip: {
    backgroundColor: COLORS.grey100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
  },
  tagText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey700,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  noResultsText: {
    fontSize: FONTS.h3,
    fontWeight: '500',
    color: COLORS.grey700,
    marginBottom: SPACING.sm,
  },
  noResultsSubtext: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    textAlign: 'center',
  },
});

export default DiscoveryScreen; 