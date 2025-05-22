import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Star, Calendar, MessageSquare, CreditCard, Clock, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download the VibeWell App',
  description: 'Download the VibeWell mobile app for the best experience discovering and booking beauty and wellness services.',
};

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Experience VibeWell on Mobile</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Download our app for the complete VibeWell experience. Discover, book, and connect with beauty and wellness providers on the go.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold mb-6">Why VibeWell Mobile?</h2>
          
          <div className="space-y-6">
            <FeatureItem 
              icon={<Star className="w-6 h-6 text-primary" />}
              title="Personalized Recommendations"
              description="Get AI-powered recommendations based on your preferences and style."
            />
            
            <FeatureItem 
              icon={<Calendar className="w-6 h-6 text-primary" />}
              title="Easy Booking"
              description="Book appointments with your favorite providers in just a few taps."
            />
            
            <FeatureItem 
              icon={<MessageSquare className="w-6 h-6 text-primary" />}
              title="Direct Messaging"
              description="Chat with providers to discuss your needs before booking."
            />
            
            <FeatureItem 
              icon={<CreditCard className="w-6 h-6 text-primary" />}
              title="Secure Payments"
              description="Pay seamlessly with multiple payment options including crypto."
            />
            
            <FeatureItem 
              icon={<Clock className="w-6 h-6 text-primary" />}
              title="Real-time Notifications"
              description="Get instant updates about your bookings and messages."
            />
            
            <FeatureItem 
              icon={<Heart className="w-6 h-6 text-primary" />}
              title="Save Favorites"
              description="Create collections of your favorite services and providers."
            />
          </div>
        </div>
        
        <div className="order-1 md:order-2 flex justify-center">
          {/* This would be replaced with actual app screenshots */}
          <div className="relative h-[600px] w-[300px] bg-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Phone className="w-24 h-24 text-gray-400" />
              <p className="absolute mt-32 text-gray-500 font-medium">App Screenshot</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white rounded-2xl p-8 md:p-12 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Download Now</h2>
          <p className="text-lg opacity-90">
            Available on iOS and Android. Get started with VibeWell today!
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <AppStoreButton store="apple" />
          <AppStoreButton store="google" />
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">For Service Providers</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Are you a beauty or wellness professional? VibeWell helps you grow your business with powerful tools and access to new clients.
        </p>
        <Link 
          href="/provider/register" 
          className="inline-block bg-secondary text-primary px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
        >
          Register as a Provider
        </Link>
      </div>

      <div className="border-t border-gray-200 pt-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <p className="text-gray-600">Secure, trusted by thousands of professionals and clients</p>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} VibeWell. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function AppStoreButton({ store }: { store: 'apple' | 'google' }) {
  const isApple = store === 'apple';
  
  return (
    <Link 
      href="#" // These would link to actual app store pages
      className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-black/80 transition-colors w-full md:w-auto"
    >
      <div className="flex items-center justify-center gap-3">
        {isApple ? (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.75 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.21 2.33-.91 3.57-.84 1.5.09 2.63.94 3.38 2.4-3.28 2.11-2.25 6.75.98 7.95-.7 1.82-1.57 3.59-3.01 4.66zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.26 2.01-1.76 4.04-3.74 4.25z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.273-.712V2.526c0-.264.098-.512.273-.712zM14.863 12l4.679 4.679-10.258 5.863a1 1 0 0 1-1.017-.006L14.863 12zm0 0L8.267 1.464a1 1 0 0 1 1.017-.006l10.258 5.863L14.863 12zm4.973-3.383L16.59 12l3.246 3.383A1 1 0 0 0 20 14.7V9.3a1 1 0 0 0-.164-.683z" />
          </svg>
        )}
        <div className="text-left">
          <div className="text-xs opacity-80">Download on the</div>
          <div className="font-semibold">{isApple ? 'App Store' : 'Google Play'}</div>
        </div>
      </div>
    </Link>
  );
} 