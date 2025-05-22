import { Category, Service, Profile, UserRole, Booking, BookingStatus } from "@vibewell/types";

// Mock Locations - Updated to be global
export const locations = [
  {
    id: "1",
    name: "Los Angeles",
    state: "CA",
    country: "United States"
  },
  {
    id: "2",
    name: "San Francisco",
    state: "CA",
    country: "United States"
  },
  {
    id: "3",
    name: "New York",
    state: "NY",
    country: "United States"
  },
  // UK locations with sub-regions
  {
    id: "4",
    name: "London",
    state: "England",
    country: "United Kingdom"
  },
  {
    id: "41",
    name: "Manchester",
    state: "England",
    country: "United Kingdom"
  },
  {
    id: "42",
    name: "Birmingham",
    state: "England",
    country: "United Kingdom"
  },
  {
    id: "43",
    name: "Edinburgh",
    state: "Scotland",
    country: "United Kingdom"
  },
  {
    id: "44",
    name: "Glasgow",
    state: "Scotland",
    country: "United Kingdom"
  },
  {
    id: "45",
    name: "Cardiff",
    state: "Wales",
    country: "United Kingdom"
  },
  {
    id: "46",
    name: "Belfast",
    state: "Northern Ireland",
    country: "United Kingdom"
  },
  {
    id: "5",
    name: "Paris",
    state: "",
    country: "France"
  },
  {
    id: "6",
    name: "Tokyo",
    state: "",
    country: "Japan"
  },
  {
    id: "7",
    name: "Sydney",
    state: "NSW",
    country: "Australia"
  },
  {
    id: "8",
    name: "Berlin",
    state: "",
    country: "Germany"
  },
  // Canadian locations
  {
    id: "9",
    name: "Toronto",
    state: "ON",
    country: "Canada"
  },
  {
    id: "91",
    name: "Vancouver",
    state: "BC",
    country: "Canada"
  },
  {
    id: "92",
    name: "Montreal",
    state: "QC",
    country: "Canada"
  },
  {
    id: "93",
    name: "Calgary",
    state: "AB",
    country: "Canada"
  },
  {
    id: "94",
    name: "Ottawa",
    state: "ON",
    country: "Canada"
  },
  // UAE locations
  {
    id: "10",
    name: "Dubai",
    state: "Dubai",
    country: "United Arab Emirates"
  },
  {
    id: "101",
    name: "Abu Dhabi",
    state: "Abu Dhabi",
    country: "United Arab Emirates"
  },
  {
    id: "102",
    name: "Sharjah",
    state: "Sharjah",
    country: "United Arab Emirates"
  },
  // Jamaica locations
  {
    id: "11",
    name: "Kingston",
    state: "",
    country: "Jamaica"
  },
  {
    id: "111",
    name: "Montego Bay",
    state: "",
    country: "Jamaica"
  },
  {
    id: "112",
    name: "Ocho Rios",
    state: "",
    country: "Jamaica"
  }
];

