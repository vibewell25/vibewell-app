"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@vibewell/types";
import { Logo } from "./ui/logo";

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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if current path is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Get current user
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
            // Store error in state instead of logging to console
            setError(`Failed to fetch profile: ${error.message}`);
          }

          if (data) {
            // Convert data to proper Profile type with defaults for missing fields
            setProfile({
              id: data.id || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || user.email || "",
              role: data.role as UserRole || UserRole.CUSTOMER,
              avatarUrl: data.avatarUrl || null,
            });
          }
        }
      } catch (err) {
        // Store error in state instead of logging to console
        setError(`Error fetching user: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
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
              // Store error in state instead of logging to console
              setError(`Auth state change error: ${error.message}`);
            }

            if (data) {
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
              const email = session.user.email || "";
              setProfile({
                id: session.user.id,
                firstName: email.split('@')[0] || "User",
                lastName: "",
                email: email,
                role: UserRole.CUSTOMER,
                avatarUrl: null,
              });
            }
          } catch (err) {
            // Store error in state instead of logging to console
            setError(`Error in auth state change: ${err instanceof Error ? err.message : String(err)}`);
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

  // Render content based on the component state
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* Render error message if there is one */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm" role="alert">
          <span className="sr-only">Error:</span> {error}
        </div>
      )}
      
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Logo />
          <nav className="hidden md:flex ml-6 space-x-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/services")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Services
            </Link>
            <Link
              href="/providers"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/providers")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Providers
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && !user ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sign up
                </Link>
              </>
            ) : !isLoading && user ? (
              <div className="relative">
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
                  <span className="text-sm font-medium">{getUserDisplayName()}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border bg-background p-1 shadow-md">
                    <div className="p-2 text-sm font-medium">
                      {profile?.email || user.email || "User"}
                    </div>
                    <div className="border-t pt-1">
                      <Link
                        href="/dashboard"
                        className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/bookings"
                        className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        Bookings
                      </Link>
                      {profile?.role === "PROVIDER" && (
                        <Link
                          href="/provider/dashboard"
                          className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                        >
                          Provider Dashboard
                        </Link>
                      )}
                      {profile?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                        >
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
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-md border border-input"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Toggle menu</span>
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
              className="h-4 w-4"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/services")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Services
            </Link>
            <Link
              href="/providers"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/providers")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Providers
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              About
            </Link>
            {!isLoading && !user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sign up
                </Link>
              </div>
            ) : !isLoading && user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t">
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
                <Link
                  href="/dashboard"
                  className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                >
                  Profile
                </Link>
                <Link
                  href="/bookings"
                  className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                >
                  Bookings
                </Link>
                {profile?.role === "PROVIDER" && (
                  <Link
                    href="/provider/dashboard"
                    className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  >
                    Provider Dashboard
                  </Link>
                )}
                {profile?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full rounded-sm px-3 py-2 text-left text-sm text-red-500 hover:bg-accent"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
} 