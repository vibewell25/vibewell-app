"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  readTime: number;
  slug: string;
  featured?: boolean;
};

export function NewsUpdates() {
  // In a real implementation, these would come from an API
  const newsArticles: NewsArticle[] = [
    {
      id: "news1",
      title: "The Latest Beauty Trends for 2023",
      excerpt: "Discover the hottest beauty trends that are taking the industry by storm this year.",
      content: "Full article content would go here...",
      image: "/images/news/beauty-trends.jpg",
      category: "Trends",
      author: {
        name: "Emma Johnson",
        avatar: "/images/authors/emma.jpg",
      },
      publishedAt: new Date(2023, 6, 15),
      readTime: 4,
      slug: "beauty-trends-2023",
      featured: true,
    },
    {
      id: "news2",
      title: "Self-Care Rituals to Reduce Stress",
      excerpt: "Learn effective self-care practices to incorporate into your daily routine for stress reduction.",
      content: "Full article content would go here...",
      image: "/images/news/self-care.jpg",
      category: "Wellness",
      author: {
        name: "Michael Chen",
        avatar: "/images/authors/michael.jpg",
      },
      publishedAt: new Date(2023, 6, 10),
      readTime: 6,
      slug: "self-care-rituals",
    },
    {
      id: "news3",
      title: "Natural Ingredients for Glowing Skin",
      excerpt: "Explore the power of natural ingredients that can transform your skincare routine.",
      content: "Full article content would go here...",
      image: "/images/news/natural-ingredients.jpg",
      category: "Skincare",
      author: {
        name: "Sarah Williams",
        avatar: "/images/authors/sarah.jpg",
      },
      publishedAt: new Date(2023, 6, 5),
      readTime: 5,
      slug: "natural-ingredients-skincare",
    },
    {
      id: "news4",
      title: "VibeWell Partners with Top Wellness Brands",
      excerpt: "Exciting new partnerships that will bring exclusive offers to our community.",
      content: "Full article content would go here...",
      image: "/images/news/partners.jpg",
      category: "Company News",
      author: {
        name: "David Miller",
        avatar: "/images/authors/david.jpg",
      },
      publishedAt: new Date(2023, 5, 28),
      readTime: 3,
      slug: "vibewell-partnerships",
    },
  ];

  return (
    <section className="w-full py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Latest News & Updates</h2>
            <p className="text-muted-foreground">
              Stay informed about wellness trends, tips, and VibeWell updates
            </p>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 md:mt-0" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured article - takes up 2 columns */}
          {newsArticles.filter(article => article.featured).map(article => (
            <div key={article.id} className="lg:col-span-2">
              <Link href={`/blog/${article.slug}`}>
                <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer h-full">
                  <div className="grid md:grid-cols-2 gap-0 h-full">
                    <div className="relative h-60 md:h-full">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                      <Badge variant="secondary" className="absolute top-4 left-4 bg-primary text-white hover:bg-primary/90">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <CardTitle className="text-xl md:text-2xl mb-2">{article.title}</CardTitle>
                        <CardDescription className="text-base mb-4 line-clamp-3">
                          {article.excerpt}
                        </CardDescription>
                      </div>
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 relative">
                            <Image
                              src={article.author.avatar}
                              alt={article.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{article.author.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{article.readTime} min read</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary" asChild>
                          <span>
                            Read Full Article
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
          
          {/* Recent articles - 1 column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Recent Articles</h3>
            {newsArticles.filter(article => !article.featured).map(article => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <Card className="overflow-hidden hover:shadow-sm transition-all cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 overflow-hidden rounded">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <Badge variant="outline" className="mb-1 text-xs">
                          {article.category}
                        </Badge>
                        <h4 className="font-medium text-sm mb-1 line-clamp-1">{article.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            
            <Button variant="outline" size="sm" className="w-full mt-6" asChild>
              <Link href="/blog">
                See All Articles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 