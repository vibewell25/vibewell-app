import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
};

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchConversations();
  }, []);
  
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch conversations from Supabase
      // Mock data for demonstration
      const mockConversations: Conversation[] = [
        {
          id: 'chat1',
          participantId: 'provider1',
          participantName: 'Sarah Johnson',
          participantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
          lastMessage: "Great! I'll book you in for Thursday at 2pm. Looking forward to seeing you then!",
          timestamp: '2023-07-15T10:40:00',
          unreadCount: 0,
          isOnline: true,
        },
        {
          id: 'chat2',
          participantId: 'provider2',
          participantName: 'Mark Wilson',
          participantAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
          lastMessage: 'Yes, I do offer deep tissue massage. It\'s one of my specialties.',
          timestamp: '2023-07-14T15:22:00',
          unreadCount: 2,
          isOnline: false,
        },
        {
          id: 'chat3',
          participantId: 'provider3',
          participantName: 'Emily Brown',
          participantAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
          lastMessage: 'Would you prefer a morning or afternoon appointment?',
          timestamp: '2023-07-10T09:15:00',
          unreadCount: 0,
          isOnline: true,
        },
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToChat = (conversation: Conversation) => {
    navigation.navigate('Chat', {
      chatId: conversation.id,
      recipientId: conversation.participantId,
      recipientName: conversation.participantName,
      recipientAvatar: conversation.participantAvatar,
    });
  };
  
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week, show day
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[messageDate.getDay()];
    } else {
      // Older, show date
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigateToChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.participantAvatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationDetails}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName}>{item.participantName}</Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
        
        <View style={styles.messagePreviewContainer}>
          <Text 
            style={[
              styles.messagePreview,
              item.unreadCount > 0 && styles.unreadMessagePreview
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={48} color={COLORS.grey400} />
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptyDescription}>
        Messages from your providers will appear here.
      </Text>
    </View>
  );
  
  const getFilteredConversations = () => {
    if (!searchQuery.trim()) return conversations;
    
    return conversations.filter(conversation => 
      conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
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
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.grey600} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <FlatList
        data={getFilteredConversations()}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.conversationList}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey300,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: COLORS.grey800,
  },
  conversationList: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey200,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.grey600,
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: COLORS.grey600,
    marginRight: 8,
  },
  unreadMessagePreview: {
    fontWeight: '600',
    color: COLORS.grey800,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.grey800,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.grey600,
    textAlign: 'center',
  },
});

export default ChatListScreen; 