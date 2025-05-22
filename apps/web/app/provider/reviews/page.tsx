"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Star, MessageSquare, Filter, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

// Response form schema
const responseFormSchema = z.object({
  response: z.string().min(10, {
    message: "Response must be at least 10 characters.",
  }).max(500, {
    message: "Response must not be longer than 500 characters.",
  }),
});

type ResponseFormValues = z.infer<typeof responseFormSchema>;

// Mock reviews data - in a real app, this would come from the database
const mockReviews = [
  {
    id: "r1",
    clientId: "c1",
    clientName: "Alice Anderson",
    clientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    serviceId: "s1",
    serviceName: "Signature Facial",
    rating: 5,
    comment: "Sarah is amazing! The facial was exactly what my skin needed. She took the time to understand my concerns and recommended the perfect products for my skin type. I've already booked my next appointment!",
    response: "Thank you so much for your kind words, Alice! I'm thrilled that you enjoyed your facial and found the product recommendations helpful. Looking forward to seeing you again soon!",
    createdAt: new Date("2023-07-15T14:30:00"),
    respondedAt: new Date("2023-07-15T16:45:00"),
    isPublic: true,
  },
  {
    id: "r2",
    clientId: "c2",
    clientName: "Michael Brown",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    serviceId: "s2",
    serviceName: "Deep Tissue Massage",
    rating: 4,
    comment: "Great massage that really helped with my back pain. Sarah has strong hands and found all my problem areas. The only reason for 4 stars instead of 5 is that the room was a bit cold for my preference.",
    response: null,
    createdAt: new Date("2023-07-10T11:15:00"),
    respondedAt: null,
    isPublic: true,
  },
  {
    id: "r3",
    clientId: "c3",
    clientName: "Emily Wilson",
    clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    serviceId: "s3",
    serviceName: "Chemical Peel",
    rating: 5,
    comment: "This was my first chemical peel and Sarah made me feel so comfortable throughout the process. She explained everything clearly and the results are fantastic! My skin looks so much brighter and more even-toned.",
    response: "Thank you for trusting me with your first chemical peel, Emily! I'm delighted to hear about your positive experience and the results you're seeing. Remember to keep up with your SPF!",
    createdAt: new Date("2023-07-05T09:45:00"),
    respondedAt: new Date("2023-07-05T14:20:00"),
    isPublic: true,
  },
  {
    id: "r4",
    clientId: "c4",
    clientName: "David Lee",
    clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    serviceId: "s1",
    serviceName: "Signature Facial",
    rating: 3,
    comment: "The facial itself was good, but I felt rushed through the appointment. I had questions about my skincare routine that weren't fully addressed.",
    response: null,
    createdAt: new Date("2023-06-28T16:30:00"),
    respondedAt: null,
    isPublic: true,
  },
  {
    id: "r5",
    clientId: "c5",
    clientName: "Sophia Martinez",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    serviceId: "s3",
    serviceName: "Chemical Peel",
    rating: 5,
    comment: "Absolutely worth every penny! Sarah is incredibly knowledgeable and professional. The chemical peel was tailored perfectly to my skin needs and the aftercare instructions were clear and helpful.",
    response: "Thank you for your wonderful review, Sophia! I'm so glad you're happy with your results. It's always a pleasure working with clients who are as enthusiastic about skincare as you are!",
    createdAt: new Date("2023-06-20T13:15:00"),
    respondedAt: new Date("2023-06-20T17:30:00"),
    isPublic: true,
  },
];

// Calculate average rating
const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return sum / reviews.length;
};

