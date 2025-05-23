import { BookingStatus, LoyaltyTier, OrderStatus, UserRole } from "@vibewell/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          userId: string
          email: string
          firstName: string
          lastName: string
          displayName: string | null
          bio: string | null
          avatarUrl: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zipCode: string | null
          country: string | null
          role: Database['public']['Enums']['UserRole']
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userId: string
          email: string
          firstName: string
          lastName: string
          displayName?: string | null
          bio?: string | null
          avatarUrl?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zipCode?: string | null
          country?: string | null
          role?: Database['public']['Enums']['UserRole']
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userId?: string
          email?: string
          firstName?: string
          lastName?: string
          displayName?: string | null
          bio?: string | null
          avatarUrl?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zipCode?: string | null
          country?: string | null
          role?: Database['public']['Enums']['UserRole']
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          providerId: string
          title: string
          description: string
          price: number
          duration: number
          isActive: boolean
          isPrivate: boolean
          categoryId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          providerId: string
          title: string
          description: string
          price: number
          duration: number
          isActive?: boolean
          isPrivate?: boolean
          categoryId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          providerId?: string
          title?: string
          description?: string
          price?: number
          duration?: number
          isActive?: boolean
          isPrivate?: boolean
          categoryId?: string
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_providerId_fkey"
            columns: ["providerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          iconUrl: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          iconUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          iconUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          customerId: string
          providerId: string
          serviceId: string
          startTime: string
          endTime: string
          status: Database['public']['Enums']['BookingStatus']
          notes: string | null
          price: number
          cancellationReason: string | null
          cancellationNotes: string | null
          cancellationFee: number | null
          hasReview: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          customerId: string
          providerId: string
          serviceId: string
          startTime: string
          endTime: string
          status?: Database['public']['Enums']['BookingStatus']
          notes?: string | null
          price: number
          cancellationReason?: string | null
          cancellationNotes?: string | null
          cancellationFee?: number | null
          hasReview?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          customerId?: string
          providerId?: string
          serviceId?: string
          startTime?: string
          endTime?: string
          status?: Database['public']['Enums']['BookingStatus']
          notes?: string | null
          price?: number
          cancellationReason?: string | null
          cancellationNotes?: string | null
          cancellationFee?: number | null
          hasReview?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_providerId_fkey"
            columns: ["providerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      },
      reviews: {
        Row: {
          id: string
          bookingId: string
          customerId: string
          providerId: string
          serviceId: string
          rating: number
          comment: string
          isPublic: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          bookingId: string
          customerId: string
          providerId: string
          serviceId: string
          rating: number
          comment: string
          isPublic?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          bookingId?: string
          customerId?: string
          providerId?: string
          serviceId?: string
          rating?: number
          comment?: string
          isPublic?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_providerId_fkey"
            columns: ["providerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_serviceId_fkey"
            columns: ["serviceId"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      },
      orders: {
        Row: {
          id: string
          customerId: string
          status: Database['public']['Enums']['OrderStatus']
          total: number
          paymentIntentId: string | null
          notes: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          customerId: string
          status?: Database['public']['Enums']['OrderStatus']
          total: number
          paymentIntentId?: string | null
          notes?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          customerId?: string
          status?: Database['public']['Enums']['OrderStatus']
          total?: number
          paymentIntentId?: string | null
          notes?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      order_items: {
        Row: {
          id: string
          orderId: string
          productId: string
          quantity: number
          price: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          orderId: string
          productId: string
          quantity: number
          price: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          orderId?: string
          productId?: string
          quantity?: number
          price?: number
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      },
      conversations: {
        Row: {
          id: string
          participants: string[]
          lastMessageAt: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          participants: string[]
          lastMessageAt?: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          participants?: string[]
          lastMessageAt?: string
          createdAt?: string
          updatedAt?: string
        }
        Relationships: []
      },
      messages: {
        Row: {
          id: string
          conversationId: string
          senderId: string
          content: string
          isRead: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          conversationId: string
          senderId: string
          content: string
          isRead?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          conversationId?: string
          senderId?: string
          content?: string
          isRead?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_senderId_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      UserRole: 'ADMIN' | 'PROVIDER' | 'CUSTOMER'
      BookingStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
      OrderStatus: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
      LoyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
    }
  }
}

export type DbUserRole = Database['public']['Enums']['UserRole']
export type DbBookingStatus = Database['public']['Enums']['BookingStatus']
export type DbOrderStatus = Database['public']['Enums']['OrderStatus']
export type DbLoyaltyTier = Database['public']['Enums']['LoyaltyTier']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row'] 