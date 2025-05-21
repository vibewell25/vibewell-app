// User and Profile types
export interface User {
  id: string;
  email: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  PROVIDER = "PROVIDER",
  CUSTOMER = "CUSTOMER"
}

export interface Profile {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Service types
export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  categoryId: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  provider?: Profile;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking types
export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW"
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  notes?: string;
  price: number;
  cancellationReason?: string;
  cancellationNotes?: string;
  cancellationFee?: number;
  createdAt: Date;
  updatedAt: Date;
  service?: Service;
  provider?: Profile;
  customer?: Profile;
}

// Review types
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  customer?: Profile;
  service?: Service;
}

// ReviewSummary types
export interface ReviewSummary {
  serviceId: string;
  providerId: string;
  averageRating: number;
  totalReviews: number;
  ratings: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Social types
export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// E-commerce types
export interface Product {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  inventory: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED"
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

// Loyalty types
export enum LoyaltyTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM"
}

export interface LoyaltyPoints {
  id: string;
  profileId: string;
  points: number;
  tier: LoyaltyTier;
  createdAt: Date;
  updatedAt: Date;
}

// Messaging types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
} 