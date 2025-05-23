import { Metadata } from "next";
import { loyaltyPoints } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Gift, Award, Trophy, Star, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Rewards & Loyalty | VibeWell",
  description: "View your loyalty points, rewards, and redemption options",
};

// Mock current user's loyalty info for UI purposes
const currentUserLoyalty = loyaltyPoints.find(lp => lp.profileId === "c1");

// Mock rewards for redemption
const rewardsOptions = [
  {
    id: "r1",
    title: "10% Off Next Booking",
    description: "Get 10% off your next service booking",
    pointsCost: 100,
    category: "discount",
    expiresIn: "30 days after redemption",
    featured: false,
  },
  {
    id: "r2",
    title: "Free Product Sample",
    description: "Redeem a free sample of premium beauty products",
    pointsCost: 150,
    category: "product",
    expiresIn: "60 days after redemption",
    featured: false,
  },
  {
    id: "r3",
    title: "30-Minute Service Extension",
    description: "Add 30 minutes to any eligible service booking",
    pointsCost: 200,
    category: "service",
    expiresIn: "90 days after redemption",
    featured: true,
  },
  {
    id: "r4",
    title: "VIP Experience",
    description: "Enjoy a luxury VIP treatment during your next visit",
    pointsCost: 500,
    category: "experience",
    expiresIn: "6 months after redemption",
    featured: true,
  },
  {
    id: "r5",
    title: "Annual Gold Membership",
    description: "Upgrade to Gold tier with premium benefits for a full year",
    pointsCost: 1000,
    category: "membership",
    expiresIn: "1 year from activation",
    featured: true,
  }
];

// Mock point history transactions
const pointHistory = [
  {
    id: "ph1",
    description: "Booking completed with Sarah's Beauty Studio",
    points: 50,
    type: "earned",
    date: new Date("2023-07-15"),
  },
  {
    id: "ph2",
    description: "Product purchase: Premium Hair Shampoo",
    points: 25,
    type: "earned",
    date: new Date("2023-07-10"),
  },
  {
    id: "ph3",
    description: "Redeemed: 10% Off Next Booking",
    points: -100,
    type: "redeemed",
    date: new Date("2023-07-01"),
  },
  {
    id: "ph4",
    description: "Booking completed with Emma's Skin Care Clinic",
    points: 75,
    type: "earned",
    date: new Date("2023-06-25"),
  },
  {
    id: "ph5",
    description: "Referred a friend: Bob Brown",
    points: 100,
    type: "earned",
    date: new Date("2023-06-15"),
  },
];

// Tier thresholds and benefits
type TierLevel = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

interface LoyaltyTier {
  name: string;
  icon: React.ReactNode;
  threshold: number;
  nextThreshold: number | null;
  benefits: string[];
}

const loyaltyTiers: Record<TierLevel, LoyaltyTier> = {
  BRONZE: {
    name: "Bronze",
    icon: <Gift className="h-8 w-8 text-amber-700" />,
    threshold: 0,
    nextThreshold: 200,
    benefits: ["Earn 1 point per $1 spent", "Access to member-only promotions", "Birthday reward"]
  },
  SILVER: {
    name: "Silver",
    icon: <Award className="h-8 w-8 text-zinc-400" />,
    threshold: 200,
    nextThreshold: 500,
    benefits: ["Earn 1.5 points per $1 spent", "Free product samples", "Priority booking", "10% off selected services"]
  },
  GOLD: {
    name: "Gold",
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
    threshold: 500,
    nextThreshold: 1000,
    benefits: ["Earn 2 points per $1 spent", "Complimentary service upgrades", "VIP treatment", "Exclusive event invitations", "15% off selected services"]
  },
  PLATINUM: {
    name: "Platinum",
    icon: <Star className="h-8 w-8 text-purple-400" />,
    threshold: 1000,
    nextThreshold: null,
    benefits: ["Earn 3 points per $1 spent", "Dedicated concierge service", "Free annual treatment", "Early access to new services", "20% off selected services"]
  }
};

