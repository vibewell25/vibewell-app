import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Hub | VibeWell",
  description: "Explore our AI-powered wellness tools and insights",
};

export default function AIHubPage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-6">AI Wellness Hub</h1>
      <p className="text-lg mb-8">
        Explore our collection of AI-powered tools designed to enhance your wellness journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Skincare Analysis</h2>
          <p>Get personalized skincare recommendations based on your unique needs.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Nutrition Planning</h2>
          <p>Discover meal plans and food recommendations tailored to your wellness goals.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Fitness Recommendations</h2>
          <p>Receive personalized workout routines that complement your beauty goals.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Mental Wellness</h2>
          <p>Access AI-curated mindfulness and relaxation techniques for your lifestyle.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Beauty Trends Analysis</h2>
          <p>Stay updated with AI-identified trends in beauty and wellness.</p>
        </div>
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Product Recommendations</h2>
          <p>Get AI-powered product suggestions based on your preferences and needs.</p>
        </div>
      </div>
    </div>
  );
} 