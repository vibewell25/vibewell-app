"use client";

import { Metadata } from "next";
import { posts, providers, customers, categories } from "@/lib/mock-data";
import { PostCard } from "@/components/social/post-card";
import { PostForm } from "@/components/social/post-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { CalendarDays, BookOpen, ShoppingBag, Sparkles, Flame, Clock, Users2, Grid3X3 } from "lucide-react";
import "./social.css";

// Metadata can't be exported from client components
// export const metadata: Metadata = {
//   title: "Social Feed | VibeWell",
//   description: "Connect with beauty and wellness providers and enthusiasts in the VibeWell community",
// };

export default function SocialFeedPage() {
  // Combine provider and customer info for post authors
  const allProfiles = [...providers, ...customers];
  
  // Add author info to each post
  const postsWithAuthors = posts.map(post => {
    const author = allProfiles.find(profile => profile.id === post.authorId);
    return {
      ...post,
      author
    };
  });
  
  // Sort posts by date (newest first)
  const sortedPosts = [...postsWithAuthors].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Featured providers (for promotional content)
  const featuredProviders = providers.slice(0, 5);

  return (
    <div className="container py-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex gap-4">
          <Link href="/appointments" className="flex flex-col items-center min-w-[70px]">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mb-1">
              <CalendarDays className="h-7 w-7" />
            </div>
            <span className="text-xs font-medium">Book</span>
          </Link>
          
          <Link href="/courses" className="flex flex-col items-center min-w-[70px]">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white mb-1">
              <BookOpen className="h-7 w-7" />
            </div>
            <span className="text-xs font-medium">Courses</span>
          </Link>
          
          <Link href="/shop" className="flex flex-col items-center min-w-[70px]">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center text-white mb-1">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <span className="text-xs font-medium">Shop</span>
          </Link>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Explore</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Users2 className="h-4 w-4" />
            <span className="hidden sm:inline">Connect</span>
          </Button>
        </div>
      </div>
      
      {/* Featured Stories/Promotions Carousel */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Featured</h2>
          <Link href="/featured" className="text-sm text-primary">See all</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {featuredProviders.map((provider) => (
            <Link href={`/provider/${provider.id}`} key={provider.id} className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary p-[2px] mb-1">
                <img 
                  src={provider.avatarUrl || '/placeholders/user.png'} 
                  alt={provider.displayName || `${provider.firstName} ${provider.lastName}`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-xs text-center truncate w-20">
                {provider.displayName || `${provider.firstName}`}
              </span>
            </Link>
          ))}
          
          {/* Featured promotional content */}
          <Link href="/promo/summer-sale" className="flex flex-col items-center min-w-[80px]">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 p-[2px] mb-1 bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <span className="text-xs text-center truncate w-20">Summer Sale</span>
          </Link>
          
          <Link href="/promo/new-treatments" className="flex flex-col items-center min-w-[80px]">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 p-[2px] mb-1 bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <span className="text-xs text-center truncate w-20">New Treatments</span>
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* New Post Form */}
          <div className="bg-card rounded-lg shadow p-4 mb-6">
            <PostForm 
              currentUser={{
                id: "current-user",
                firstName: "Current",
                lastName: "User",
                avatarUrl: "/placeholders/user.png" // Using the same placeholder as elsewhere in the code
              }}
            />
          </div>
          
          {/* Tabs for feed filtering */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4 w-full justify-start overflow-x-auto hide-scrollbar">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Grid3X3 className="h-4 w-4" /> All
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center gap-1">
                <Users2 className="h-4 w-4" /> Following
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-1">
                <Flame className="h-4 w-4" /> Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Recent
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {sortedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-2">Follow providers to see their posts</h3>
                <p className="text-muted-foreground mb-4">
                  Visit provider profiles and click follow to see their content here
                </p>
                <Link href="/providers">
                  <Button>Browse Providers</Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="trending" className="space-y-6">
              {sortedPosts
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 5)
                .map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-6">
              {sortedPosts.slice(0, 5).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          {/* User recommendations */}
          <div className="bg-card rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-3">Suggested for You</h2>
            <div className="space-y-4">
              {providers.slice(0, 3).map(provider => (
                <Link href={`/provider/${provider.id}`} key={provider.id}>
                  <div className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <img 
                      src={provider.avatarUrl || '/placeholders/user.png'} 
                      alt={provider.displayName || `${provider.firstName} ${provider.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{provider.displayName || `${provider.firstName} ${provider.lastName}`}</p>
                      <p className="text-xs text-muted-foreground">{provider.bio?.substring(0, 40)}...</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex-shrink-0">Follow</Button>
                  </div>
                </Link>
              ))}
              <Link href="/providers">
                <Button variant="outline" className="w-full">View All Providers</Button>
              </Link>
            </div>
          </div>
          
          {/* Service categories */}
          <div className="bg-card rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-3">Explore Services</h2>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <Link 
                  href={`/services/${category.id}`} 
                  key={category.id}
                  className="flex flex-col items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <div className="w-10 h-10 mb-2 flex items-center justify-center">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="w-6 h-6"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Popular tags */}
          <div className="bg-card rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-3">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {['skincare', 'haircare', 'wellness', 'makeup', 'selfcare', 'beauty', 'spa', 'massage'].map(tag => (
                <Link href={`/tag/${tag}`} key={tag}>
                  <div className="bg-muted px-3 py-1 rounded-full text-sm hover:bg-muted/80 cursor-pointer">
                    #{tag}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Featured promotion */}
          <div className="bg-gradient-to-r from-rose-400 to-orange-300 rounded-lg shadow p-4 text-white">
            <h2 className="font-semibold text-lg mb-2">Summer Beauty Sale</h2>
            <p className="text-sm mb-3">Get 20% off all skincare treatments this month!</p>
            <Link href="/promo/summer-sale">
              <Button variant="secondary" className="w-full">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}