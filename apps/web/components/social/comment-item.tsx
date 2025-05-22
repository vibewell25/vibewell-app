"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: {
    id: string;
    authorId: string;
    content: string;
    likes: number;
    isLiked: boolean;
    createdAt: Date;
  };
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role?: string;
  };
  isPostAuthor?: boolean;
}

export function CommentItem({ comment, author, isPostAuthor = false }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (isLiked) {
        setLikeCount(prev => prev - 1);
      } else {
        setLikeCount(prev => prev + 1);
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  
  // Format the created date
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  
  return (
    <div className="py-3 flex gap-3">
      <Link href={`/profile/${author.id}`}>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
          {author.avatarUrl ? (
            <img 
              src={author.avatarUrl} 
              alt={`${author.firstName} ${author.lastName}`}
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
      </Link>
      
      <div className="flex-1">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-baseline gap-2 mb-1">
            <Link href={`/profile/${author.id}`} className="font-medium hover:text-primary">
              {author.firstName} {author.lastName}
            </Link>
            
            {isPostAuthor && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                Author
              </span>
            )}
          </div>
          
          <p className="text-sm">{comment.content}</p>
        </div>
        
        <div className="flex items-center mt-1 gap-4 text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          
          <button 
            onClick={handleLike}
            className="flex items-center gap-1"
          >
            {isLiked ? (
              <span className="text-primary">Liked</span>
            ) : (
              <span>Like</span>
            )}
            {likeCount > 0 && <span>({likeCount})</span>}
          </button>
          
          <button>Reply</button>
        </div>
      </div>
    </div>
  );
} 