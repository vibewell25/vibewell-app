import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

// Mock types and data
interface User {
  id: string;
  name: string;
  avatar: string;
  isExpert?: boolean;
  expertise?: string;
}

interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  category: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
}

interface QATopic {
  id: string;
  expert: User;
  question: string;
  preview: string;
  answers: number;
  views: number;
  createdAt: string;
}

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isExpert: true,
      expertise: 'Yoga Instructor'
    },
    content: 'Just finished a wonderful morning yoga session with my students! Remember, consistency is key to improving your practice. What's your favorite morning routine?',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 24,
    comments: 5,
    createdAt: '2025-03-15T08:30:00Z',
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: 'Hit a new personal record on my 5k run today! So proud of the progress I\'ve made in the last few months with this supportive community.',
    likes: 18,
    comments: 3,
    createdAt: '2025-03-15T10:15:00Z',
    isLiked: true,
  },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Morning Yoga Flow',
    description: 'For early risers who love to start their day with yoga.',
    members: 128,
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Yoga',
  },
  {
    id: '2',
    name: 'Mindful Meditation',
    description: 'Daily meditation practices and discussions.',
    members: 96,
    image: 'https://images.unsplash.com/photo-1535637603896-07c179d71f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Meditation',
  },
  {
    id: '3',
    name: 'Healthy Recipes Exchange',
    description: 'Share and discover nutritious meal ideas.',
    members: 215,
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Nutrition',
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Group Meditation in the Park',
    description: 'Join us for a relaxing group meditation session in Central Park.',
    date: '2025-03-20',
    time: '9:00 AM - 10:30 AM',
    location: 'Central Park, NYC',
    image: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: 32,
  },
  {
    id: '2',
    title: 'Wellness Workshop',
    description: 'Learn stress management techniques from expert practitioners.',
    date: '2025-03-25',
    time: '6:00 PM - 8:00 PM',
    location: 'VibeWell Center',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    attendees: 18,
  },
];

const mockQATopics: QATopic[] = [
  {
    id: '1',
    expert: {
      id: '3',
      name: 'Dr. Emily Watson',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      isExpert: true,
      expertise: 'Nutritionist'
    },
    question: 'What's the best way to start a plant-based diet?',
    preview: 'Transitioning to a plant-based diet can be challenging but rewarding. I recommend starting by...',
    answers: 3,
    views: 128,
    createdAt: '2025-03-10T14:30:00Z',
  },
  {
    id: '2',
    expert: {
      id: '4',
      name: 'James Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      isExpert: true,
      expertise: 'Sleep Specialist'
    },
    question: 'How can I improve my sleep quality naturally?',
    preview: 'Poor sleep can impact every aspect of your health. My top recommendations for natural sleep improvement...',
    answers: 5,
    views: 210,
    createdAt: '2025-03-12T09:45:00Z',
  },
];

