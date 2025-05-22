import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type ChatScreenRouteProp = {
  params: {
    chatId: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar: string;
  };
};

type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId, recipientId, recipientName, recipientAvatar } = route.params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Simulated online status
  
  const flatListRef = useRef<FlatList>(null);
  const currentUserId = 'current-user-id'; // In a real app, this would come from auth context
  
  useEffect(() => {
    // Set the navigation header
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Image source={{ uri: recipientAvatar }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{recipientName}</Text>
            <Text style={styles.headerStatus}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
      ),
    });
    
    fetchMessages();
    
    // In a real app, this would subscribe to new messages
    const interval = setInterval(() => {
      // Simulate receiving a new message every 30 seconds
      if (Math.random() > 0.7) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: recipientId,
          recipientId: currentUserId,
          content: getRandomMessage(),
          timestamp: new Date().toISOString(),
          read: false,
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch messages from Supabase
      // Mock data for demonstration
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: recipientId,
          recipientId: currentUserId,
          content: 'Hi there! How can I help you today?',
          timestamp: '2023-07-15T10:30:00',
          read: true,
        },
        {
          id: 'msg2',
          senderId: currentUserId,
          recipientId: recipientId,
          content: 'I was wondering if you have any availability next week for a facial?',
          timestamp: '2023-07-15T10:32:00',
          read: true,
        },
        {
          id: 'msg3',
          senderId: recipientId,
          recipientId: currentUserId,
          content: 'Yes, I have slots available on Tuesday and Thursday afternoon. Would either of those work for you?',
          timestamp: '2023-07-15T10:35:00',
          read: true,
        },
        {
          id: 'msg4',
          senderId: currentUserId,
          recipientId: recipientId,
          content: 'Thursday at 2pm would be perfect!',
          timestamp: '2023-07-15T10:38:00',
          read: true,
        },
        {
          id: 'msg5',
          senderId: recipientId,
          recipientId: currentUserId,
          content: "Great! I'll book you in for Thursday at 2pm. Looking forward to seeing you then!",
          timestamp: '2023-07-15T10:40:00',
          read: true,
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendMessage = async () => {
    if (!messageText.trim()) return;
    
    setIsSending(true);
    try {
      // Create a new message object
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        recipientId: recipientId,
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      // In a real app, this would send the message to Supabase
      // For now, just add it to the state
      setMessages([...messages, newMessage]);
      setMessageText('');
      
      // Simulate a response after a delay
      if (Math.random() > 0.3) {
        setTimeout(() => {
          const responseMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            senderId: recipientId,
            recipientId: currentUserId,
            content: getRandomResponse(),
            timestamp: new Date().toISOString(),
            read: false,
          };
          setMessages(prevMessages => [...prevMessages, responseMessage]);
        }, 2000 + Math.random() * 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const getRandomMessage = () => {
    const messages = [
      "Just checking in to see how you're doing!",
      "Did you have any questions about our services?",
      "Looking forward to your next appointment!",
      "Let me know if you need to reschedule.",
      "We have a special promotion this month, would you like to hear about it?"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  const getRandomResponse = () => {
    const responses = [
      "Sounds good!",
      "I'll check on that for you and get back to you shortly.",
      "Great question! Let me explain...",
      "Thank you for letting me know.",
      "Is there anything else I can help you with?",
      "Perfect, I've made a note of that."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUserId;
    
    return (
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.sentMessage : styles.receivedMessage
      ]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
      </View>
    );
  };
  
  const renderMessagesList = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    
    return (
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {renderMessagesList()}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!messageText.trim() || isSending) && styles.disabledSendButton
          ]}
          onPress={sendMessage}
          disabled={!messageText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Ionicons name="send" size={20} color={COLORS.white} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.grey600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: COLORS.white + 'CC',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey300,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.grey100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: COLORS.grey400,
  },
});

export default ChatScreen; 