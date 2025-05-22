"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ChatMessage,
  ChatParticipant,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
} from "@/lib/chat";

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  otherParticipant: ChatParticipant;
  onBack?: () => void;
}

export function ChatInterface({
  conversationId,
  currentUserId,
  otherParticipant,
  onBack,
}: ChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessages(conversationId);
        setMessages(fetchedMessages);
        
        // Mark messages as read
        await markMessagesAsRead(conversationId, currentUserId);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [conversationId, currentUserId]);
  
  // Subscribe to new messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // If the message is from the other participant, mark it as read
      if (newMessage.senderId !== currentUserId) {
        markMessagesAsRead(conversationId, currentUserId);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [conversationId, currentUserId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      const message = await sendMessage(
        conversationId,
        currentUserId,
        newMessage.trim()
      );
      
      if (!message) {
        throw new Error("Failed to send message");
      }
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce<Record<string, ChatMessage[]>>(
    (groups, message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {}
  );

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={otherParticipant.avatarUrl || ""}
            alt={otherParticipant.displayName || `${otherParticipant.firstName} ${otherParticipant.lastName}`}
          />
          <AvatarFallback>
            {getInitials(
              otherParticipant.displayName ||
                `${otherParticipant.firstName} ${otherParticipant.lastName}`
            )}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="font-medium">
            {otherParticipant.displayName ||
              `${otherParticipant.firstName} ${otherParticipant.lastName}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {otherParticipant.role === "PROVIDER" ? "Provider" : "Customer"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div className="flex items-start gap-2 max-w-[70%]">
                  {i % 2 === 0 && (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  )}
                  <div>
                    <Skeleton
                      className={`h-20 ${
                        i % 2 === 0 ? "w-64" : "w-48"
                      } rounded-lg`}
                    />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Actual messages
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {formatDate(date)}
                </div>
              </div>
              
              {dateMessages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex items-start gap-2 max-w-[70%]">
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={otherParticipant.avatarUrl || ""}
                            alt={
                              otherParticipant.displayName ||
                              `${otherParticipant.firstName} ${otherParticipant.lastName}`
                            }
                          />
                          <AvatarFallback>
                            {getInitials(
                              otherParticipant.displayName ||
                                `${otherParticipant.firstName} ${otherParticipant.lastName}`
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser
                              ? "text-right text-muted-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 