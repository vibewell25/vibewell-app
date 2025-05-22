"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@vibewell/types";
import { Logo } from "./ui/logo";
import { NotificationsDropdown } from "./notifications/notifications-dropdown";

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
};

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toggle for mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle for user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const closeMenu = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  // Check if a navigation item is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Fetch user and profile on mount
  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch user profile
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("userId", user.id)
            .single();

          if (error) {
            // Handle RLS recursion errors silently
            if (error.message.includes('infinite recursion')) {
              console.error(`Profile fetch error: ${error.message}`);
              // Create a fallback profile from user info
              createFallbackProfile(user);
            } else {
              setError(`Failed to fetch profile: ${error.message}`);
            }
          } else if (data) {
            // Convert data to proper Profile type with defaults for missing fields
            setProfile({
              id: data.id || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || user.email || "",
              role: data.role as UserRole || UserRole.CUSTOMER,
              avatarUrl: data.avatarUrl || null,
            });
          } else {
            // No profile data found, create fallback
            createFallbackProfile(user);
          }
        }
      } catch (err) {
        // Store error in state instead of logging to console
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (!errorMessage.includes('infinite recursion')) {
          setError(`Error fetching user: ${errorMessage}`);
        } else {
          console.error(`Error fetching user: ${errorMessage}`);
          if (user) {
            createFallbackProfile(user);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to create fallback profile
    const createFallbackProfile = (user: any) => {
      const email = user.email || "";
      setProfile({
        id: user.id,
        firstName: email.split('@')[0] || "User",
        lastName: "",
        email: email,
        role: UserRole.CUSTOMER,
        avatarUrl: null,
      });
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("userId", session.user.id)
              .single();

            if (error) {
              // Don't display RLS policy errors to the user, just log them
              if (error.message.includes('infinite recursion')) {
                console.error(`Auth state change error: ${error.message}`);
                createFallbackProfile(session.user);
              } else {
                setError(`Auth state change error: ${error.message}`);
              }
            } else if (data) {
              setProfile({
                id: data.id || "",
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || session.user.email || "",
                role: data.role as UserRole || UserRole.CUSTOMER,
                avatarUrl: data.avatarUrl || null,
              });
            } else {
              // If no profile data, create a minimal profile from user info
              createFallbackProfile(session.user);
            }
          } catch (err) {
            // Filter out recursion errors from UI display
            const errorMessage = err instanceof Error ? err.message : String(err);
            if (!errorMessage.includes('infinite recursion')) {
              setError(`Error in auth state change: ${errorMessage}`);
            } else {
              console.error(`Error in auth state change: ${errorMessage}`);
              createFallbackProfile(session.user);
            }
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      // Store error in state instead of logging to console
      setError(`Sign out error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Get user initials safely
  const getUserInitials = () => {
    if (!profile) return "U";
    const firstInitial = profile.firstName?.[0] || "";
    const lastInitial = profile.lastName?.[0] || "";
    return firstInitial + lastInitial || "U";
  };

  // Get user display name safely
  const getUserDisplayName = () => {
    if (!profile) return "User";
    if (profile.firstName) {
      return profile.firstName;
    }
    if (profile.email) {
      return profile.email.split('@')[0];
    }
    return "User";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center">
            <Logo size="medium" />
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/services") || pathname.startsWith("/services/")
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              Services
            </Link>
            <Link
              href="/social"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/social") || pathname.startsWith("/social/")
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              Social
            </Link>
            <Link
              href="/messages"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/messages") || pathname.startsWith("/messages/")
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              Chat
            </Link>
            <Link
              href="/profile"
              className={`transition-colors hover:text-foreground/80 ${
                isActive("/profile") || pathname.startsWith("/profile/")
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              Profile
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {!isLoading && user ? (
              <div className="relative flex items-center space-x-4">
                {/* Add notifications dropdown */}
                <NotificationsDropdown />
                
                <button
                  type="button"
                  className="flex items-center space-x-2"
                  onClick={toggleUserMenu}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={`${profile.firstName || 'User'} ${profile.lastName || ''}`}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden md:inline-block">{getUserDisplayName()}</span>
                </button>
                
                {/* User menu dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-background p-1 shadow-md">
                    <div className="p-2 text-sm font-medium">
                      {profile?.email || user.email || "User"}
                    </div>
                    <div className="border-t pt-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="9" />
                          <rect x="14" y="3" width="7" height="5" />
                          <rect x="14" y="12" width="7" height="9" />
                          <rect x="3" y="16" width="7" height="5" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/bookings"
                        className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <line x1="3" x2="21" y1="9" y2="9" />
                          <line x1="9" x2="9" y1="21" y2="9" />
                        </svg>
                        Bookings
                      </Link>
                      {profile?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t pt-1">
                      <button
                        onClick={handleSignOut}
                        className="block w-full rounded-sm px-3 py-2 text-left text-sm text-red-500 hover:bg-accent"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !isLoading && !user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Sign up
                </Link>
              </div>
            ) : null}
            
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-4 py-4 pt-2 border-t">
            <Link
              href="/"
              className="block py-2 text-base font-medium transition-colors hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block py-2 text-base font-medium transition-colors hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/social"
              className="block py-2 text-base font-medium transition-colors hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Social
            </Link>
            <Link
              href="/messages"
              className="block py-2 text-base font-medium transition-colors hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Link>
            <Link
              href="/profile"
              className="block py-2 text-base font-medium transition-colors hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>

            {user ? (
              <>
                {/* User is logged in, show user-specific links */}
                <div className="border-t pt-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={`${profile.firstName || 'User'} ${profile.lastName || ''}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {getUserDisplayName()} {profile?.lastName || ''}
                    </span>
                  </div>
                  
                  {/* Add NotificationsDropdown to mobile menu */}
                  <div className="py-2">
                    <p className="text-sm font-medium mb-2">Notifications</p>
                    <NotificationsDropdown />
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="9" />
                      <rect x="14" y="3" width="7" height="5" />
                      <rect x="14" y="12" width="7" height="9" />
                      <rect x="3" y="16" width="7" height="5" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    href="/bookings"
                    className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <line x1="3" x2="21" y1="9" y2="9" />
                      <line x1="9" x2="9" y1="21" y2="9" />
                    </svg>
                    Bookings
                  </Link>
                  
                  {profile?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 py-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t pt-4 mt-2 space-y-2">
                <Link
                  href="/login"
                  className="block w-full rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 text-sm hidden">
          {error}
        </div>
      )}
    </header>
  );
} 