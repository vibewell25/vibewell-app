import { Metadata } from "next";
import { bookings, providers } from "@/lib/mock-data";
import { Star, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Reviews & Ratings | VibeWell",
  description: "Manage your reviews and provide feedback on beauty and wellness services",
};

// Mock reviews data
const mockReviews = [
  {
    id: "r1",
    providerId: "1", // Sarah's Beauty Studio
    serviceId: "1", // Women's Haircut & Style
    customerId: "c1", // Alice
    bookingId: "1",
    rating: 5,
    title: "Amazing haircut experience!",
    content: "Sarah was absolutely amazing! She listened to what I wanted and delivered exactly that. My hair looks fantastic and I've received so many compliments. The salon was clean and comfortable, and the whole experience was lovely. Will definitely be back!",
    createdAt: new Date("2023-06-16"),
    status: "published",
    reply: {
      content: "Thank you so much for your kind words, Alice! It was a pleasure working with you, and I'm thrilled you love your new haircut. Looking forward to seeing you again soon!",
      createdAt: new Date("2023-06-17")
    }
  },
  {
    id: "r2",
    providerId: "2", // Mike's Massage Therapy
    serviceId: "3", // Swedish Massage
    customerId: "c1", // Alice
    bookingId: "2",
    rating: 4,
    title: "Relaxing massage, will return",
    content: "Mike provided a very relaxing Swedish massage. The pressure was perfect and I felt so much better afterward. The only reason for 4 stars instead of 5 is that the room was a bit cold. Otherwise, great experience and I will definitely return.",
    createdAt: new Date("2023-06-22"),
    status: "published",
    reply: null
  },
  {
    id: "r3",
    providerId: "4", // Emma's Skin Care Clinic
    serviceId: "7", // Deep Cleansing Facial
    customerId: "c3", // Carlos
    bookingId: "4",
    rating: null, // No rating yet
    title: "",
    content: "",
    createdAt: null,
    status: "pending",
    reply: null
  }
];

// Calculate average ratings per provider
type ProviderRatings = {
  [providerId: string]: {
    totalRating: number;
    reviewCount: number;
  }
};

const providerRatings = mockReviews.reduce<ProviderRatings>((acc, review) => {
  if (review.rating && review.status === "published") {
    if (!acc[review.providerId]) {
      acc[review.providerId] = {
        totalRating: 0,
        reviewCount: 0
      };
    }
    acc[review.providerId].totalRating += review.rating;
    acc[review.providerId].reviewCount++;
  }
  return acc;
}, {});

// Get provider data with average ratings
const providersWithRatings = providers.map(provider => {
  const ratingData = providerRatings[provider.id];
  const avgRating = ratingData ? (ratingData.totalRating / ratingData.reviewCount).toFixed(1) : null;
  return {
    ...provider,
    avgRating,
    reviewCount: ratingData?.reviewCount || 0
  };
});

