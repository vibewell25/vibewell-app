"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@vibewell/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Flame, Clock, ArrowRight } from "lucide-react";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  type: "service" | "provider" | "product";
  badge?: string;
};

export function PersonalizedRecommendations() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsLoggedIn(true);
          
          // Fetch user profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("userId", user.id)
            .single();
            
          if (profileData) {
            setProfile(profileData);
          }
          
          // Get personalized recommendations
          // In a real app, this would use machine learning or a recommendation algorithm
          // Here we'll use mock data for demonstration
          fetchRecommendations();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const fetchRecommendations = async () => {
    // Mock recommendations data
    // In a production app, these would come from an API based on user preferences
    const mockRecommendations: Recommendation[] = [
      {
        id: "rec1",
        title: "Deep Tissue Massage",
        description: "Based on your past appointments, you might enjoy this therapeutic treatment.",
        image: "/images/recommendations/massage.jpg",
        link: "/services/deep-tissue-massage",
        type: "service",
        badge: "Best Match",
      },
      {
        id: "rec2",
        title: "Sarah Johnson",
        description: "Highly rated esthetician specializing in treatments you've enjoyed before.",
        image: "/images/recommendations/provider.jpg",
        link: "/providers/sarah-johnson",
        type: "provider",
        badge: "Top Rated",
      },
      {
        id: "rec3",
        title: "Anti-Aging Facial",
        description: "This premium treatment aligns with your skincare preferences.",
        image: "/images/recommendations/facial.jpg",
        link: "/services/anti-aging-facial",
        type: "service",
      },
      {
        id: "rec4",
        title: "Organic Face Serum",
        description: "A perfect addition to your skincare routine based on your interests.",
        image: "/images/recommendations/product.jpg",
        link: "/products/organic-face-serum",
        type: "product",
        badge: "New",
      },
    ];
    
    setRecommendations(mockRecommendations);
  };

  // If not logged in or still loading, don't show recommendations
  if (!isLoggedIn || isLoading) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Just For You
            </h2>
            <p className="text-muted-foreground">
              Personalized recommendations based on your preferences and history
            </p>
          </div>
          <Button variant="ghost" size="sm" className="hidden md:flex items-center mt-4 md:mt-0" asChild>
            <Link href="/recommendations">
              View All Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((recommendation) => (
            <Link href={recommendation.link} key={recommendation.id}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-200 hover:translate-y-[-4px] cursor-pointer">
                <div className="relative h-48 w-full">
                  <Image
                    src={recommendation.image}
                    alt={recommendation.title}
                    fill
                    className="object-cover"
                  />
                  {recommendation.badge && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs py-1 px-2 rounded-full font-medium">
                      {recommendation.badge}
                    </div>
                  )}
                </div>
                <CardHeader className="pt-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    {recommendation.type === "service" && <Clock className="h-4 w-4 text-muted-foreground" />}
                    {recommendation.type === "provider" && <Sparkles className="h-4 w-4 text-primary" />}
                    {recommendation.type === "product" && <Flame className="h-4 w-4 text-orange-500" />}
                  </div>
                  <CardDescription className="text-xs capitalize mt-1">
                    {recommendation.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {recommendation.description}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <span className="text-primary text-sm font-medium flex items-center">
                    Learn more
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="flex md:hidden w-full justify-center mt-8">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/recommendations">
              View All Recommendations
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 