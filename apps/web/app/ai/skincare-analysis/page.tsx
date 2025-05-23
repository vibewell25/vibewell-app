import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Skincare Analysis | VibeWell",
  description: "Get personalized skincare recommendations powered by AI",
};

export default function AISkincarePage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-6">AI Skincare Analysis</h1>
      <p className="text-lg mb-12">
        Receive personalized skincare recommendations based on your unique skin profile.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">1</div>
              <div>
                <p className="font-medium">Upload a photo</p>
                <p className="text-muted-foreground">Provide a clear image of your skin for analysis</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">2</div>
              <div>
                <p className="font-medium">Answer a few questions</p>
                <p className="text-muted-foreground">Share details about your skin concerns and goals</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">3</div>
              <div>
                <p className="font-medium">Get your analysis</p>
                <p className="text-muted-foreground">Receive AI-powered skincare recommendations</p>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="border rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Start Your Analysis</h2>
          <p className="mb-6 text-muted-foreground">
            Complete the form below to receive your personalized skincare recommendations.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Skin Type</label>
              <select className="w-full p-2 border rounded-md">
                <option>Select your skin type</option>
                <option>Dry</option>
                <option>Oily</option>
                <option>Combination</option>
                <option>Normal</option>
                <option>Sensitive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Main Concerns</label>
              <select className="w-full p-2 border rounded-md">
                <option>Select your main concern</option>
                <option>Acne</option>
                <option>Aging</option>
                <option>Hyperpigmentation</option>
                <option>Dryness</option>
                <option>Sensitivity</option>
              </select>
            </div>
            <button className="w-full bg-primary text-white py-3 rounded-md font-medium">
              Analyze My Skin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 