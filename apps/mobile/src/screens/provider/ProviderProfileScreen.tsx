import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { theme } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

type ProviderProfileScreenRouteProp = {
  params: {
    providerId: string;
  };
};

type ProviderProfile = {
  id: string;
  displayName: string;
  bio: string;
  location: string;
  specialties: string;
  experience: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
};

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
};

type Review = {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  response?: string;
};

const ProviderProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ProviderProfileScreenRouteProp>();
  const { providerId } = route.params;
  
  const [activeTab, setActiveTab] = useState('about');
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be actual Supabase queries
        // This is mocked data for demonstration purposes
        
        // Mock provider data
        const mockProvider: ProviderProfile = {
          id: providerId,
          displayName: "Sarah Johnson",
          bio: "Licensed esthetician with over 8 years of experience specializing in facial treatments and skincare regimens. Passionate about helping clients achieve their best skin.",
          location: "San Francisco, CA",
          specialties: "Facials, Chemical Peels, Microdermabrasion",
          experience: "8",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
          rating: 4.8,
          reviewCount: 42
        };
        
        // Mock services data
        const mockServices = [
          {
            id: "s1",
            title: "Signature Facial",
            description: "A customized facial treatment designed to address your specific skin concerns.",
            price: 95,
            duration: 60,
            category: "Facial Treatments"
          },
          {
            id: "s2",
            title: "Deep Tissue Massage",
            description: "A therapeutic massage that focuses on realigning deeper layers of muscles and connective tissue.",
            price: 120,
            duration: 90,
            category: "Massage Therapy"
          },
          {
            id: "s3",
            title: "Chemical Peel",
            description: "A treatment that uses a chemical solution to remove the top layers of skin.",
            price: 150,
            duration: 45,
            category: "Facial Treatments"
          }
        ];
        
        // Mock reviews data
        const mockReviews = [
          {
            id: "r1",
            clientName: "Alice Anderson",
            clientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            rating: 5,
            comment: "Sarah is amazing! The facial was exactly what my skin needed.",
            createdAt: "2023-07-15T14:30:00",
            response: "Thank you so much for your kind words, Alice!"
          },
          {
            id: "r2",
            clientName: "Michael Brown",
            clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            rating: 4,
            comment: "Great massage that really helped with my back pain.",
            createdAt: "2023-07-10T11:15:00"
          },
          {
            id: "r3",
            clientName: "Emily Wilson",
            clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            rating: 5,
            comment: "This was my first chemical peel and Sarah made me feel so comfortable throughout the process.",
            createdAt: "2023-07-05T09:45:00",
            response: "Thank you for trusting me with your first chemical peel, Emily!"
          }
        ];
        
        setProvider(mockProvider);
        setServices(mockServices);
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error fetching provider data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProviderData();
  }, [providerId]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FontAwesome key={i} name="star" size={16} color={theme.colors.warning} />);
      } else if (i === fullStars && halfStar) {
        stars.push(<FontAwesome key={i} name="star-half-o" size={16} color={theme.colors.warning} />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" size={16} color={theme.colors.warning} />);
      }
    }
    
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderAboutTab = () => {
    if (!provider) return null;
    
    return (
      <View style={styles.tabContent}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bio}>{provider.bio}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tagsContainer}>
            {provider.specialties.split(',').map((specialty, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{specialty.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.infoText}>{provider.experience} years</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.infoText}>{provider.location}</Text>
        </View>
      </View>
    );
  };

  const renderServicesTab = () => {
    return (
      <View style={styles.tabContent}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <View style={styles.serviceMeta}>
                <Text style={styles.servicePrice}>${service.price}</Text>
                <Text style={styles.serviceDuration}>{service.duration} min</Text>
              </View>
            </View>
            <Text style={styles.serviceCategory}>{service.category}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => navigation.navigate('BookingScreen', { serviceId: service.id, providerId })}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderReviewsTab = () => {
    return (
      <View style={styles.tabContent}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.clientAvatar }} style={styles.reviewerAvatar} />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>{review.clientName}</Text>
                <View style={styles.reviewMeta}>
                  {renderStars(review.rating)}
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            
            {review.response && (
              <View style={styles.responseContainer}>
                <Text style={styles.responseLabel}>Provider Response:</Text>
                <Text style={styles.responseText}>{review.response}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Provider not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileHeader}>
        <Image source={{ uri: provider.avatarUrl }} style={styles.profileImage} />
        <Text style={styles.providerName}>{provider.displayName}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(provider.rating)}
          <Text style={styles.ratingText}>
            {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
          </Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <Button 
          title="Book Appointment" 
          onPress={() => navigation.navigate('BookingScreen', { providerId })}
          style={styles.primaryButton}
        />
        <Button 
          title="Message" 
          onPress={() => navigation.navigate('ChatScreen', { recipientId: providerId })}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'about' && styles.activeTab]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'services' && styles.activeTab]}
          onPress={() => setActiveTab('services')}
        >
          <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'about' && renderAboutTab()}
      {activeTab === 'services' && renderServicesTab()}
      {activeTab === 'reviews' && renderReviewsTab()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    marginRight: 8,
  },
  secondaryButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  tabContent: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  serviceCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
  },
  serviceMeta: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  serviceDuration: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  serviceCategory: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 12,
  },
  responseContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default ProviderProfileScreen; 