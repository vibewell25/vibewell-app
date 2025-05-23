import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | VibeWell",
  description: "Latest news, tips, and updates from the VibeWell community",
};

export default function BlogPage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-6">VibeWell Blog</h1>
      <p className="text-lg mb-12">
        Stay updated with the latest wellness trends, beauty tips, and VibeWell news.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-muted"></div>
          <div className="p-6">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              Trends
            </span>
            <h2 className="text-xl font-semibold mt-3 mb-2">The Latest Beauty Trends for 2023</h2>
            <p className="text-muted-foreground mb-4">
              Discover the hottest beauty trends that are taking the industry by storm this year.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Emma Johnson</span>
              <span className="mx-2">•</span>
              <span>4 min read</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-muted"></div>
          <div className="p-6">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              Wellness
            </span>
            <h2 className="text-xl font-semibold mt-3 mb-2">Self-Care Rituals to Reduce Stress</h2>
            <p className="text-muted-foreground mb-4">
              Learn effective self-care practices to incorporate into your daily routine for stress reduction.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Michael Chen</span>
              <span className="mx-2">•</span>
              <span>6 min read</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-muted"></div>
          <div className="p-6">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              Skincare
            </span>
            <h2 className="text-xl font-semibold mt-3 mb-2">Natural Ingredients for Glowing Skin</h2>
            <p className="text-muted-foreground mb-4">
              Explore the power of natural ingredients that can transform your skincare routine.
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Sarah Williams</span>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 