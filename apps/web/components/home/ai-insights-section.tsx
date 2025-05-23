"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, ArrowRight, Zap } from "lucide-react";

type InsightCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "skincare" | "nutrition" | "fitness" | "mental";
  link: string;
};

export function AIInsightsSection() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  
  const insightCards: InsightCard[] = [
    {
      id: "insight1",
      title: "Optimize Your Skincare Routine",
      description: "AI analysis of top routines for your skin type, with personalized product recommendations.",
      image: "/images/insights/skincare.jpg",
      category: "skincare",
      link: "/ai/skincare-analysis",
    },
    {
      id: "insight2",
      title: "Nutrition Plans for Radiant Skin",
      description: "Discover foods that promote skin health and overall wellness based on your goals.",
      image: "/images/insights/nutrition.jpg",
      category: "nutrition",
      link: "/ai/nutrition-plans",
    },
    {
      id: "insight3",
      title: "Stress-Reducing Wellness Practices",
      description: "AI-curated mindfulness and relaxation techniques personalized for your lifestyle.",
      image: "/images/insights/stress.jpg",
      category: "mental",
      link: "/ai/stress-reduction",
    },
    {
      id: "insight4",
      title: "Fitness for Beauty Enhancement",
      description: "Exercise routines that complement your beauty goals and enhance overall well-being.",
      image: "/images/insights/fitness.jpg",
      category: "fitness",
      link: "/ai/fitness-beauty",
    },
  ];

  const filteredInsights = selectedTab === "all" 
    ? insightCards 
    : insightCards.filter((insight) => insight.category === selectedTab);

  return (
    <section className="w-full py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            AI-Powered Wellness Insights
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-[700px]">
            Leverage the power of artificial intelligence to discover personalized
            wellness recommendations and beauty insights.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="all" className="px-4">All Insights</TabsTrigger>
              <TabsTrigger value="skincare" className="px-4">Skincare</TabsTrigger>
              <TabsTrigger value="nutrition" className="px-4">Nutrition</TabsTrigger>
              <TabsTrigger value="fitness" className="px-4">Fitness</TabsTrigger>
              <TabsTrigger value="mental" className="px-4">Mental Wellness</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredInsights.map((insight) => (
                <Card key={insight.id} className="overflow-hidden h-full border border-muted flex flex-col">
                  <div className="relative h-40 w-full">
                    <Image
                      src={insight.image}
                      alt={insight.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/80 text-white">
                      <Sparkles className="mr-1 h-3 w-3" />
                      AI Insight
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2 flex-grow">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <CardDescription className="text-xs capitalize">
                      {insight.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-0 text-sm text-muted-foreground flex-grow">
                    {insight.description}
                  </CardContent>
                  <CardFooter className="p-4 pt-2">
                    <Button variant="ghost" size="sm" className="ml-auto" asChild>
                      <Link href={insight.link}>
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 flex justify-center">
          <Button asChild className="gap-2">
            <Link href="/ai-hub">
              <Zap className="w-4 h-4" />
              Explore All AI Tools
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 