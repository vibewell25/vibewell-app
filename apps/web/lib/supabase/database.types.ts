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
          role: UserRole
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
          role?: UserRole
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
          role?: UserRole
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_userId_fkey"
            columns: ["userId"]
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
          categoryId: string
          isPrivate: boolean
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
          categoryId: string
          isPrivate?: boolean
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
          categoryId?: string
          isPrivate?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_providerId_fkey"
            columns: ["providerId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_categoryId_fkey"
            columns: ["categoryId"]
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
          status: BookingStatus
          notes: string | null
          price: number
          cancellationReason: string | null
          cancellationNotes: string | null
          cancellationFee: number | null
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
          status?: BookingStatus
          notes?: string | null
          price: number
          cancellationReason?: string | null
          cancellationNotes?: string | null
          cancellationFee?: number | null
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
          status?: BookingStatus
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_providerId_fkey"
            columns: ["providerId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_serviceId_fkey"
            columns: ["serviceId"]
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
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_providerId_fkey"
            columns: ["providerId"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_serviceId_fkey"
            columns: ["serviceId"]
            referencedRelation: "services"
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
      booking_status: BookingStatus
      loyalty_tier: LoyaltyTier
      order_status: OrderStatus
      user_role: UserRole
    }
  }
} 