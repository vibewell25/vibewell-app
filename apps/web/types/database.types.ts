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
      ai_recommendations: {
        Row: {
          createdAt: string
          id: string
          recommendationData: Json
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          recommendationData: Json
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          recommendationData?: Json
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      blog_categories: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          slug: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          approved: boolean
          content: string
          createdAt: string
          id: string
          postId: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          approved?: boolean
          content: string
          createdAt?: string
          id?: string
          postId: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          approved?: boolean
          content?: string
          createdAt?: string
          id?: string
          postId?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      blog_posts: {
        Row: {
          authorId: string
          categoryId: string | null
          content: string
          coverImage: string | null
          createdAt: string
          excerpt: string | null
          id: string
          publishedAt: string | null
          slug: string
          status: string
          title: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          categoryId?: string | null
          content: string
          coverImage?: string | null
          createdAt?: string
          excerpt?: string | null
          id?: string
          publishedAt?: string | null
          slug: string
          status?: string
          title: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          categoryId?: string | null
          content?: string
          coverImage?: string | null
          createdAt?: string
          excerpt?: string | null
          id?: string
          publishedAt?: string | null
          slug?: string
          status?: string
          title?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      booking_reminders: {
        Row: {
          bookingId: string
          createdAt: string
          id: string
          reminderSent: boolean
          reminderType: string
          scheduledFor: string
          updatedAt: string | null
        }
        Insert: {
          bookingId: string
          createdAt?: string
          id?: string
          reminderSent?: boolean
          reminderType: string
          scheduledFor: string
          updatedAt?: string | null
        }
        Update: {
          bookingId?: string
          createdAt?: string
          id?: string
          reminderSent?: boolean
          reminderType?: string
          scheduledFor?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_reminders_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          cancelledAt: string | null
          createdAt: string
          customerId: string
          date: string
          endTime: string
          id: string
          notes: string | null
          providerId: string
          serviceId: string
          startTime: string
          status: string
          updatedAt: string | null
        }
        Insert: {
          cancelledAt?: string | null
          createdAt?: string
          customerId: string
          date: string
          endTime: string
          id?: string
          notes?: string | null
          providerId: string
          serviceId: string
          startTime: string
          status?: string
          updatedAt?: string | null
        }
        Update: {
          cancelledAt?: string | null
          createdAt?: string
          customerId?: string
          date?: string
          endTime?: string
          id?: string
          notes?: string | null
          providerId?: string
          serviceId?: string
          startTime?: string
          status?: string
          updatedAt?: string | null
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
      }
      certificates: {
        Row: {
          certificateNumber: string
          certificateUrl: string
          courseId: string
          createdAt: string
          enrollmentId: string
          id: string
          issuedAt: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          certificateNumber: string
          certificateUrl: string
          courseId: string
          createdAt?: string
          enrollmentId: string
          id?: string
          issuedAt: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          certificateNumber?: string
          certificateUrl?: string
          courseId?: string
          createdAt?: string
          enrollmentId?: string
          id?: string
          issuedAt?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_courseId_fkey"
            columns: ["courseId"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_enrollmentId_fkey"
            columns: ["enrollmentId"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          createdAt: string
          id: string
          lastMessageAt: string
          participants: string[]
          title: string | null
          type: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          lastMessageAt?: string
          participants: string[]
          title?: string | null
          type?: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          lastMessageAt?: string
          participants?: string[]
          title?: string | null
          type?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          authorId: string
          coverImage: string | null
          createdAt: string
          description: string
          durationMinutes: number
          id: string
          isPublished: boolean
          price: number
          title: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          coverImage?: string | null
          createdAt?: string
          description: string
          durationMinutes: number
          id?: string
          isPublished?: boolean
          price: number
          title: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          coverImage?: string | null
          createdAt?: string
          description?: string
          durationMinutes?: number
          id?: string
          isPublished?: boolean
          price?: number
          title?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      enrollments: {
        Row: {
          certificateIssued: boolean | null
          certificateUrl: string | null
          completedAt: string | null
          completedLessons: string[]
          courseId: string
          createdAt: string
          enrolledAt: string
          id: string
          lastAccessedAt: string
          progress: number
          updatedAt: string | null
          userId: string
        }
        Insert: {
          certificateIssued?: boolean | null
          certificateUrl?: string | null
          completedAt?: string | null
          completedLessons?: string[]
          courseId: string
          createdAt?: string
          enrolledAt?: string
          id?: string
          lastAccessedAt?: string
          progress?: number
          updatedAt?: string | null
          userId: string
        }
        Update: {
          certificateIssued?: boolean | null
          certificateUrl?: string | null
          completedAt?: string | null
          completedLessons?: string[]
          courseId?: string
          createdAt?: string
          enrolledAt?: string
          id?: string
          lastAccessedAt?: string
          progress?: number
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_courseId_fkey"
            columns: ["courseId"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          content: string
          courseId: string
          createdAt: string
          description: string
          durationMinutes: number
          id: string
          isPublished: boolean
          position: number
          title: string
          updatedAt: string | null
          videoUrl: string | null
        }
        Insert: {
          content: string
          courseId: string
          createdAt?: string
          description: string
          durationMinutes: number
          id?: string
          isPublished?: boolean
          position: number
          title: string
          updatedAt?: string | null
          videoUrl?: string | null
        }
        Update: {
          content?: string
          courseId?: string
          createdAt?: string
          description?: string
          durationMinutes?: number
          id?: string
          isPublished?: boolean
          position?: number
          title?: string
          updatedAt?: string | null
          videoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_courseId_fkey"
            columns: ["courseId"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string
          conversationId: string
          createdAt: string
          id: string
          isRead: boolean
          senderId: string
          updatedAt: string | null
        }
        Insert: {
          content: string
          conversationId: string
          createdAt?: string
          id?: string
          isRead?: boolean
          senderId: string
          updatedAt?: string | null
        }
        Update: {
          content?: string
          conversationId?: string
          createdAt?: string
          id?: string
          isRead?: boolean
          senderId?: string
          updatedAt?: string | null
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
      order_items: {
        Row: {
          createdAt: string
          id: string
          orderId: string
          price: number
          productId: string
          productType: string
          quantity: number
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          orderId: string
          price: number
          productId: string
          productType: string
          quantity?: number
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          orderId?: string
          price?: number
          productId?: string
          productType?: string
          quantity?: number
          updatedAt?: string | null
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
      }
      orders: {
        Row: {
          createdAt: string
          customerId: string
          id: string
          paymentIntentId: string | null
          paymentStatus: string
          total: number
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          customerId: string
          id?: string
          paymentIntentId?: string | null
          paymentStatus?: string
          total: number
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          customerId?: string
          id?: string
          paymentIntentId?: string | null
          paymentStatus?: string
          total?: number
          updatedAt?: string | null
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
      }
      products: {
        Row: {
          categoryId: string | null
          createdAt: string
          description: string
          id: string
          images: string[]
          inventory: number | null
          isAvailable: boolean
          name: string
          price: number
          stripeProductId: string | null
          updatedAt: string | null
        }
        Insert: {
          categoryId?: string | null
          createdAt?: string
          description: string
          id?: string
          images?: string[]
          inventory?: number | null
          isAvailable?: boolean
          name: string
          price: number
          stripeProductId?: string | null
          updatedAt?: string | null
        }
        Update: {
          categoryId?: string | null
          createdAt?: string
          description?: string
          id?: string
          images?: string[]
          inventory?: number | null
          isAvailable?: boolean
          name?: string
          price?: number
          stripeProductId?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatarUrl: string | null
          bio: string | null
          city: string | null
          country: string | null
          createdAt: string
          displayName: string | null
          email: string
          firstName: string
          id: string
          lastName: string
          phone: string | null
          role: Database["public"]["Enums"]["UserRole"]
          state: string | null
          updatedAt: string | null
          userId: string
          zipCode: string | null
        }
        Insert: {
          address?: string | null
          avatarUrl?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          createdAt?: string
          displayName?: string | null
          email: string
          firstName: string
          id?: string
          lastName: string
          phone?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          state?: string | null
          updatedAt?: string | null
          userId: string
          zipCode?: string | null
        }
        Update: {
          address?: string | null
          avatarUrl?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          createdAt?: string
          displayName?: string | null
          email?: string
          firstName?: string
          id?: string
          lastName?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          state?: string | null
          updatedAt?: string | null
          userId?: string
          zipCode?: string | null
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
      provider_breaks: {
        Row: {
          createdAt: string
          endTime: string
          id: string
          providerId: string
          startTime: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          endTime: string
          id?: string
          providerId: string
          startTime: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          endTime?: string
          id?: string
          providerId?: string
          startTime?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_breaks_providerId_fkey"
            columns: ["providerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      provider_schedules: {
        Row: {
          createdAt: string
          dayOfWeek: number
          endTime: string
          id: string
          isAvailable: boolean
          providerId: string
          startTime: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          dayOfWeek: number
          endTime: string
          id?: string
          isAvailable?: boolean
          providerId: string
          startTime: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          dayOfWeek?: number
          endTime?: string
          id?: string
          isAvailable?: boolean
          providerId?: string
          startTime?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_schedules_providerId_fkey"
            columns: ["providerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          categoryId: string | null
          createdAt: string
          description: string
          durationMinutes: number
          id: string
          isAvailable: boolean
          name: string
          price: number
          providerId: string
          updatedAt: string | null
        }
        Insert: {
          categoryId?: string | null
          createdAt?: string
          description: string
          durationMinutes: number
          id?: string
          isAvailable?: boolean
          name: string
          price: number
          providerId: string
          updatedAt?: string | null
        }
        Update: {
          categoryId?: string | null
          createdAt?: string
          description?: string
          durationMinutes?: number
          id?: string
          isAvailable?: boolean
          name?: string
          price?: number
          providerId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_providerId_fkey"
            columns: ["providerId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      skin_analyses: {
        Row: {
          analysisData: Json
          createdAt: string
          id: string
          imageUrl: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          analysisData: Json
          createdAt?: string
          id?: string
          imageUrl: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          analysisData?: Json
          createdAt?: string
          id?: string
          imageUrl?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "skin_analyses_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      virtual_tryons: {
        Row: {
          createdAt: string
          id: string
          imageUrl: string
          productId: string | null
          resultImageUrl: string | null
          status: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          imageUrl: string
          productId?: string | null
          resultImageUrl?: string | null
          status?: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          imageUrl?: string
          productId?: string | null
          resultImageUrl?: string | null
          status?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_tryons_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "virtual_tryons_userId_fkey"
            columns: ["userId"]
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
      UserRole: "CUSTOMER" | "PROVIDER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 