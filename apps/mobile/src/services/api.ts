import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// We'll need to add these to the environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication service
export const authService = {
  // Expose supabase client for auth listeners
  supabase,
  
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Reset password
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  },

  // Get current user
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },

  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession();
  },
};

// User profile service
export const profileService = {
  // Get user profile
  getProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  // Update user profile
  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  },
};

// Service providers service
export const providerService = {
  // Get featured providers
  getFeaturedProviders: async () => {
    return await supabase
      .from('providers')
      .select('*')
      .eq('featured', true)
      .order('rating', { ascending: false });
  },

  // Get provider by ID
  getProviderById: async (id: string) => {
    return await supabase
      .from('providers')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Search providers
  searchProviders: async (query: string) => {
    return await supabase
      .from('providers')
      .select('*')
      .ilike('name', `%${query}%`);
  },
};

// Booking service
export const bookingService = {
  // Create a booking
  createBooking: async (bookingData: any) => {
    return await supabase
      .from('bookings')
      .insert(bookingData);
  },

  // Get user bookings
  getUserBookings: async (userId: string) => {
    return await supabase
      .from('bookings')
      .select('*, service:services(*), provider:providers(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  // Get booking by ID
  getBookingById: async (id: string) => {
    return await supabase
      .from('bookings')
      .select('*, service:services(*), provider:providers(*)')
      .eq('id', id)
      .single();
  },

  // Cancel booking
  cancelBooking: async (id: string) => {
    return await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);
  },
};

// Services service
export const servicesService = {
  // Get all services
  getAllServices: async () => {
    return await supabase
      .from('services')
      .select('*');
  },

  // Get service by ID
  getServiceById: async (id: string) => {
    return await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Get services by provider
  getServicesByProvider: async (providerId: string) => {
    return await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerId);
  },
}; 