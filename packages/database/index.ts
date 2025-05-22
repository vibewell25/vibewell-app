import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export * from '@prisma/client';

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
      bookings: {
        Row: {
          id: string
          customerId: string
          providerId: string
          serviceId: string
          status: string
          startTime: string
          endTime: string
          price: number
          notes?: string | null
          cancellationReason?: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          customerId: string
          providerId: string
          serviceId: string
          status: string
          startTime: string
          endTime: string
          price: number
          notes?: string | null
          cancellationReason?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          customerId?: string
          providerId?: string
          serviceId?: string
          status?: string
          startTime?: string
          endTime?: string
          price?: number
          notes?: string | null
          cancellationReason?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          iconUrl?: string | null
          imageUrl?: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          iconUrl?: string | null
          imageUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          iconUrl?: string | null
          imageUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      notifications: {
        Row: {
          id: string
          userId: string
          type: string
          title: string
          message: string
          isRead: boolean
          linkUrl?: string | null
          createdAt: string
        }
        Insert: {
          id?: string
          userId: string
          type: string
          title: string
          message: string
          isRead: boolean
          linkUrl?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          userId?: string
          type?: string
          title?: string
          message?: string
          isRead?: boolean
          linkUrl?: string | null
          createdAt?: string
        }
      }
      profiles: {
        Row: {
          id: string
          userId: string
          firstName: string
          lastName: string
          displayName?: string | null
          bio?: string | null
          email: string
          phone?: string | null
          avatarUrl?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zipCode?: string | null
          country?: string | null
          role: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userId: string
          firstName: string
          lastName: string
          displayName?: string | null
          bio?: string | null
          email: string
          phone?: string | null
          avatarUrl?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zipCode?: string | null
          country?: string | null
          role: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userId?: string
          firstName?: string
          lastName?: string
          displayName?: string | null
          bio?: string | null
          email?: string
          phone?: string | null
          avatarUrl?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zipCode?: string | null
          country?: string | null
          role?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      reviews: {
        Row: {
          id: string
          serviceId: string
          customerId: string
          providerId: string
          bookingId?: string | null
          rating: number
          comment?: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          serviceId: string
          customerId: string
          providerId: string
          bookingId?: string | null
          rating: number
          comment?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          serviceId?: string
          customerId?: string
          providerId?: string
          bookingId?: string | null
          rating?: number
          comment?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      services: {
        Row: {
          id: string
          providerId: string
          categoryId: string
          title: string
          description: string
          price: number
          duration: number
          imageUrl?: string | null
          isActive: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          providerId: string
          categoryId: string
          title: string
          description: string
          price: number
          duration: number
          imageUrl?: string | null
          isActive?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          providerId?: string
          categoryId?: string
          title?: string
          description?: string
          price?: number
          duration?: number
          imageUrl?: string | null
          isActive?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 