"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, ShoppingBag, CalendarDays, BookOpen, Bookmark } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev: number) => prev - 1);
    } else {
      setLikeCount((prev: number) => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send the comment to the API
    console.log("Comment submitted:", commentText);
    setCommentText("");
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  const handlePostClick = () => {
    router.push(`/social/posts/${post.id}`);
  };
  
  const toggleSaved = () => {
    setIsSaved(!isSaved);
  };
  
  const toggleActions = () => {
    setShowActions(!showActions);
  };
  
  // Format the created date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  // Check if post has associated items (products, services, or courses)
  const hasShoppableItems = post.tags?.some((tag: string) => 
    ['skincare', 'makeup', 'haircare'].includes(tag));
  
  const hasBookableServices = post.tags?.some((tag: string) => 
    ['massage', 'facial', 'spa', 'wellness', 'haircut'].includes(tag));
  
  const hasCourses = post.tags?.some((tag: string) => 
    ['workshop', 'tutorial', 'class'].includes(tag));
  
  return (
    <div className="bg-card rounded-lg shadow overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author?.id}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10">
              {post.author?.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author?.displayName || `${post.author?.firstName} ${post.author?.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
          </Link>
          
          <div>
            <Link href={`/profile/${post.author?.id}`} className="font-medium hover:underline">
              {post.author?.displayName || `${post.author?.firstName} ${post.author?.lastName}`}
            </Link>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{timeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-3 w-3 inline mr-1" />
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleSaved} className={`text-muted-foreground hover:text-foreground ${isSaved ? 'text-primary' : ''}`}>
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? 'Saved' : 'Save post'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <button onClick={toggleActions} className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-4">
        {post.content && (
          <p className="mb-4 text-sm">{post.content}</p>
        )}
        
        {post.imageUrl && (
          <div className="rounded-md overflow-hidden mb-4 relative group">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full object-cover max-h-[500px]" 
            />
            
            {/* Shoppable/Bookable overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-end justify-end p-3 gap-2">
              {hasShoppableItems && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/shop?tags=${post.tags?.join(',')}`}>
                        <Button size="sm" variant="secondary" className="rounded-full flex items-center gap-1 bg-white/90 text-black hover:bg-white">
                          <ShoppingBag className="h-4 w-4" />
                          <span>Shop</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shop featured products</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {hasBookableServices && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/appointments?provider=${post.author?.id}`}>
                        <Button size="sm" variant="secondary" className="rounded-full flex items-center gap-1 bg-white/90 text-black hover:bg-white">
                          <CalendarDays className="h-4 w-4" />
                          <span>Book</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Book this service</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {hasCourses && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/courses?tags=${post.tags?.join(',')}`}>
                        <Button size="sm" variant="secondary" className="rounded-full flex items-center gap-1 bg-white/90 text-black hover:bg-white">
                          <BookOpen className="h-4 w-4" />
                          <span>Learn</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View related courses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
        
        {post.images && post.images.length > 0 && (
          <div className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-4`}>
            {post.images.map((image: string, index: number) => (
              <div 
                key={index} 
                className={`rounded-md overflow-hidden relative group ${
                  post.images.length === 1 ? 'max-h-96' : 'max-h-64'
                }`}
              >
                <img src={image} alt="Post content" className="w-full h-full object-cover" />
                
                {/* Shoppable/Bookable overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-end justify-end p-3 gap-2">
                  {hasShoppableItems && (
                    <Link href={`/shop?tags=${post.tags?.join(',')}`}>
                      <Button size="sm" variant="secondary" className="rounded-full flex items-center gap-1 bg-white/90 text-black hover:bg-white">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only">Shop</span>
                      </Button>
                    </Link>
                  )}
                  
                  {hasBookableServices && (
                    <Link href={`/appointments?provider=${post.author?.id}`}>
                      <Button size="sm" variant="secondary" className="rounded-full flex items-center gap-1 bg-white/90 text-black hover:bg-white">
                        <CalendarDays className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only">Book</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag: string) => (
              <Link href={`/tag/${tag}`} key={tag}>
                <span className="text-xs text-primary hover:underline">#{tag}</span>{' '}
              </Link>
            ))}
          </div>
        )}
        
        {/* Post Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {likeCount > 0 && (
              <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            )}
          </div>
          
          <div>
            {post.commentCount > 0 && (
              <button onClick={toggleComments} className="hover:underline">
                {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Product/Service CTA - show when relevant */}
      {(hasShoppableItems || hasBookableServices || hasCourses) && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {hasShoppableItems && (
              <Link href={`/shop?tags=${post.tags?.join(',')}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop Products</span>
                </Button>
              </Link>
            )}
            
            {hasBookableServices && (
              <Link href={`/appointments?provider=${post.author?.id}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Book Appointment</span>
                </Button>
              </Link>
            )}
            
            {hasCourses && (
              <Link href={`/courses?tags=${post.tags?.join(',')}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>View Course</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Post Actions */}
      <div className="flex border-t border-b">
        <button 
          onClick={handleLike}
          className={`flex-1 py-2 flex items-center justify-center gap-1 ${
            isLiked ? 'text-red-500' : 'text-muted-foreground'
          } hover:bg-muted/50`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">Like</span>
        </button>
        
        <button 
          onClick={toggleComments}
          className="flex-1 py-2 flex items-center justify-center gap-1 text-muted-foreground hover:bg-muted/50"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">Comment</span>
        </button>
        
        <button className="flex-1 py-2 flex items-center justify-center gap-1 text-muted-foreground hover:bg-muted/50">
          <Share2 className="h-5 w-5" />
          <span className="text-sm">Share</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="p-4 space-y-4">
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
              {/* Current user avatar would come from auth context in a real app */}
              <div className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
            
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 text-sm p-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>
          
          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                    {comment.author?.avatarUrl ? (
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author?.displayName || `${comment.author?.firstName} ${comment.author?.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <Link href={`/profile/${comment.author?.id}`} className="font-medium text-sm hover:underline">
                        {comment.author?.displayName || `${comment.author?.firstName} ${comment.author?.lastName}`}
                      </Link>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1 ml-2">
                      <span>{timeAgo(comment.createdAt)}</span>
                      <button className="hover:text-foreground">Like</button>
                      <button className="hover:text-foreground">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
      
      {/* Action Menu (conditionally rendered) */}
      {showActions && (
        <div className="absolute top-14 right-4 bg-card shadow-lg rounded-md border z-10">
          <div className="py-1">
            <button 
              onClick={() => { setShowActions(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              {isSaved ? 'Unsave post' : 'Save post'}
            </button>
            <Link 
              href={`/profile/${post.author?.id}`}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 block"
              onClick={() => setShowActions(false)}
            >
              View profile
            </Link>
            <button 
              onClick={() => { console.log('Report post'); setShowActions(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 text-destructive"
            >
              Report post
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 