// Rating distribution
const getRatingDistribution = (reviews) => {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };
  
  reviews.forEach(review => {
    distribution[review.rating]++;
  });
  
  return distribution;
};

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterResponded, setFilterResponded] = useState<boolean | null>(null);
  
  // Calculate metrics
  const averageRating = calculateAverageRating(reviews);
  const ratingDistribution = getRatingDistribution(reviews);
  const totalReviews = reviews.length;
  const respondedReviews = reviews.filter(review => review.response).length;
  const responseRate = totalReviews > 0 ? Math.round((respondedReviews / totalReviews) * 100) : 0;
  
  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      response: "",
    },
  });
  
  // Filter reviews based on current filters
  const filteredReviews = reviews.filter(review => {
    if (filterRating !== null && review.rating !== filterRating) {
      return false;
    }
    
    if (filterResponded === true && !review.response) {
      return false;
    }
    
    if (filterResponded === false && review.response) {
      return false;
    }
    
    return true;
  });
  
  const openResponseDialog = (review) => {
    setCurrentReview(review);
    form.reset({
      response: review.response || "",
    });
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentReview(null);
  };
  
  const clearFilters = () => {
    setFilterRating(null);
    setFilterResponded(null);
  };
  
  async function onSubmit(data: ResponseFormValues) {
    if (!currentReview) return;
    
    setIsLoading(true);
    
    try {
      // In a real application, this would update the review response in Supabase
      const supabase = createClient();
      
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedReviews = reviews.map(review => 
        review.id === currentReview.id 
          ? { 
              ...review, 
              response: data.response, 
              respondedAt: new Date() 
            } 
          : review
      );
      
      setReviews(updatedReviews);
      handleDialogClose();
      toast.success("Response submitted successfully!");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  
  // Generate star rating display
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">Reviews & Ratings</h1>
        <p className="text-muted-foreground">
          View and respond to client reviews of your services.
        </p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
              <StarRating rating={Math.round(averageRating)} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              From {totalReviews} reviews
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{responseRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">
              {respondedReviews} of {totalReviews} reviews
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="w-12 text-sm flex items-center">
                    {rating} <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: totalReviews > 0 
                          ? `${(ratingDistribution[rating] / totalReviews) * 100}%` 
                          : "0%" 
                      }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-right">
                    {ratingDistribution[rating]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">All Reviews</h2>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {(filterRating !== null || filterResponded !== null) && (
                    <Badge variant="secondary" className="ml-2 px-1">
                      {(filterRating !== null && filterResponded !== null) ? "2" : "1"}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Reviews</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    By Rating
                  </DropdownMenuLabel>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <DropdownMenuItem 
                      key={rating}
                      onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          {rating} <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                        </div>
                        {filterRating === rating && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    By Response Status
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterResponded(filterResponded === true ? null : true)}>
                    <div className="flex items-center justify-between w-full">
                      <span>Responded</span>
                      {filterResponded === true && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterResponded(filterResponded === false ? null : false)}>
                    <div className="flex items-center justify-between w-full">
                      <span>Needs Response</span>
                      {filterResponded === false && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters} disabled={filterRating === null && filterResponded === null}>
                  <XCircle className="h-4 w-4 mr-2" /> Clear All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={review.clientAvatar} 
                          alt={review.clientName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{review.clientName}</CardTitle>
                        <CardDescription>
                          {review.serviceName} • {new Date(review.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{review.comment}</p>
                  
                  {review.response && (
                    <div className="mt-4 pl-4 border-l-2 border-muted">
                      <p className="text-sm font-medium mb-1">Your Response:</p>
                      <p className="text-sm text-muted-foreground">{review.response}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded on {new Date(review.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={review.response ? "outline" : "default"}
                    size="sm"
                    onClick={() => openResponseDialog(review)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {review.response ? "Edit Response" : "Respond"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              {filterRating !== null || filterResponded !== null
                ? "Try adjusting your filters to see more reviews"
                : "You haven't received any reviews yet"}
            </p>
            {(filterRating !== null || filterResponded !== null) && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Response Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Your response will be visible to the client and other potential clients.
            </DialogDescription>
          </DialogHeader>
          
          {currentReview && (
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={currentReview.clientAvatar} 
                      alt={currentReview.clientName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{currentReview.clientName}</span>
                </div>
                <StarRating rating={currentReview.rating} />
              </div>
              <p className="text-sm">{currentReview.comment}</p>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your response here..." 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : currentReview?.response ? "Update Response" : "Submit Response"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 