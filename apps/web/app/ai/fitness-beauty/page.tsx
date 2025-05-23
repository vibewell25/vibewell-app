import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Fitness for Beauty | VibeWell",
  description: "Exercise routines that complement your beauty goals and enhance well-being",
};

export default function AIFitnessBeautyPage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-6">AI Fitness for Beauty Enhancement</h1>
      <p className="text-lg mb-12">
        Discover personalized fitness routines that complement your beauty goals and enhance overall well-being.
      </p>
      
      <div className="bg-muted p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p>
          We're currently fine-tuning our AI fitness recommendations. Check back soon for personalized workout plans!
        </p>
      </div>
    </div>
  );
} 