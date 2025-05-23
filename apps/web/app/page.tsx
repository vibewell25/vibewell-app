import Link from "next/link";
import { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { PersonalizedRecommendations } from "@/components/home/personalized-recommendations";
import { TrendingServices } from "@/components/home/trending-services";
import { NewsUpdates } from "@/components/home/news-updates";
import { AIInsightsSection } from "@/components/home/ai-insights-section";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";

export const metadata: Metadata = {
  title: "Home | VibeWell",
  description: "Discover, book, and manage beauty and wellness services with VibeWell",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Personalized Recommendations Section - Only shows for logged in users */}
        <PersonalizedRecommendations />

        {/* AI Insights Section */}
        <AIInsightsSection />

        {/* Trending Services */}
        <TrendingServices />

        {/* News & Updates */}
        <NewsUpdates />

        {/* Features Section */}
        <FeaturesSection />
      </main>
    </div>
  );
} 