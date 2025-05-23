import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

const SocialScreen = () => {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social</Text>
        <Text style={styles.headerSubtitle}>Connect with wellness community</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.enhancedBanner}
        onPress={() => navigation.navigate('Community')}
      >
        <Text style={styles.enhancedBannerTitle}>Try Our Enhanced Community Features!</Text>
        <Text style={styles.enhancedBannerSubtitle}>Forums, Events, Groups, and Expert Q&A</Text>
        <View style={styles.enhancedButton}>
          <Text style={styles.enhancedButtonText}>Go to Enhanced Community</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Community Events</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No upcoming events at this time</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellness Groups</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Join wellness groups to connect with like-minded people</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellness Feed</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Start following practitioners to see their updates</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  enhancedBanner: {
    margin: 15,
    padding: 20,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    alignItems: 'center',
  },
  enhancedBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.grey900,
    marginBottom: 5,
  },
  enhancedBannerSubtitle: {
    fontSize: 14,
    color: COLORS.grey800,
    marginBottom: 15,
    textAlign: 'center',
  },
  enhancedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  enhancedButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.grey800,
  },
  emptyState: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SocialScreen; 