// Component
const EnhancedCommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events' | 'qa'>('feed');
  
  const renderPost = (post: Post) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.postUserInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{post.user.name}</Text>
            {post.user.isExpert && (
              <View style={styles.expertBadge}>
                <Text style={styles.expertBadgeText}>Expert</Text>
              </View>
            )}
          </View>
          {post.user.expertise && (
            <Text style={styles.userExpertise}>{post.user.expertise}</Text>
          )}
          <Text style={styles.postTime}>{new Date(post.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      {post.image && (
        <Image 
          source={{ uri: post.image }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            {post.isLiked ? '❤️' : '🤍'} {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            💬 {post.comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            📤 Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderGroup = (group: Group) => (
    <TouchableOpacity key={group.id} style={styles.groupCard}>
      <Image source={{ uri: group.image }} style={styles.groupImage} />
      <View style={styles.groupContent}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupDescription}>{group.description}</Text>
        <View style={styles.groupStats}>
          <Text style={styles.groupMembers}>{group.members} members</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{group.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEvent = (event: Event) => (
    <TouchableOpacity key={event.id} style={styles.eventCard}>
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
        <View style={styles.eventDetails}>
          <Text style={styles.eventDate}>📅 {event.date} • {event.time}</Text>
          <Text style={styles.eventLocation}>📍 {event.location}</Text>
          <Text style={styles.eventAttendees}>👥 {event.attendees} attending</Text>
        </View>
        <TouchableOpacity style={styles.interestedButton}>
          <Text style={styles.interestedButtonText}>I'm Interested</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const renderQATopic = (topic: QATopic) => (
    <TouchableOpacity key={topic.id} style={styles.qaTopicCard}>
      <View style={styles.qaTopicHeader}>
        <Image source={{ uri: topic.expert.avatar }} style={styles.qaExpertAvatar} />
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.qaExpertName}>{topic.expert.name}</Text>
            <View style={styles.expertBadge}>
              <Text style={styles.expertBadgeText}>Expert</Text>
            </View>
          </View>
          <Text style={styles.qaExpertise}>{topic.expert.expertise}</Text>
        </View>
      </View>
      
      <Text style={styles.qaQuestion}>{topic.question}</Text>
      <Text style={styles.qaPreview}>{topic.preview}</Text>
      
      <View style={styles.qaStats}>
        <Text style={styles.qaStatsText}>💬 {topic.answers} answers</Text>
        <Text style={styles.qaStatsText}>👁️ {topic.views} views</Text>
        <Text style={styles.qaDate}>{new Date(topic.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VibeWell Community</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>🔔</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]} 
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]} 
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]} 
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'qa' && styles.activeTab]} 
          onPress={() => setActiveTab('qa')}
        >
          <Text style={[styles.tabText, activeTab === 'qa' && styles.activeTabText]}>Expert Q&A</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'feed' && (
          <View>
            {/* Create Post */}
            <View style={styles.createPostCard}>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/women/65.jpg' }} 
                style={styles.userAvatar} 
              />
              <TouchableOpacity style={styles.createPostInput}>
                <Text style={styles.createPostPlaceholder}>Share your wellness journey...</Text>
              </TouchableOpacity>
            </View>
            
            {/* Feed Filter */}
            <View style={styles.feedFilterContainer}>
              <TouchableOpacity style={[styles.filterChip, styles.activeFilterChip]}>
                <Text style={styles.activeFilterText}>For You</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterText}>Following</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterText}>Trending</Text>
              </TouchableOpacity>
            </View>
            
            {/* Posts */}
            {mockPosts.map(renderPost)}
          </View>
        )}
        
        {activeTab === 'groups' && (
          <View>
            {/* Groups Search */}
            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.searchInput}
                placeholder="Search groups by interest or name"
                placeholderTextColor={COLORS.grey500}
              />
            </View>
            
            {/* Groups Category */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScrollContainer}
              contentContainerStyle={styles.categoryScrollContent}
            >
              <TouchableOpacity style={[styles.categoryChip, styles.activeCategoryChip]}>
                <Text style={styles.activeCategoryText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryChip}>
                <Text style={styles.categoryText}>Yoga</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryChip}>
                <Text style={styles.categoryText}>Meditation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryChip}>
                <Text style={styles.categoryText}>Fitness</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryChip}>
                <Text style={styles.categoryText}>Nutrition</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categoryChip}>
                <Text style={styles.categoryText}>Mental Health</Text>
              </TouchableOpacity>
            </ScrollView>
            
            {/* Groups List */}
            <View style={styles.groupsContainer}>
              {mockGroups.map(renderGroup)}
            </View>
          </View>
        )}
        
        {activeTab === 'events' && (
          <View style={styles.eventsContainer}>
            {mockEvents.map(renderEvent)}
          </View>
        )}
        
        {activeTab === 'qa' && (
          <View>
            {/* Q&A Search */}
            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.searchInput}
                placeholder="Search questions or topics"
                placeholderTextColor={COLORS.grey500}
              />
            </View>
            
            {/* Ask Question Button */}
            <TouchableOpacity style={styles.askQuestionButton}>
              <Text style={styles.askQuestionButtonText}>Ask a Question</Text>
            </TouchableOpacity>
            
            {/* Q&A Topics */}
            <View style={styles.qaTopicsContainer}>
              {mockQATopics.map(renderQATopic)}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
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
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.grey900,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: FONTS.bodyLarge,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey200,
  },
  tab: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  
  // Feed Styles
  createPostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  createPostInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.grey100,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  createPostPlaceholder: {
    color: COLORS.grey500,
    fontSize: FONTS.bodyMedium,
  },
  feedFilterContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.grey100,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primaryLight,
  },
  filterText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey700,
  },
  activeFilterText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.md,
  },
  postUserInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: FONTS.bodyLarge,
    fontWeight: '600',
    color: COLORS.grey900,
    marginRight: SPACING.xs,
  },
  expertBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  expertBadgeText: {
    fontSize: FONTS.bodySmall - 2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  userExpertise: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    marginBottom: 2,
  },
  postTime: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey500,
  },
  postContent: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.grey200,
    paddingTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  actionText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey700,
  },
  
  // Groups Styles
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    backgroundColor: COLORS.grey100,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
  },
  categoryScrollContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.md,
  },
  categoryScrollContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.grey100,
  },
  activeCategoryChip: {
    backgroundColor: COLORS.primaryLight,
  },
  categoryText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey700,
  },
  activeCategoryText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  groupsContainer: {
    padding: SPACING.md,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  groupImage: {
    width: 100,
    height: '100%',
  },
  groupContent: {
    flex: 1,
    padding: SPACING.md,
  },
  groupName: {
    fontSize: FONTS.bodyLarge,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  groupDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
    marginBottom: SPACING.sm,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupMembers: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  categoryTag: {
    backgroundColor: COLORS.grey100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  categoryTagText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey700,
  },
  
  // Events Styles
  eventsContainer: {
    padding: SPACING.md,
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: SPACING.md,
  },
  eventTitle: {
    fontSize: FONTS.bodyLarge,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.xs,
  },
  eventDescription: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey600,
    marginBottom: SPACING.md,
  },
  eventDetails: {
    marginBottom: SPACING.md,
  },
  eventDate: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
    marginBottom: SPACING.xs,
  },
  eventLocation: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
    marginBottom: SPACING.xs,
  },
  eventAttendees: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey800,
  },
  interestedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  interestedButtonText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.white,
    fontWeight: '600',
  },
  
  // Q&A Styles
  askQuestionButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  askQuestionButtonText: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.white,
    fontWeight: '600',
  },
  qaTopicsContainer: {
    padding: SPACING.md,
  },
  qaTopicCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  qaTopicHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  qaExpertAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  qaExpertName: {
    fontSize: FONTS.bodyMedium,
    fontWeight: '600',
    color: COLORS.grey900,
    marginRight: SPACING.xs,
  },
  qaExpertise: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  qaQuestion: {
    fontSize: FONTS.bodyLarge,
    fontWeight: '600',
    color: COLORS.grey900,
    marginBottom: SPACING.sm,
  },
  qaPreview: {
    fontSize: FONTS.bodyMedium,
    color: COLORS.grey700,
    marginBottom: SPACING.md,
  },
  qaStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.grey200,
    paddingTop: SPACING.sm,
  },
  qaStatsText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey600,
  },
  qaDate: {
    fontSize: FONTS.bodySmall,
    color: COLORS.grey500,
  },
});

export default EnhancedCommunityScreen; 