import { Metadata } from "next";
import { providers, customers } from "@/lib/mock-data";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages | VibeWell",
  description: "Connect with beauty and wellness providers through direct messaging",
};

// Mock messages for UI purposes
const mockMessages = [
  {
    id: "m1",
    senderId: "1", // Sarah (provider)
    recipientId: "c1", // Alice (customer)
    content: "Hi Alice, I just wanted to confirm your appointment for tomorrow at 2pm. Looking forward to seeing you!",
    isRead: true,
    createdAt: new Date("2023-07-18T14:30:00"),
  },
  {
    id: "m2",
    senderId: "c1", // Alice (customer)
    recipientId: "1", // Sarah (provider)
    content: "Thanks for confirming! I'll be there. Should I bring anything specific?",
    isRead: true,
    createdAt: new Date("2023-07-18T14:45:00"),
  },
  {
    id: "m3",
    senderId: "1", // Sarah (provider)
    recipientId: "c1", // Alice (customer)
    content: "Just bring yourself! Everything else is provided. See you tomorrow!",
    isRead: false,
    createdAt: new Date("2023-07-18T15:00:00"),
  },
  {
    id: "m4",
    senderId: "4", // Emma (provider)
    recipientId: "c1", // Alice (customer) 
    content: "Hello Alice, I noticed you booked a facial treatment. I wanted to recommend avoiding any retinol products 48 hours before your appointment.",
    isRead: true,
    createdAt: new Date("2023-07-17T10:15:00"),
  },
  {
    id: "m5",
    senderId: "c1", // Alice (customer)
    recipientId: "4", // Emma (provider)
    content: "Thanks for the heads up! I'll make sure to skip those products.",
    isRead: true,
    createdAt: new Date("2023-07-17T10:30:00"),
  }
];

// Mock current user for UI purposes
const currentUser = {
  id: "c1", // Alice
  firstName: "Alice",
  lastName: "Anderson",
  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
};

export default function MessagesPage() {
  // Group messages by conversation partner
  const conversations = mockMessages.reduce((acc, message) => {
    const isCurrentUserSender = message.senderId === currentUser.id;
    const partnerId = isCurrentUserSender ? message.recipientId : message.senderId;
    
    if (!acc[partnerId]) {
      const partner = [...providers, ...customers].find(p => p.id === partnerId);
      acc[partnerId] = {
        partner,
        messages: [],
      };
    }
    
    acc[partnerId].messages.push(message);
    return acc;
  }, {});
  
  // Sort conversations by latest message
  const sortedConversations = Object.entries(conversations).sort((a, b) => {
    const aLatest = a[1].messages.sort((m1, m2) => m2.createdAt.getTime() - m1.createdAt.getTime())[0];
    const bLatest = b[1].messages.sort((m1, m2) => m2.createdAt.getTime() - m1.createdAt.getTime())[0];
    return bLatest.createdAt.getTime() - aLatest.createdAt.getTime();
  });
  
  // Get the first conversation for the active view
  const activeConversation = sortedConversations.length > 0 ? sortedConversations[0][1] : null;
  const activeMessages = activeConversation?.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">Messages</h1>
        <p className="text-muted-foreground">
          Connect with beauty and wellness providers through direct messaging.
        </p>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[700px]">
          {/* Conversation List */}
          <div className="border-r border-border">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              {sortedConversations.map(([partnerId, conversation]) => {
                const partner = conversation.partner;
                const latestMessage = conversation.messages.sort((a, b) => 
                  b.createdAt.getTime() - a.createdAt.getTime()
                )[0];
                
                const hasUnread = conversation.messages.some(
                  m => !m.isRead && m.senderId === partnerId
                );
                
                return (
                  <div 
                    key={partnerId}
                    className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer ${partnerId === sortedConversations[0][0] ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={partner?.avatarUrl || '/placeholders/user.png'} 
                        alt={partner?.displayName || `${partner?.firstName} ${partner?.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium truncate">
                            {partner?.displayName || `${partner?.firstName} ${partner?.lastName}`}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(latestMessage.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <p className={`text-sm truncate ${hasUnread ? 'font-semibold' : 'text-muted-foreground'}`}>
                            {latestMessage.content.length > 40 
                              ? latestMessage.content.substring(0, 40) + '...' 
                              : latestMessage.content}
                          </p>
                          {hasUnread && (
                            <span className="ml-2 w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Conversation View */}
          <div className="col-span-2 flex flex-col h-full">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <img 
                    src={activeConversation.partner?.avatarUrl || '/placeholders/user.png'} 
                    alt={activeConversation.partner?.displayName || `${activeConversation.partner?.firstName} ${activeConversation.partner?.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {activeConversation.partner?.displayName || `${activeConversation.partner?.firstName} ${activeConversation.partner?.lastName}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activeConversation.partner?.role === 'PROVIDER' ? 'Provider' : 'Customer'}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeMessages.map(message => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    return (
                      <div 
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <h3 className="text-xl font-medium mb-2">No messages yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start a conversation with a provider to see messages here
                  </p>
                  <Link href="/providers">
                    <Button>Browse Providers</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 