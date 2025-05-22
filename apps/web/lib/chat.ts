import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Types for chat functionality
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessageAt: string;
  createdAt: string;
}

export interface ChatParticipant {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
}

// Create a new conversation between participants
export async function createConversation(participantIds: string[]): Promise<string | null> {
  try {
    const supabase = createClient();
    
    // Check if conversation already exists between these participants
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .contains('participants', participantIds)
      .single();
    
    if (existingConversation) {
      return existingConversation.id;
    }
    
    // Create a new conversation
    const conversationId = uuidv4();
    const { error } = await supabase
      .from('conversations')
      .insert({
        id: conversationId,
        participants: participantIds,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
    
    return conversationId;
  } catch (error) {
    console.error('Error in createConversation:', error);
    return null;
  }
}

// Send a message in a conversation
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<ChatMessage | null> {
  try {
    const supabase = createClient();
    const messageId = uuidv4();
    const createdAt = new Date().toISOString();
    
    // Insert the message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        id: messageId,
        conversationId,
        senderId,
        content,
        createdAt,
        isRead: false,
      });
    
    if (messageError) {
      console.error('Error sending message:', messageError);
      return null;
    }
    
    // Update the conversation's lastMessageAt
    const { error: conversationError } = await supabase
      .from('conversations')
      .update({ lastMessageAt: createdAt })
      .eq('id', conversationId);
    
    if (conversationError) {
      console.error('Error updating conversation:', conversationError);
    }
    
    return {
      id: messageId,
      conversationId,
      senderId,
      content,
      createdAt,
      isRead: false,
    };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
}

// Get messages for a conversation
export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversationId', conversationId)
      .order('createdAt', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data as ChatMessage[];
  } catch (error) {
    console.error('Error in getMessages:', error);
    return [];
  }
}

// Mark messages as read
export async function markMessagesAsRead(
  conversationId: string,
  recipientId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('messages')
      .update({ isRead: true })
      .eq('conversationId', conversationId)
      .neq('senderId', recipientId)
      .eq('isRead', false);
    
    if (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    return false;
  }
}

// Get all conversations for a user
export async function getUserConversations(userId: string): Promise<Conversation[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('participants', [userId])
      .order('lastMessageAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
    
    return data as Conversation[];
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    return [];
  }
}

// Get participant details for a conversation
export async function getConversationParticipants(
  conversationId: string
): Promise<ChatParticipant[]> {
  try {
    const supabase = createClient();
    
    // First, get the conversation to get participant IDs
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('participants')
      .eq('id', conversationId)
      .single();
    
    if (conversationError || !conversation) {
      console.error('Error fetching conversation:', conversationError);
      return [];
    }
    
    // Then, get the participant profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, firstName, lastName, displayName, avatarUrl, role')
      .in('id', conversation.participants);
    
    if (profilesError) {
      console.error('Error fetching participants:', profilesError);
      return [];
    }
    
    return profiles as ChatParticipant[];
  } catch (error) {
    console.error('Error in getConversationParticipants:', error);
    return [];
  }
}

// Subscribe to new messages in a conversation
export function subscribeToMessages(
  conversationId: string,
  callback: (message: ChatMessage) => void
) {
  const supabase = createClient();
  
  const subscription = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversationId=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(subscription);
  };
}

// Subscribe to conversation updates
export function subscribeToConversations(
  userId: string,
  callback: (conversation: Conversation) => void
) {
  const supabase = createClient();
  
  const subscription = supabase
    .channel(`user_conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participants=cs.{${userId}}`,
      },
      (payload) => {
        callback(payload.new as Conversation);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(subscription);
  };
} 