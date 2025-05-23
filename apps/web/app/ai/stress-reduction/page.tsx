import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Stress Reduction | VibeWell",
  description: "Personalized stress reduction techniques powered by AI",
};

export default function AIStressReductionPage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-6">AI Stress Reduction</h1>
      <p className="text-lg mb-12">
        Discover personalized stress-reduction techniques tailored to your lifestyle and preferences.
      </p>
      
      <div className="bg-muted p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p>
          We're currently enhancing our AI stress reduction tools. Check back soon for personalized wellness recommendations!
        </p>
      </div>
    </div>
  );
} 