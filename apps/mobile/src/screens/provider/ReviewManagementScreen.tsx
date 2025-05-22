import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { supabase } from '../../services/supabase';
import theme, { COLORS } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

type Review = {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  response?: string;
  serviceTitle: string;
};

const ReviewManagementScreen = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unresponded' | 'responded'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be a Supabase query
      // Mock data for demonstration
      const mockReviews: Review[] = [
        {
          id: "r1",
          clientName: "Alice Anderson",
          clientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 5,
          comment: "Sarah is amazing! The facial was exactly what my skin needed. Would definitely recommend to friends.",
          createdAt: "2023-07-15T14:30:00",
          response: "Thank you so much for your kind words, Alice! I'm glad you enjoyed the facial and I look forward to seeing you again soon.",
          serviceTitle: "Signature Facial"
        },
        {
          id: "r2",
          clientName: "Michael Brown",
          clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 4,
          comment: "Great massage that really helped with my back pain. The room was a bit too cold though.",
          createdAt: "2023-07-10T11:15:00",
          serviceTitle: "Deep Tissue Massage"
        },
        {
          id: "r3",
          clientName: "Emily Wilson",
          clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 5,
          comment: "This was my first chemical peel and Sarah made me feel so comfortable throughout the process. My skin looks amazing!",
          createdAt: "2023-07-05T09:45:00",
          response: "Thank you for trusting me with your first chemical peel, Emily! I'm thrilled with your results and can't wait to see you for your follow-up.",
          serviceTitle: "Chemical Peel"
        },
        {
          id: "r4",
          clientName: "David Lee",
          clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 3,
          comment: "The service was okay. I expected a bit more attention to detail for the price point.",
          createdAt: "2023-06-28T16:20:00",
          serviceTitle: "Express Facial"
        },
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'Failed to load reviews. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToReview = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
    setIsResponding(true);
  };

  const handleSaveResponse = async () => {
    if (!selectedReview) return;
    
    try {
      // In a real app, this would update the response in Supabase
      const updatedReviews = reviews.map(review => 
        review.id === selectedReview.id 
          ? { ...review, response: responseText } 
          : review
      );
      
      setReviews(updatedReviews);
      setIsResponding(false);
      setSelectedReview(null);
      Alert.alert('Success', 'Your response has been saved');
    } catch (error) {
      console.error('Error saving response:', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
    }
  };

  const getFilteredReviews = () => {
    let filteredReviews = [...reviews];
    
    // Apply filter
    if (filter === 'unresponded') {
      filteredReviews = filteredReviews.filter(review => !review.response);
    } else if (filter === 'responded') {
      filteredReviews = filteredReviews.filter(review => !!review.response);
    }
    
    // Apply sorting
    if (sortBy === 'date') {
      filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'rating') {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    }
    
    return filteredReviews;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FontAwesome key={i} name="star" size={16} color={COLORS.warning} />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" size={16} color={COLORS.warning} />);
      }
    }
    
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <Image source={{ uri: item.clientAvatar }} style={styles.avatar} />
          <View>
            <Text style={styles.clientName}>{item.clientName}</Text>
            <Text style={styles.serviceTitle}>{item.serviceTitle}</Text>
          </View>
        </View>
        <View>
          <View style={styles.ratingContainer}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
      
      <View style={styles.reviewContent}>
        <Text style={styles.reviewText}>{item.comment}</Text>
      </View>
      
      {item.response ? (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Your Response:</Text>
          <Text style={styles.responseText}>{item.response}</Text>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => handleRespondToReview(item)}
          >
            <Text style={styles.editButtonText}>Edit Response</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.respondButton}
          onPress={() => handleRespondToReview(item)}
        >
          <Text style={styles.respondButtonText}>Respond to Review</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderResponseModal = () => {
    if (!isResponding || !selectedReview) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedReview.response ? 'Edit Response' : 'Respond to Review'}
            </Text>
            <TouchableOpacity onPress={() => setIsResponding(false)}>
              <Ionicons name="close" size={24} color={COLORS.grey800} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewSummary}>
            <Text style={styles.clientNameModal}>{selectedReview.clientName}</Text>
            <View style={styles.ratingContainer}>
              {renderStars(selectedReview.rating)}
            </View>
            <Text style={styles.reviewTextModal}>{selectedReview.comment}</Text>
          </View>
          
          <TextInput
            style={styles.responseInput}
            placeholder="Write your response here..."
            value={responseText}
            onChangeText={setResponseText}
            multiline
            numberOfLines={5}
          />
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setIsResponding(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleSaveResponse}
            >
              <Text style={styles.saveButtonText}>Save Response</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Avg. Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {reviews.filter(review => review.response).length}
            </Text>
            <Text style={styles.statLabel}>Responded</Text>
          </View>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterButtonText, filter === 'all' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'unresponded' && styles.activeFilterButton]}
              onPress={() => setFilter('unresponded')}
            >
              <Text style={[styles.filterButtonText, filter === 'unresponded' && styles.activeFilterText]}>Unresponded</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'responded' && styles.activeFilterButton]}
              onPress={() => setFilter('responded')}
            >
              <Text style={[styles.filterButtonText, filter === 'responded' && styles.activeFilterText]}>Responded</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === 'date' && styles.activeFilterButton]}
              onPress={() => setSortBy('date')}
            >
              <Text style={[styles.filterButtonText, sortBy === 'date' && styles.activeFilterText]}>Latest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === 'rating' && styles.activeFilterButton]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.filterButtonText, sortBy === 'rating' && styles.activeFilterText]}>Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={getFilteredReviews()}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsList}
      />

      {renderResponseModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey300,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grey600,
    marginTop: 4,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey300,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.grey600,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: COLORS.grey200,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.grey600,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  reviewsList: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  serviceTitle: {
    fontSize: 12,
    color: COLORS.grey600,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.grey600,
    marginTop: 4,
    textAlign: 'right',
  },
  reviewContent: {
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grey800,
  },
  responseContainer: {
    backgroundColor: COLORS.grey100,
    padding: 12,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.grey600,
  },
  responseText: {
    fontSize: 14,
    color: COLORS.grey800,
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-end',
  },
  editButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  respondButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  respondButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.grey800,
  },
  reviewSummary: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey300,
  },
  clientNameModal: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewTextModal: {
    fontSize: 14,
    color: COLORS.grey800,
    marginTop: 8,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: COLORS.grey300,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: COLORS.grey200,
  },
  cancelButtonText: {
    color: COLORS.grey800,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default ReviewManagementScreen; 