export default function RewardsPage() {
  // Get current user's tier info
  const currentTier = currentUserLoyalty && currentUserLoyalty.tier in loyaltyTiers 
    ? loyaltyTiers[currentUserLoyalty.tier as TierLevel] 
    : loyaltyTiers.BRONZE;
  const nextTier = currentUserLoyalty && currentTier.nextThreshold 
    ? Object.values(loyaltyTiers).find(tier => tier.threshold === currentTier.nextThreshold)
    : null;
  
  // Calculate progress to next tier
  let tierProgress = 0;
  if (currentUserLoyalty && nextTier) {
    const pointsInCurrentTier = currentUserLoyalty.points - currentTier.threshold;
    const pointsNeededForNextTier = nextTier.threshold - currentTier.threshold;
    tierProgress = Math.min(Math.round((pointsInCurrentTier / pointsNeededForNextTier) * 100), 100);
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">Rewards & Loyalty</h1>
        <p className="text-muted-foreground">
          Earn points with every purchase and booking. Redeem for exclusive rewards and benefits.
        </p>
      </div>
      
      {/* Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                {currentUserLoyalty ? currentUserLoyalty.points : 0} Points
              </CardTitle>
              <CardDescription>Your current loyalty points balance</CardDescription>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {currentTier.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{currentTier.name} Tier</span>
                  {nextTier && (
                    <span className="text-muted-foreground">
                      {tierProgress}% to {nextTier.name}
                    </span>
                  )}
                </div>
                <Progress value={tierProgress} className="h-2" />
              </div>
              
              {nextTier && (
                <div className="text-sm text-muted-foreground">
                  Earn {nextTier.threshold - (currentUserLoyalty?.points || 0)} more points to reach {nextTier.name} tier
                </div>
              )}
              
              <div className="pt-4">
                <h4 className="font-medium mb-2">Your {currentTier.name} Benefits</h4>
                <ul className="space-y-1">
                  {currentTier.benefits.map((benefit, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
            <CardDescription>
              Points are added automatically to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Book a Service</h4>
                <p className="text-xs text-muted-foreground">Earn 1-3 points per $1 spent on services</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Gift className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Purchase Products</h4>
                <p className="text-xs text-muted-foreground">Earn 1-3 points per $1 spent on products</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Refer Friends</h4>
                <p className="text-xs text-muted-foreground">Earn 100 points for each friend who signs up</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Rewards and History */}
      <Tabs defaultValue="redeem" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="redeem">Redeem Rewards</TabsTrigger>
          <TabsTrigger value="history">Points History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="redeem" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardsOptions.map(reward => (
              <Card key={reward.id} className={reward.featured ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  {reward.featured && (
                    <Badge className="w-fit mb-1" variant="secondary">Featured</Badge>
                  )}
                  <CardTitle>{reward.title}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Star className="h-4 w-4 mr-1" />
                    <span>{reward.pointsCost} points</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Expires: {reward.expiresIn}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={!currentUserLoyalty || currentUserLoyalty.points < reward.pointsCost}
                  >
                    {currentUserLoyalty && currentUserLoyalty.points >= reward.pointsCost 
                      ? "Redeem Reward" 
                      : `Need ${reward.pointsCost - (currentUserLoyalty?.points || 0)} more points`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Points Activity</CardTitle>
              <CardDescription>
                Recent point transactions in your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pointHistory.map(transaction => (
                  <div key={transaction.id} className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${
                        transaction.type === 'earned' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {transaction.type === 'earned' 
                          ? <ArrowRight className="h-4 w-4" /> 
                          : <Gift className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{transaction.description}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'earned' 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-amber-700 dark:text-amber-300'
                    }`}>
                      {transaction.type === 'earned' ? '+' : ''}{transaction.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Tier Comparison */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Loyalty Tiers & Benefits</CardTitle>
          <CardDescription>
            Compare benefits across our loyalty program tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Tier</th>
                  <th className="text-left py-3 px-4">Qualification</th>
                  <th className="text-left py-3 px-4">Points Rate</th>
                  <th className="text-left py-3 px-4">Key Benefits</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(loyaltyTiers).map((tier, i) => (
                  <tr 
                    key={i} 
                    className={`border-b border-border ${currentTier.name === tier.name ? 'bg-primary/5' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-1.5">
                          {tier.icon}
                        </div>
                        <span className="font-medium">{tier.name}</span>
                        {currentTier.name === tier.name && (
                          <Badge variant="secondary" className="ml-1">Current</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {tier.threshold === 0 
                        ? 'Join the program' 
                        : `${tier.threshold}+ points`}
                    </td>
                    <td className="py-3 px-4">
                      {tier.benefits[0]}
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-4 space-y-1">
                        {tier.benefits.slice(1, 3).map((benefit, j) => (
                          <li key={j} className="text-sm">{benefit}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 