// Mock Categories
export const categories: Category[] = [
  {
    id: "1",
    name: "Hair Care",
    description: "Haircuts, coloring, styling and treatments",
    icon: "/icons/hair.svg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Skin Care",
    description: "Facials, skin treatments and consultations",
    icon: "/icons/skin.svg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "3",
    name: "Massage",
    description: "Various massage techniques for relaxation and healing",
    icon: "/icons/massage.svg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "4",
    name: "Nail Care",
    description: "Manicures, pedicures and nail art",
    icon: "/icons/nails.svg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "5",
    name: "Makeup",
    description: "Makeup application and lessons",
    icon: "/icons/makeup.svg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "6",
    name: "Wellness",
    description: "Yoga, meditation and holistic treatments",
    icon: "/icons/wellness.svg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
];

// Additional mock providers with global locations
export const providers: Profile[] = [
  {
    id: "1",
    userId: "1",
    email: "sarah.stylist@example.com",
    firstName: "Sarah",
    lastName: "Stylist",
    displayName: "Sarah's Beauty Studio",
    bio: "Expert hair stylist with 10+ years of experience specializing in color and cuts.",
    phone: "555-123-4567",
    address: "123 Beauty Lane",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    userId: "2",
    email: "mike.massage@example.com",
    firstName: "Mike",
    lastName: "Masseur",
    displayName: "Mike's Massage Therapy",
    bio: "Licensed massage therapist offering therapeutic and relaxation massages.",
    phone: "555-987-6543",
    address: "456 Wellness Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94110",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "3",
    userId: "3",
    email: "nina.nails@example.com",
    firstName: "Nina",
    lastName: "Nguyen",
    displayName: "Nina's Nail Studio",
    bio: "Nail artist specializing in creative designs and healthy nail care.",
    phone: "555-456-7890",
    address: "789 Fashion Blvd",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "4",
    userId: "4",
    email: "emma.skin@example.com",
    firstName: "Emma",
    lastName: "Johnson",
    displayName: "Emma's Skin Care Clinic",
    bio: "Certified esthetician specializing in facials and skincare treatments for all skin types.",
    phone: "+44-20-1234-5678",
    address: "15 Oxford Street",
    city: "London",
    state: "",
    zipCode: "W1D 1BS",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "5",
    userId: "5",
    email: "jean.makeup@example.com",
    firstName: "Jean",
    lastName: "Dupont",
    displayName: "Jean's Makeup Artistry",
    bio: "Professional makeup artist with experience in fashion, bridal, and special effects makeup.",
    phone: "+33-1-2345-6789",
    address: "24 Rue de Rivoli",
    city: "Paris",
    state: "",
    zipCode: "75004",
    avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "6",
    userId: "6",
    email: "yuki.wellness@example.com",
    firstName: "Yuki",
    lastName: "Tanaka",
    displayName: "Yuki's Wellness Center",
    bio: "Certified yoga instructor and meditation expert providing holistic wellness services.",
    phone: "+81-3-1234-5678",
    address: "5-2-1 Ginza",
    city: "Tokyo",
    state: "",
    zipCode: "104-0061",
    avatarUrl: "https://randomuser.me/api/portraits/men/41.jpg",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  }
];

// Enhanced Mock Services with global providers and all categories
export const services: (Service & { 
  category?: Category;
  name?: string;
  durationMinutes?: number;
  locationId?: string; 
  rating?: number;
})[] = [
  // Hair Care Services
  {
    id: "1",
    providerId: "1",
    title: "Women's Haircut & Style",
    name: "Women's Haircut & Style",
    description: "Complete haircut and styling service tailored to your preferences and face shape. Includes consultation, shampoo, conditioning, cut, and style.",
    price: 65,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "1",
    isPrivate: false,
    locationId: "1", // Los Angeles
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[0],
  },
  {
    id: "2",
    providerId: "1",
    title: "Full Color Service",
    name: "Full Color Service",
    description: "Professional hair coloring service. Includes consultation, application, processing time, shampoo, conditioning, and style.",
    price: 90,
    duration: 120,
    durationMinutes: 120,
    isActive: true,
    categoryId: "1",
    isPrivate: false,
    locationId: "1", // Los Angeles
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[0],
  },
  
  // Massage Services
  {
    id: "3",
    providerId: "2",
    title: "Swedish Massage",
    name: "Swedish Massage",
    description: "Relaxing full-body massage using long, flowing strokes to reduce tension, improve circulation and promote relaxation.",
    price: 85,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "3",
    isPrivate: false,
    locationId: "2", // San Francisco
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[2],
  },
  {
    id: "4",
    providerId: "2",
    title: "Deep Tissue Massage",
    name: "Deep Tissue Massage",
    description: "Therapeutic massage focusing on deeper layers of muscle tissue to release chronic tension and pain.",
    price: 95,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "3",
    isPrivate: false,
    locationId: "2", // San Francisco
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[2],
  },
  
  // Nail Care Services
  {
    id: "5",
    providerId: "3",
    title: "Classic Manicure",
    name: "Classic Manicure",
    description: "Basic nail care including cuticle treatment, nail shaping, hand massage, and polish application.",
    price: 35,
    duration: 30,
    durationMinutes: 30,
    isActive: true,
    categoryId: "4",
    isPrivate: false,
    locationId: "3", // New York
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[3],
  },
  {
    id: "6",
    providerId: "3",
    title: "Deluxe Pedicure",
    name: "Deluxe Pedicure",
    description: "Comprehensive foot care including soak, exfoliation, callus treatment, nail care, massage, and polish.",
    price: 55,
    duration: 45,
    durationMinutes: 45,
    isActive: true,
    categoryId: "4",
    isPrivate: false,
    locationId: "3", // New York
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[3],
  },
  
  // Skin Care Services
  {
    id: "7",
    providerId: "4",
    title: "Deep Cleansing Facial",
    name: "Deep Cleansing Facial",
    description: "Thorough facial treatment that cleans pores, exfoliates dead skin cells, and hydrates the skin for a refreshed appearance.",
    price: 75,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "2", // Skin Care
    isPrivate: false,
    locationId: "4", // London
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[1],
  },
  {
    id: "8",
    providerId: "4",
    title: "Anti-Aging Treatment",
    name: "Anti-Aging Treatment",
    description: "Specialized facial treatment targeting fine lines and wrinkles using high-quality serums and massage techniques.",
    price: 120,
    duration: 75,
    durationMinutes: 75,
    isActive: true,
    categoryId: "2", // Skin Care
    isPrivate: false,
    locationId: "4", // London
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[1],
  },
  
  // Makeup Services
  {
    id: "9",
    providerId: "5",
    title: "Special Occasion Makeup",
    name: "Special Occasion Makeup",
    description: "Professional makeup application for weddings, parties, and special events, customized to your preferences and outfit.",
    price: 85,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "5", // Makeup
    isPrivate: false,
    locationId: "5", // Paris
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1457972851104-4fd469440bf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[4],
  },
  {
    id: "10",
    providerId: "5",
    title: "Makeup Lesson",
    name: "Makeup Lesson",
    description: "One-on-one makeup tutorial teaching techniques customized to your face shape, skin type, and personal style.",
    price: 110,
    duration: 90,
    durationMinutes: 90,
    isActive: true,
    categoryId: "5", // Makeup
    isPrivate: false,
    locationId: "5", // Paris
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[4],
  },
  
  // Wellness Services
  {
    id: "11",
    providerId: "6",
    title: "Yoga Session",
    name: "Yoga Session",
    description: "Personalized yoga session adapted to your level and goals, focusing on flexibility, strength, and mindfulness.",
    price: 50,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "6", // Wellness
    isPrivate: false,
    locationId: "6", // Tokyo
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[5],
  },
  {
    id: "12",
    providerId: "6",
    title: "Guided Meditation",
    name: "Guided Meditation",
    description: "Relaxing meditation session with expert guidance to reduce stress and improve mental clarity and wellbeing.",
    price: 40,
    duration: 45,
    durationMinutes: 45,
    isActive: true,
    categoryId: "6", // Wellness
    isPrivate: false,
    locationId: "6", // Tokyo
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[5],
  }
];

// Mock Customer Profiles
export const customers: Profile[] = [
  {
    id: "7",
    userId: "7",
    email: "alice.customer@example.com",
    firstName: "Alice",
    lastName: "Anderson",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://randomuser.me/api/portraits/women/72.jpg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "8",
    userId: "8",
    email: "bob.customer@example.com",
    firstName: "Bob",
    lastName: "Brown",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
];

// Mock Bookings
export const bookings: (Booking & { service?: Service, provider?: Profile, customer?: Profile })[] = [
  {
    id: "1",
    customerId: "7",
    providerId: "1",
    serviceId: "1",
    startTime: new Date("2023-06-15T10:00:00"),
    endTime: new Date("2023-06-15T11:00:00"),
    status: BookingStatus.COMPLETED,
    price: 65,
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-15"),
    service: services[0],
    provider: providers[0],
    customer: customers[0],
  },
  {
    id: "2",
    customerId: "7",
    providerId: "2",
    serviceId: "3",
    startTime: new Date("2023-06-20T14:00:00"),
    endTime: new Date("2023-06-20T15:00:00"),
    status: BookingStatus.CONFIRMED,
    price: 85,
    createdAt: new Date("2023-06-12"),
    updatedAt: new Date("2023-06-12"),
    service: services[2],
    provider: providers[1],
    customer: customers[0],
  },
  {
    id: "3",
    customerId: "8",
    providerId: "3",
    serviceId: "5",
    startTime: new Date("2023-06-25T11:30:00"),
    endTime: new Date("2023-06-25T12:00:00"),
    status: BookingStatus.PENDING,
    price: 35,
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2023-06-20"),
    service: services[4],
    provider: providers[2],
    customer: customers[1],
  },
];

// Helper function to get service with provider and category
export function getServiceWithDetails(serviceId: string) {
  const service = services.find(s => s.id === serviceId);
  if (!service) return null;
  
  const provider = providers.find(p => p.id === service.providerId);
  return { ...service, provider };
}

// Helper function to get all providers with their services
export function getProvidersWithServices() {
  return providers.map(provider => {
    const providerServices = services.filter(service => service.providerId === provider.id);
    return { ...provider, services: providerServices };
  });
} 