export default function ReviewsPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Reviews & Ratings</h1>
        <p className="text-muted-foreground">
          Share your experiences and help others find great service providers.
        </p>
      </div>
      
      {/* Reviews to Complete Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Pending Reviews</h2>
        <div className="bg-card rounded-lg shadow overflow-hidden">
          {mockReviews.filter(review => review.status === "pending").length > 0 ? (
            <div className="divide-y divide-border">
              {mockReviews
                .filter(review => review.status === "pending")
                .map(review => {
                  const booking = bookings.find(b => b.id === review.bookingId);
                  const provider = providers.find(p => p.id === review.providerId);
                  const service = booking?.service;
                  
                  return (
                    <div key={review.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <img 
                              src={provider?.avatarUrl || '/placeholders/user.png'} 
                              alt={provider?.displayName} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-medium">{provider?.displayName}</h3>
                              <p className="text-sm text-muted-foreground">{service?.title}</p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking?.startTime && (
                              <>Visit on {new Date(booking.startTime).toLocaleDateString()}</>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button className="text-sm border border-border rounded-md px-3 py-1.5 hover:bg-muted">
                            Skip
                          </button>
                          <button className="text-sm bg-primary text-primary-foreground rounded-md px-3 py-1.5 hover:bg-primary/90">
                            Write Review
                          </button>
                        </div>
                      </div>
                      
                      {/* Review Form */}
                      <div className="bg-muted/50 rounded-lg p-5">
                        <h4 className="font-medium mb-4">How was your experience?</h4>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Rating</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button 
                                key={star} 
                                className="text-gray-300 hover:text-yellow-400"
                              >
                                <Star className="h-8 w-8 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-muted-foreground mb-2">Title</label>
                          <input 
                            type="text" 
                            placeholder="Summarize your experience" 
                            className="w-full p-2 rounded-md border border-border"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-muted-foreground mb-2">Review</label>
                          <textarea 
                            rows={4} 
                            placeholder="Share details of your experience with this provider" 
                            className="w-full p-2 rounded-md border border-border"
                          ></textarea>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your review will be visible to the provider and other customers
                          </p>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <button className="text-sm border border-border rounded-md px-3 py-1.5 hover:bg-muted">
                            Cancel
                          </button>
                          <button className="text-sm bg-primary text-primary-foreground rounded-md px-3 py-1.5 hover:bg-primary/90">
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <h3 className="text-lg font-medium mb-2">You're all caught up!</h3>
              <p className="text-muted-foreground mb-4">
                You've reviewed all your recent bookings. Check back after your next appointment.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Your Reviews Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Your Reviews</h2>
        <div className="bg-card rounded-lg shadow overflow-hidden">
          {mockReviews.filter(review => review.status === "published").length > 0 ? (
            <div className="divide-y divide-border">
              {mockReviews
                .filter(review => review.status === "published")
                .map(review => {
                  const provider = providers.find(p => p.id === review.providerId);
                  const booking = bookings.find(b => b.id === review.bookingId);
                  const service = booking?.service;
                  
                  return (
                    <div key={review.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <img 
                          src={provider?.avatarUrl || '/placeholders/user.png'} 
                          alt={provider?.displayName} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between gap-2 mb-1">
                            <h3 className="font-medium">{provider?.displayName}</h3>
                            <div className="text-sm text-muted-foreground">
                              {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{service?.title}</p>
                          
                          <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                className={`h-5 w-5 ${
                                  review.rating && star <= review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          
                          <h4 className="font-medium mb-1">{review.title}</h4>
                          <p className="text-sm mb-4">{review.content}</p>
                          
                          <div className="flex gap-3">
                            <button className="text-sm text-primary hover:underline flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button className="text-sm text-amber-600 hover:underline flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                          
                          {/* Provider Reply */}
                          {review.reply && (
                            <div className="mt-4 pl-4 border-l-2 border-border">
                              <div className="flex items-start gap-3">
                                <img 
                                  src={provider?.avatarUrl || '/placeholders/user.png'} 
                                  alt={provider?.displayName} 
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <div className="flex items-baseline justify-between">
                                    <h5 className="font-medium text-sm">{provider?.displayName}</h5>
                                    <span className="text-xs text-muted-foreground">
                                      {review.reply.createdAt && new Date(review.reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1">{review.reply.content}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any reviews yet. After your appointments, you'll be able to share your experience.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Top Rated Providers */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Rated Providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providersWithRatings
            .filter(provider => provider.avgRating !== null)
            .sort((a, b) => {
              const aRating = a.avgRating ? parseFloat(a.avgRating) : 0;
              const bRating = b.avgRating ? parseFloat(b.avgRating) : 0;
              return bRating - aRating;
            })
            .slice(0, 4)
            .map(provider => (
              <div key={provider.id} className="bg-card rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={provider.avatarUrl || '/placeholders/user.png'} 
                      alt={provider.displayName} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{provider.displayName}</h3>
                      <div className="flex items-center text-sm">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${
                                provider.avgRating && star <= Math.round(parseFloat(provider.avgRating))
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-muted-foreground">
                          ({provider.avgRating}) · {provider.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {provider.bio}
                  </p>
                  <div className="flex justify-between">
                    <a 
                      href={`/provider/${provider.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </a>
                    <a 
                      href={`/provider/${provider.id}#reviews`}
                      className="text-sm text-primary hover:underline"
                    >
                      Read Reviews
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 