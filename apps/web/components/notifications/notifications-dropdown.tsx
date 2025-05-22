"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { 
  Notification, 
  NotificationService 
} from "@/lib/notifications/notification-service";
import { useRouter } from "next/navigation";

export function NotificationsDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Create Supabase client
        const supabase = createClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // User not authenticated, don't show error
          setLoading(false);
          return;
        }
        
        // Get user profile to get the ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("userId", user.id)
          .single();
        
        if (!profile || !profile.id) {
          console.warn("User profile not found");
          setLoading(false);
          return;
        }
        
        // Create notification service
        const notificationService = new NotificationService(supabase);
        
        // Get unread notifications
        const unreadNotifications = await notificationService.getUnreadNotifications(profile.id);
        setUnreadCount(unreadNotifications.length);
        
        // Get all notifications (limited to 10)
        const allNotifications = await notificationService.getAllNotifications(profile.id, 10);
        setNotifications(allNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", 
          error instanceof Error ? error.message : "Unknown error");
        // Don't show empty state on error
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
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
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn("User not authenticated");
        return;
      }
      
      // Get user profile to get the ID
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("userId", user.id)
        .single();
      
      if (!profile || !profile.id) {
        console.warn("User profile not found");
        return;
      }
      
      const notificationService = new NotificationService(supabase);
      await notificationService.markAllAsRead(profile.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", 
        error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.linkUrl) {
      router.push(notification.linkUrl);
    }
    
    setIsOpen(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return "just now";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-accent transition-colors"
        onClick={handleToggleDropdown}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover shadow-md z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="mb-2">
                  <Bell className="h-8 w-8 mx-auto opacity-20" />
                </div>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b last:border-0 hover:bg-accent/50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    {!notification.isRead && (
                      <div className="flex justify-end mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-primary hover:underline block py-2"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 