"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { 
  Notification, 
  NotificationService 
} from "@/lib/notifications/notification-service";

interface NotificationsListProps {
  userId: string;
}

export function NotificationsList({ userId }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const notificationService = new NotificationService(supabase);

      // Get all notifications for this page
      const allNotifications = await notificationService.getAllNotifications(
        userId, 
        pageSize, 
        (page - 1) * pageSize
      );
      
      // Update state
      setNotifications(prev => 
        page === 1 
          ? allNotifications 
          : [...prev, ...allNotifications]
      );
      
      // Check if there are more notifications to load
      setHasMore(allNotifications.length === pageSize);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingRead(true);
    try {
      const supabase = createClient();
      const notificationService = new NotificationService(supabase);
      await notificationService.markAllAsRead(userId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const supabase = createClient();
      const notificationService = new NotificationService(supabase);
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);

  return (
    <div className="space-y-6">
      {hasUnreadNotifications && (
        <div className="flex justify-end">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingRead}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        </div>
      )}
      
      {loading && page === 1 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border rounded-lg">
          <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-medium mb-2">No notifications yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            When you receive notifications about your bookings, reviews, and other
            activity, they'll show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y border rounded-lg overflow-hidden">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${!notification.isRead ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2"></span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span>{formatDate(notification.createdAt)}</span>
                      {notification.linkUrl && (
                        <Link
                          href={notification.linkUrl}
                          className="ml-4 text-primary hover:underline"
                        >
                          View details
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Mark as read"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-accent transition-colors"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Load more</span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 