import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Nutrition Plans | VibeWell",
  description: "Get personalized nutrition recommendations for radiant skin and wellness",
};

export default function AINutritionPage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-6">AI Nutrition Plans</h1>
      <p className="text-lg mb-12">
        Discover personalized nutrition recommendations to enhance your skin health and overall wellness.
      </p>
      
      <div className="bg-muted p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p>
          We're currently fine-tuning our AI nutrition planning tools. Check back soon for personalized nutrition recommendations!
        </p>
      </div>
    </div>
  );
} 