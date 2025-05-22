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
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
  type: 'provider' | 'service' | 'article';
  action: string;
};

const AIAssistantScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch data from an AI service and user preferences
      
      // Mock welcome message
      const welcomeMessage: Message = {
        id: 'msg1',
        content: "Hi there! I'm Vibe, your wellness assistant. I can help you find the right services, answer questions about wellness, or suggest providers based on your preferences. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      // Mock personalized recommendations
      const mockRecommendations: Recommendation[] = [
        {
          id: 'rec1',
          title: 'Deep Tissue Massage',
          description: 'Based on your previous bookings, you might enjoy this therapeutic massage.',
          type: 'service',
          action: 'View Service',
        },
        {
          id: 'rec2',
          title: 'Sarah Johnson',
          description: 'Highly rated esthetician specializing in facial treatments.',
          type: 'provider',
          action: 'View Profile',
        },
        {
          id: 'rec3',
          title: 'Benefits of Regular Facials',
          description: 'Learn how regular facials can improve your skin health.',
          type: 'article',
          action: 'Read Article',
        },
      ];
      
      setMessages([welcomeMessage]);
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    setIsProcessing(true);
    setShowRecommendations(false);
    
    try {
      // In a real app, this would call an AI service to get a response
      // Simulate AI thinking...
      setTimeout(() => {
        const aiResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          content: getAIResponse(userMessage.content),
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prevMessages => [...prevMessages, aiResponse]);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsProcessing(false);
    }
  };
  
  const getAIResponse = (userMessage: string) => {
    // Very simple keyword-based responses for demo purposes
    // In a real app, this would use a proper NLP service
    
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('massage')) {
      return "We offer several types of massage including Swedish, Deep Tissue, and Hot Stone. Would you like me to recommend a provider who specializes in massages?";
    } else if (lowerCaseMessage.includes('facial') || lowerCaseMessage.includes('skin')) {
      return "Facials are great for skin health! Our top-rated esthetician Sarah Johnson specializes in customized facial treatments. Would you like to see her available services?";
    } else if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('appointment')) {
      return "I'd be happy to help you book an appointment! Could you tell me what service you're interested in?";
    } else if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost')) {
      return "Our services range in price based on the provider and treatment. Massages typically range from $80-150, and facials from $75-120. Would you like to see a detailed price list?";
    } else if (lowerCaseMessage.includes('recommend') || lowerCaseMessage.includes('suggestion')) {
      return "Based on your profile and previous bookings, I'd recommend trying a Deep Tissue Massage with Mark Wilson. He has excellent reviews for helping with muscle tension and stress relief.";
    } else if (lowerCaseMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with today?";
    } else {
      return "I'm here to help you find the perfect wellness services. You can ask me about specific treatments, providers, or even book appointments. Would you like some personalized recommendations?";
    }
  };
  
  const handleRecommendationAction = (recommendation: Recommendation) => {
    // In a real app, this would navigate to the appropriate screen
    if (recommendation.type === 'provider') {
      alert(`Navigating to ${recommendation.title}'s profile`);
    } else if (recommendation.type === 'service') {
      alert(`Viewing details for ${recommendation.title}`);
    } else if (recommendation.type === 'article') {
      alert(`Reading article: ${recommendation.title}`);
    }
  };
  
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );
  
  const renderRecommendation = ({ item }: { item: Recommendation }) => (
    <TouchableOpacity 
      style={styles.recommendationCard}
      onPress={() => handleRecommendationAction(item)}
    >
      <View style={styles.recommendationIcon}>
        <Ionicons 
          name={
            item.type === 'provider' ? 'person' : 
            item.type === 'service' ? 'spa' : 
            'document-text'
          } 
          size={24} 
          color={COLORS.primary} 
        />
      </View>
      <View style={styles.recommendationContent}>
        <Text style={styles.recommendationTitle}>{item.title}</Text>
        <Text style={styles.recommendationDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>{item.action}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderSuggestions = () => {
    const suggestions = [
      "What services do you offer?",
      "Can you recommend a massage therapist?",
      "How much do facials cost?",
      "I need help booking an appointment"
    ];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => {
              setInputText(suggestion);
            }}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {showRecommendations && recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <View style={styles.recommendationsHeader}>
            <Text style={styles.recommendationsTitle}>For You</Text>
            <TouchableOpacity onPress={() => setShowRecommendations(false)}>
              <Ionicons name="close" size={20} color={COLORS.grey600} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendations}
            renderItem={renderRecommendation}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsList}
          />
        </View>
      )}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      {isProcessing && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Vibe is typing</Text>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
      
      {messages.length === 1 && renderSuggestions()}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isProcessing) && styles.disabledSendButton
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isProcessing}
        >
          <Ionicons name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  recommendationsContainer: {
    backgroundColor: COLORS.grey100,
    paddingVertical: 16,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  recommendationsList: {
    paddingHorizontal: 8,
  },
  recommendationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationIcon: {
    marginBottom: 12,
  },
  recommendationContent: {
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    color: COLORS.grey600,
    lineHeight: 20,
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  messagesList: {
    flexGrow: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: COLORS.grey200,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: props => props.sender === 'user' ? COLORS.white : COLORS.grey800,
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingText: {
    fontSize: 12,
    color: COLORS.grey600,
    marginRight: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  suggestionChip: {
    backgroundColor: COLORS.grey100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.grey800,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey200,
    backgroundColor: COLORS.white,
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

export default AIAssistantScreen; 