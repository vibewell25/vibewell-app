// Site configuration
export const siteConfig = {
  name: "VibeWell",
  url: "https://getvibewell.com",
  description: "Discover, book, and manage beauty and wellness services.",
  keywords: ["beauty", "wellness", "booking", "services", "spa", "salon"],
  authors: [
    {
      name: "VibeWell Team",
      url: "https://getvibewell.com",
    },
  ],
  creator: "VibeWell Team",
  ogImage: "https://getvibewell.com/og.jpg",
};

// Navigation items
export const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "Wellness",
    href: "/wellness",
  },
  {
    title: "Community",
    href: "/community",
  },
  {
    title: "About",
    href: "/about",
  },
];

// Feature flags
export const featureFlags = {
  enableAI: true,
  enableVirtualTryOn: true,
  enableCrypto: true,
  enableVideoConsultation: true,
};

// Service categories
export const serviceCategories = [
  { name: "Hair", icon: "scissors", color: "#FFC107" },
  { name: "Skin", icon: "heart", color: "#F44336" },
  { name: "Nails", icon: "paint-brush", color: "#9C27B0" },
  { name: "Spa", icon: "droplet", color: "#2196F3" },
  { name: "Massage", icon: "activity", color: "#4CAF50" },
  { name: "Makeup", icon: "star", color: "#FF5722" },
  { name: "Wellness", icon: "zap", color: "#3F51B5" },
  { name: "Fitness", icon: "activity", color: "#009688" },
];

// Auth configuration
export const authConfig = {
  loginRedirectPath: "/dashboard",
  signUpRedirectPath: "/onboarding",
  unauthorizedRedirectPath: "/auth/login",
  publicPaths: ["/", "/auth/login", "/auth/signup", "/about", "/terms", "/privacy"],
};

// API endpoints (relative paths)
export const apiEndpoints = {
  auth: "/api/auth",
  services: "/api/services",
  bookings: "/api/bookings",
  profile: "/api/profile",
  posts: "/api/posts",
  products: "/api/products",
  orders: "/api/orders",
  loyalty: "/api/loyalty",
};

// Limits for pagination
export const paginationConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
};

// Supabase table names (matching Prisma schema)
export const tableNames = {
  profiles: "profiles",
  services: "services",
  categories: "categories",
  bookings: "bookings",
  reviews: "reviews",
  posts: "posts",
  comments: "comments",
  products: "products",
  orders: "orders",
  orderItems: "order_items",
  loyaltyPoints: "loyalty_points",
  messages: "messages",
}; 