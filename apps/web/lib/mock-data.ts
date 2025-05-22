import { Category, Service, Profile, UserRole, Booking, BookingStatus } from "@vibewell/types";

// Mock Locations - Updated to be global
export const locations = [
  {
    id: "1",
    name: "Los Angeles",
    state: "CA",
    country: "United States",
    description: "Discover beauty and wellness services in the entertainment capital of the world.",
    imageUrl: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "2",
    name: "San Francisco",
    state: "CA",
    country: "United States",
    description: "Experience premium wellness services in the Bay Area's innovation hub.",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "3",
    name: "New York",
    state: "NY",
    country: "United States",
    description: "Find top-tier beauty services in the city that never sleeps.",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  // UK locations with sub-regions
  {
    id: "4",
    name: "London",
    state: "England",
    country: "United Kingdom",
    description: "Enjoy world-class beauty treatments in the UK's cosmopolitan capital.",
    imageUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "41",
    name: "Manchester",
    state: "England",
    country: "United Kingdom",
    description: "Discover trendsetting beauty services in the heart of Northern England.",
    imageUrl: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "42",
    name: "Birmingham",
    state: "England",
    country: "United Kingdom",
    description: "Experience diverse wellness offerings in England's second city.",
    imageUrl: "https://images.unsplash.com/photo-1567496662086-408d6124fe64?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "43",
    name: "Edinburgh",
    state: "Scotland",
    country: "United Kingdom",
    description: "Indulge in traditional and modern wellness experiences in Scotland's historic capital.",
    imageUrl: "https://images.unsplash.com/photo-1581420515590-cee76de451b5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "44",
    name: "Glasgow",
    state: "Scotland",
    country: "United Kingdom",
    description: "Explore contemporary beauty services in Scotland's largest city.",
    imageUrl: "https://images.unsplash.com/photo-1625499940894-8796928b8e22?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "45",
    name: "Cardiff",
    state: "Wales",
    country: "United Kingdom",
    description: "Discover wellness retreats in the vibrant capital of Wales.",
    imageUrl: "https://images.unsplash.com/photo-1569674231059-468c88fc24b2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "46",
    name: "Belfast",
    state: "Northern Ireland",
    country: "United Kingdom",
    description: "Experience unique beauty treatments in Northern Ireland's capital.",
    imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "47",
    name: "Liverpool",
    state: "England",
    country: "United Kingdom",
    description: "Enjoy innovative wellness services in this vibrant maritime city.",
    imageUrl: "https://images.unsplash.com/photo-1580820574485-b28286bfdb5d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "48",
    name: "Leeds",
    state: "England",
    country: "United Kingdom",
    description: "Discover premium beauty experiences in Yorkshire's cosmopolitan hub.",
    imageUrl: "https://images.unsplash.com/photo-1593020052515-c6b327da2e8a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "5",
    name: "Paris",
    state: "",
    country: "France",
    description: "Indulge in luxury beauty treatments in the fashion capital of the world.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "6",
    name: "Tokyo",
    state: "",
    country: "Japan",
    description: "Experience cutting-edge beauty and wellness innovations in Japan's vibrant capital.",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "7",
    name: "Sydney",
    state: "NSW",
    country: "Australia",
    description: "Discover holistic wellness services in Australia's harbor city.",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "8",
    name: "Berlin",
    state: "",
    country: "Germany",
    description: "Explore innovative wellness approaches in Germany's creative capital.",
    imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  // Canadian locations
  {
    id: "9",
    name: "Toronto",
    state: "ON",
    country: "Canada",
    description: "Experience diverse beauty services in Canada's largest metropolis.",
    imageUrl: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "91",
    name: "Vancouver",
    state: "BC",
    country: "Canada",
    description: "Discover eco-friendly wellness practices in this Pacific coast city.",
    imageUrl: "https://images.unsplash.com/photo-1559511260-66a654ae982a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "92",
    name: "Montreal",
    state: "QC",
    country: "Canada",
    description: "Indulge in European-inspired beauty treatments in this bilingual cultural hub.",
    imageUrl: "https://images.unsplash.com/photo-1519178614-68673b201f36?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "93",
    name: "Calgary",
    state: "AB",
    country: "Canada",
    description: "Experience rejuvenating wellness services in the gateway to the Rockies.",
    imageUrl: "https://images.unsplash.com/photo-1576457412953-dff582c00977?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "94",
    name: "Ottawa",
    state: "ON",
    country: "Canada",
    description: "Enjoy sophisticated beauty services in Canada's capital city.",
    imageUrl: "https://images.unsplash.com/photo-1588733103629-b77afe0425ce?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "95",
    name: "Halifax",
    state: "NS",
    country: "Canada",
    description: "Discover coastal-inspired wellness treatments in this Atlantic maritime city.",
    imageUrl: "https://images.unsplash.com/photo-1628885363743-fbf9c203508a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "96",
    name: "Quebec City",
    state: "QC",
    country: "Canada",
    description: "Experience old-world charm and modern wellness in this historic French-Canadian city.",
    imageUrl: "https://images.unsplash.com/photo-1591294071573-bf2eacc83b84?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  // UAE locations
  {
    id: "10",
    name: "Dubai",
    state: "Dubai",
    country: "United Arab Emirates",
    description: "Indulge in luxury beauty and wellness experiences in this ultramodern city.",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "101",
    name: "Abu Dhabi",
    state: "Abu Dhabi",
    country: "United Arab Emirates",
    description: "Experience premium wellness services in the UAE's sophisticated capital.",
    imageUrl: "https://images.unsplash.com/photo-1511531114280-098e5b4098ef?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "102",
    name: "Sharjah",
    state: "Sharjah",
    country: "United Arab Emirates",
    description: "Discover cultural wellness traditions in the UAE's cultural capital.",
    imageUrl: "https://images.unsplash.com/photo-1534677956061-afe58ef2b5cb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "103",
    name: "Ajman",
    state: "Ajman",
    country: "United Arab Emirates",
    description: "Enjoy relaxing wellness retreats in this tranquil coastal emirate.",
    imageUrl: "https://images.unsplash.com/photo-1626588018114-5c7896f2f7d7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "104",
    name: "Ras Al Khaimah",
    state: "Ras Al Khaimah",
    country: "United Arab Emirates",
    description: "Experience nature-inspired treatments in this mountainous and coastal emirate.",
    imageUrl: "https://images.unsplash.com/photo-1605443791709-849be8595b0f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  // Jamaica locations
  {
    id: "11",
    name: "Kingston",
    state: "",
    country: "Jamaica",
    description: "Discover vibrant beauty traditions in Jamaica's capital city.",
    imageUrl: "https://images.unsplash.com/photo-1559059699-085698eba48b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "111",
    name: "Montego Bay",
    state: "",
    country: "Jamaica",
    description: "Experience luxury spa treatments in this popular coastal resort area.",
    imageUrl: "https://images.unsplash.com/photo-1550968327-cde1c20ae131?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "112",
    name: "Ocho Rios",
    state: "",
    country: "Jamaica",
    description: "Indulge in natural wellness experiences surrounded by waterfalls and beaches.",
    imageUrl: "https://images.unsplash.com/photo-1543851190-748ed4b0dc29?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "113",
    name: "Negril",
    state: "",
    country: "Jamaica",
    description: "Enjoy beachside beauty services on Jamaica's famous seven-mile beach.",
    imageUrl: "https://images.unsplash.com/photo-1526794135312-506ad6d8e043?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
  },
  {
    id: "114",
    name: "Port Antonio",
    state: "",
    country: "Jamaica",
    description: "Discover holistic wellness traditions in this authentic Jamaican coastal town.",
    imageUrl: "https://images.unsplash.com/photo-1533119408463-b0f487583ff6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
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
    avatarUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
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
    avatarUrl: "https://images.unsplash.com/photo-1567515004624-219c11d31f2e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
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
    avatarUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
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
    state: "England",
    zipCode: "W1D 1BS",
    avatarUrl: "https://images.unsplash.com/photo-1596875244376-312ec0a8af1d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
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
    avatarUrl: "https://images.unsplash.com/photo-1560087637-bf797bc7796a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
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
    avatarUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  // UK Providers
  {
    id: "7",
    userId: "9",
    email: "oliver.barber@example.com",
    firstName: "Oliver",
    lastName: "Smith",
    displayName: "Oliver's Classic Barbershop",
    bio: "Traditional barber offering premium cuts, hot towel shaves, and grooming services.",
    phone: "+44-161-123-4567",
    address: "25 Northern Quarter",
    city: "Manchester",
    state: "England",
    zipCode: "M4 1HW",
    avatarUrl: "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "8",
    userId: "10",
    email: "fiona.spa@example.com",
    firstName: "Fiona",
    lastName: "McGregor",
    displayName: "Highland Retreat Spa",
    bio: "Luxury spa therapist offering traditional Scottish wellness treatments and modern therapies.",
    phone: "+44-131-876-5432",
    address: "42 Royal Mile",
    city: "Edinburgh",
    state: "Scotland",
    zipCode: "EH1 1SR",
    avatarUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "9",
    userId: "11",
    email: "rhys.wellness@example.com",
    firstName: "Rhys",
    lastName: "Davies",
    displayName: "Cardiff Wellness Collective",
    bio: "Holistic wellness practitioner specializing in aromatherapy and natural remedies.",
    phone: "+44-29-2087-6543",
    address: "8 Castle Arcade",
    city: "Cardiff",
    state: "Wales",
    zipCode: "CF10 1BU",
    avatarUrl: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  // Canada Providers
  {
    id: "10",
    userId: "12",
    email: "sophie.beauty@example.com",
    firstName: "Sophie",
    lastName: "Tremblay",
    displayName: "Sophie's Beauty Boutique",
    bio: "Bilingual beauty expert offering personalized skincare and makeup services.",
    phone: "+1-514-987-6543",
    address: "123 Rue Saint-Paul",
    city: "Montreal",
    state: "QC",
    zipCode: "H2Y 1V1",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "11",
    userId: "13",
    email: "aiden.massage@example.com",
    firstName: "Aiden",
    lastName: "Thompson",
    displayName: "West Coast Wellness",
    bio: "Sports massage therapist specializing in injury recovery and performance enhancement.",
    phone: "+1-604-123-4567",
    address: "456 Granville Street",
    city: "Vancouver",
    state: "BC",
    zipCode: "V6C 1T2",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "12",
    userId: "14",
    email: "jasmine.hair@example.com",
    firstName: "Jasmine",
    lastName: "Singh",
    displayName: "Jasmine's Hair Artistry",
    bio: "Hair stylist specializing in multicultural hair types and creative coloring techniques.",
    phone: "+1-416-987-6543",
    address: "789 Queen Street West",
    city: "Toronto",
    state: "ON",
    zipCode: "M6J 1G3",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  // UAE Providers
  {
    id: "13",
    userId: "15",
    email: "amira.beauty@example.com",
    firstName: "Amira",
    lastName: "Al-Sayegh",
    displayName: "Amira's Luxury Beauty Lounge",
    bio: "Premium beauty expert offering exclusive treatments combining traditional and modern techniques.",
    phone: "+971-4-123-4567",
    address: "Palm Jumeirah, Villa 45",
    city: "Dubai",
    state: "Dubai",
    zipCode: "",
    avatarUrl: "https://images.unsplash.com/photo-1592621385612-4d7129426394?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "14",
    userId: "16",
    email: "hassan.wellness@example.com",
    firstName: "Hassan",
    lastName: "Al-Mansouri",
    displayName: "Desert Wellness Retreat",
    bio: "Holistic wellness practitioner blending ancient Arabian practices with contemporary therapies.",
    phone: "+971-2-987-6543",
    address: "Corniche Road, Tower A",
    city: "Abu Dhabi",
    state: "Abu Dhabi",
    zipCode: "",
    avatarUrl: "https://images.unsplash.com/photo-1548449112-96a38a643324?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  // Jamaica Providers
  {
    id: "15",
    userId: "17",
    email: "marcus.spa@example.com",
    firstName: "Marcus",
    lastName: "Campbell",
    displayName: "Island Breeze Spa",
    bio: "Spa therapist offering authentic Jamaican wellness treatments using local natural ingredients.",
    phone: "+1-876-123-4567",
    address: "Gloucester Avenue",
    city: "Montego Bay",
    state: "",
    zipCode: "",
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    role: UserRole.PROVIDER,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "16",
    userId: "18",
    email: "natalie.beauty@example.com",
    firstName: "Natalie",
    lastName: "Wilson",
    displayName: "Kingston Beauty Bar",
    bio: "Beauty specialist offering hair, nail, and makeup services inspired by Caribbean styles.",
    phone: "+1-876-987-6543",
    address: "85 Hope Road",
    city: "Kingston",
    state: "",
    zipCode: "",
    avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
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
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1457972851104-4fd469440bf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[5],
  },

  // UK Services
  {
    id: "13",
    providerId: "7",
    title: "Premium Men's Haircut & Beard Trim",
    name: "Premium Men's Haircut & Beard Trim",
    description: "Classic barbering service including precision haircut, beard shaping, hot towel treatment, and styling.",
    price: 45,
    duration: 45,
    durationMinutes: 45,
    isActive: true,
    categoryId: "1", // Hair Care
    isPrivate: false,
    locationId: "41", // Manchester
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[0],
  },
  {
    id: "14",
    providerId: "8",
    title: "Scottish Hot Stone Massage",
    name: "Scottish Hot Stone Massage",
    description: "Traditional massage therapy using heated basalt stones to relieve muscle tension and promote deep relaxation.",
    price: 90,
    duration: 75,
    durationMinutes: 75,
    isActive: true,
    categoryId: "3", // Massage
    isPrivate: false,
    locationId: "43", // Edinburgh
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[2],
  },
  {
    id: "15",
    providerId: "9",
    title: "Aromatherapy Treatment",
    name: "Aromatherapy Treatment",
    description: "Holistic wellness treatment using essential oils to balance mind, body and spirit through massage and inhalation.",
    price: 70,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "6", // Wellness
    isPrivate: false,
    locationId: "45", // Cardiff
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[5],
  },

  // Canada Services
  {
    id: "16",
    providerId: "10",
    title: "French-Inspired Facial",
    name: "French-Inspired Facial",
    description: "Luxurious facial treatment using French skincare techniques and premium products for a radiant complexion.",
    price: 95,
    duration: 75,
    durationMinutes: 75,
    isActive: true,
    categoryId: "2", // Skin Care
    isPrivate: false,
    locationId: "92", // Montreal
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[1],
  },
  {
    id: "17",
    providerId: "11",
    title: "Sports Recovery Massage",
    name: "Sports Recovery Massage",
    description: "Therapeutic massage targeting athletic recovery, injury prevention, and performance enhancement.",
    price: 100,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "3", // Massage
    isPrivate: false,
    locationId: "91", // Vancouver
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[2],
  },
  {
    id: "18",
    providerId: "12",
    title: "Creative Color & Highlights",
    name: "Creative Color & Highlights",
    description: "Customized hair coloring service featuring balayage, ombré, or traditional highlights with expert blending techniques.",
    price: 150,
    duration: 120,
    durationMinutes: 120,
    isActive: true,
    categoryId: "1", // Hair Care
    isPrivate: false,
    locationId: "9", // Toronto
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[0],
  },

  // UAE Services
  {
    id: "19",
    providerId: "13",
    title: "24K Gold Facial",
    name: "24K Gold Facial",
    description: "Luxurious facial featuring 24K gold-infused products to enhance skin elasticity, reduce fine lines, and create a radiant glow.",
    price: 220,
    duration: 90,
    durationMinutes: 90,
    isActive: true,
    categoryId: "2", // Skin Care
    isPrivate: false,
    locationId: "10", // Dubai
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1614108400523-8c1a79c3ab30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[1],
  },
  {
    id: "20",
    providerId: "14",
    title: "Arabian Desert Sand Therapy",
    name: "Arabian Desert Sand Therapy",
    description: "Traditional wellness treatment using heated desert sand to detoxify, exfoliate, and rejuvenate the body.",
    price: 180,
    duration: 90,
    durationMinutes: 90,
    isActive: true,
    categoryId: "6", // Wellness
    isPrivate: false,
    locationId: "101", // Abu Dhabi
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[5],
  },

  // Jamaica Services
  {
    id: "21",
    providerId: "15",
    title: "Caribbean Hot Stone Massage",
    name: "Caribbean Hot Stone Massage",
    description: "Relaxing massage using warm volcanic stones and aromatic Caribbean oils to release tension and promote wellbeing.",
    price: 110,
    duration: 75,
    durationMinutes: 75,
    isActive: true,
    categoryId: "3", // Massage
    isPrivate: false,
    locationId: "111", // Montego Bay
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[2],
  },
  {
    id: "22",
    providerId: "16",
    title: "Island Goddess Hair Treatment",
    name: "Island Goddess Hair Treatment",
    description: "Revitalizing hair treatment using local Jamaican ingredients like coconut oil and aloe vera for nourishment and shine.",
    price: 85,
    duration: 60,
    durationMinutes: 60,
    isActive: true,
    categoryId: "1", // Hair Care
    isPrivate: false,
    locationId: "11", // Kingston
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: categories[0],
  }
];

// Mock Customer Profiles
export const customers: Profile[] = [
  {
    id: "c1",
    userId: "c1",
    email: "alice.customer@example.com",
    firstName: "Alice",
    lastName: "Anderson",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "c2",
    userId: "c2",
    email: "bob.customer@example.com",
    firstName: "Bob",
    lastName: "Brown",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "c3",
    userId: "c3",
    email: "carlos.rodriguez@example.com",
    firstName: "Carlos",
    lastName: "Rodriguez",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "c4",
    userId: "c4",
    email: "diana.wong@example.com",
    firstName: "Diana",
    lastName: "Wong",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "c5",
    userId: "c5",
    email: "ethan.jackson@example.com",
    firstName: "Ethan",
    lastName: "Jackson",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "c6",
    userId: "c6",
    email: "fatima.ali@example.com",
    firstName: "Fatima",
    lastName: "Ali",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  }
];

// Mock Bookings
export const bookings: (Booking & { service?: Service, provider?: Profile, customer?: Profile })[] = [
  {
    id: "1",
    customerId: "c1",
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
    customerId: "c1",
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
    customerId: "c2",
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
  {
    id: "4",
    customerId: "c3",
    providerId: "4",
    serviceId: "7",
    startTime: new Date("2023-06-30T09:00:00"),
    endTime: new Date("2023-06-30T10:00:00"),
    status: BookingStatus.CONFIRMED,
    price: 75,
    createdAt: new Date("2023-06-25"),
    updatedAt: new Date("2023-06-25"),
    service: services[6],
    provider: providers[3],
    customer: customers[2],
  },
  {
    id: "5",
    customerId: "c4",
    providerId: "5",
    serviceId: "9",
    startTime: new Date("2023-07-05T15:00:00"),
    endTime: new Date("2023-07-05T16:00:00"),
    status: BookingStatus.CANCELLED,
    price: 85,
    createdAt: new Date("2023-06-28"),
    updatedAt: new Date("2023-07-01"),
    service: services[8],
    provider: providers[4],
    customer: customers[3],
  },
  {
    id: "6",
    customerId: "c5",
    providerId: "6",
    serviceId: "11",
    startTime: new Date("2023-07-10T10:30:00"),
    endTime: new Date("2023-07-10T11:30:00"),
    status: BookingStatus.CONFIRMED,
    price: 50,
    createdAt: new Date("2023-07-02"),
    updatedAt: new Date("2023-07-02"),
    service: services[10],
    provider: providers[5],
    customer: customers[4],
  },
  {
    id: "7",
    customerId: "c6",
    providerId: "7",
    serviceId: "1",
    startTime: new Date("2023-07-15T13:00:00"),
    endTime: new Date("2023-07-15T14:00:00"),
    status: BookingStatus.PENDING,
    price: 65,
    createdAt: new Date("2023-07-08"),
    updatedAt: new Date("2023-07-08"),
    service: services[0],
    provider: providers[6],
    customer: customers[5],
  }
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

// Mock Products
export const products = [
  {
    id: "p1",
    providerId: "1",
    name: "Premium Hair Shampoo",
    description: "Organic, sulfate-free shampoo for all hair types. Enriched with natural oils and extracts to nourish and strengthen hair.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 45,
    isActive: true,
    category: "Hair Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p2",
    providerId: "1",
    name: "Hydrating Conditioner",
    description: "Deep conditioning treatment that repairs damaged hair and prevents split ends. Leaves hair soft, manageable and shiny.",
    price: 22.99,
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 38,
    isActive: true,
    category: "Hair Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p3",
    providerId: "4",
    name: "Anti-Aging Serum",
    description: "Advanced formula with hyaluronic acid and vitamin C to reduce fine lines and improve skin elasticity. Suitable for all skin types.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1556228841-7db5ca2cd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 25,
    isActive: true,
    category: "Skin Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p4",
    providerId: "4",
    name: "Hydrating Face Mask",
    description: "Intensive hydrating treatment with aloe vera and cucumber extract. Refreshes and revitalizes tired skin in just 15 minutes.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1567721913486-6585f069b332?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 60,
    isActive: true,
    category: "Skin Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p5",
    providerId: "2",
    name: "Aromatherapy Massage Oil",
    description: "Blend of essential oils including lavender and eucalyptus to enhance relaxation during massage. 100% natural ingredients.",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1617952987489-a9c827940c1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 32,
    isActive: true,
    category: "Massage",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p6",
    providerId: "5",
    name: "Nail Strengthener",
    description: "Formula enriched with calcium and keratin to prevent nail breakage and peeling. Promotes healthy nail growth.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 48,
    isActive: true,
    category: "Nail Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p7",
    providerId: "3",
    name: "Professional Makeup Brush Set",
    description: "Set of 12 high-quality synthetic brushes for flawless makeup application. Includes face, eye, and lip brushes in a travel case.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 20,
    isActive: true,
    category: "Makeup",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p8",
    providerId: "6",
    name: "Meditation Candle",
    description: "Hand-poured soy candle with calming essential oils to enhance meditation and relaxation. Burns for approximately 45 hours.",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1608181831718-c820d37ae775?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 35,
    isActive: true,
    category: "Wellness",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p9",
    providerId: "13",
    name: "Luxury Gold-Infused Face Cream",
    description: "Premium anti-aging cream with 24K gold particles to reduce wrinkles and improve skin texture. Exclusive formula developed in Dubai.",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1570194065650-d99416341b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 15,
    isActive: true,
    category: "Skin Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p10",
    providerId: "10",
    name: "French Lavender Bath Bombs Set",
    description: "Set of 6 hand-crafted bath bombs with real lavender from Provence, France. Moisturizes skin while providing aromatherapy benefits.",
    price: 28.99,
    imageUrl: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 28,
    isActive: true,
    category: "Wellness",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p11",
    providerId: "12",
    name: "Hair Styling Tools Kit",
    description: "Professional-grade styling kit with ceramic flat iron, curling wand, and blow dryer. Includes heat protectant spray and styling clips.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 12,
    isActive: true,
    category: "Hair Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p12",
    providerId: "7",
    name: "Beard Grooming Kit",
    description: "Complete beard care set including oil, balm, scissors, comb, and brush. Perfect for maintaining a well-groomed beard.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 22,
    isActive: true,
    category: "Hair Care",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "p13",
    providerId: "3",
    name: "Natural Mineral Foundation",
    description: "Lightweight, buildable coverage foundation made with pure minerals. Provides a natural, radiant finish while allowing skin to breathe.",
    price: 32.99,
    imageUrl: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 40,
    isActive: true,
    category: "Makeup",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
  },
  {
    id: "p14",
    providerId: "5",
    name: "Gel Nail Polish Collection",
    description: "Set of 6 long-lasting gel nail polishes in trendy colors. No UV lamp required, chip-resistant for up to 10 days.",
    price: 45.99,
    imageUrl: "https://images.unsplash.com/photo-1625795184296-7bf0332b0a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 30,
    isActive: true,
    category: "Nail Care",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  },
  {
    id: "p15",
    providerId: "4",
    name: "Vitamin C Brightening Toner",
    description: "Alcohol-free toner with vitamin C and niacinamide to brighten complexion and reduce dark spots. Refreshes and balances skin pH.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 55,
    isActive: true,
    category: "Skin Care",
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-04-05"),
  },
  {
    id: "p16",
    providerId: "8",
    name: "Acupressure Mat and Pillow Set",
    description: "Therapeutic mat with thousands of acupressure points to relieve muscle tension, improve circulation, and promote relaxation.",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 18,
    isActive: true,
    category: "Wellness",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-03-20"),
  },
  {
    id: "p17",
    providerId: "6",
    name: "Essential Oil Diffuser",
    description: "Ultrasonic aromatherapy diffuser with LED mood lighting. Whisper-quiet operation for bedroom, office, or yoga studio use.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 25,
    isActive: true,
    category: "Aromatherapy",
    createdAt: new Date("2023-02-28"),
    updatedAt: new Date("2023-02-28"),
  },
  {
    id: "p18",
    providerId: "9",
    name: "Natural Body Scrub",
    description: "Exfoliating scrub with coffee grounds, brown sugar, and coconut oil. Removes dead skin cells and improves circulation.",
    price: 21.99,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 42,
    isActive: true,
    category: "Body Care",
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
  },
  {
    id: "p19",
    providerId: "10",
    name: "Organic Lip Balm Set",
    description: "Set of 4 nourishing lip balms made with organic beeswax, shea butter, and essential oils. Hydrates and protects lips from drying.",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1625265403656-29bea2746811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 65,
    isActive: true,
    category: "Lip Care",
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    id: "p20",
    providerId: "1",
    name: "Heat Protection Spray",
    description: "Lightweight spray that shields hair from heat damage up to 450°F. Infused with argan oil and keratin for added nourishment.",
    price: 17.99,
    imageUrl: "https://images.unsplash.com/photo-1626452229831-d2346f404edb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 38,
    isActive: true,
    category: "Hair Care",
    createdAt: new Date("2023-03-25"),
    updatedAt: new Date("2023-03-25"),
  },
  {
    id: "p21",
    providerId: "7",
    name: "Eco-Friendly Bamboo Toothbrush Set",
    description: "Pack of 4 biodegradable bamboo toothbrushes with charcoal-infused bristles for natural teeth whitening.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 50,
    isActive: true,
    category: "Oral Care",
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "p22",
    providerId: "3",
    name: "Waterproof Mascara",
    description: "Long-lasting, smudge-proof mascara that adds volume and length. Withstands water, sweat, and humidity without flaking.",
    price: 23.99,
    imageUrl: "https://images.unsplash.com/photo-1631214499031-de3e63af8612?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 45,
    isActive: true,
    category: "Makeup",
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20"),
  },
  {
    id: "p23",
    providerId: "11",
    name: "Rose Water Facial Spray",
    description: "Pure rose water mist that hydrates, soothes, and refreshes skin. Perfect for setting makeup or midday skin refreshment.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1586105449897-20b5384be24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 60,
    isActive: true,
    category: "Skin Care",
    createdAt: new Date("2023-04-25"),
    updatedAt: new Date("2023-04-25"),
  },
  {
    id: "p24",
    providerId: "2",
    name: "Hot Stone Massage Set",
    description: "Professional-grade basalt hot stones with varying sizes for therapeutic massage. Includes storage and heating instructions.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1618939291225-8bf475ed86cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    inventory: 15,
    isActive: true,
    category: "Massage",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
  }
];

// Mock Cart Items (for use in the e-commerce feature)
export const cartItems = [
  {
    id: "ci1",
    customerId: "c1", // Alice
    productId: "p1",
    quantity: 1,
    addedAt: new Date("2023-07-15")
  },
  {
    id: "ci2",
    customerId: "c1", // Alice
    productId: "p3",
    quantity: 2,
    addedAt: new Date("2023-07-15")
  }
];

// Mock Orders
export const orders = [
  {
    id: "o1",
    customerId: "c1", // Alice
    status: "DELIVERED",
    total: 107.97,
    items: [
      { productId: "p1", quantity: 1, price: 24.99 },
      { productId: "p2", quantity: 1, price: 22.99 },
      { productId: "p5", quantity: 1, price: 59.99 }
    ],
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-15")
  },
  {
    id: "o2",
    customerId: "c2", // Bob
    status: "SHIPPED",
    total: 39.98,
    items: [
      { productId: "p6", quantity: 1, price: 14.99 },
      { productId: "p8", quantity: 1, price: 16.99 },
      { productId: "p4", quantity: 1, price: 8.00 }
    ],
    createdAt: new Date("2023-07-05"),
    updatedAt: new Date("2023-07-07")
  },
  {
    id: "o3",
    customerId: "c3", // Carlos
    status: "PENDING",
    total: 179.97,
    items: [
      { productId: "p9", quantity: 1, price: 149.99 },
      { productId: "p10", quantity: 1, price: 29.98 }
    ],
    createdAt: new Date("2023-07-14"),
    updatedAt: new Date("2023-07-14")
  }
];

// Mock Loyalty Points
export const loyaltyPoints = [
  {
    id: "lp1",
    profileId: "c1", // Alice
    points: 250,
    tier: "SILVER",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-07-10")
  },
  {
    id: "lp2",
    profileId: "c2", // Bob
    points: 100,
    tier: "BRONZE",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-07-05")
  },
  {
    id: "lp3",
    profileId: "c3", // Carlos
    points: 75,
    tier: "BRONZE",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-06-30")
  },
  {
    id: "lp4",
    profileId: "c4", // Diana
    points: 480,
    tier: "GOLD",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-07-12")
  }
]; 

// Mock Courses
export const courses = [
  {
    id: "c1",
    providerId: "1",
    title: "Advanced Hair Styling Techniques",
    description: "Master professional hair styling techniques used by industry experts. Learn everything from basic blowouts to advanced updos and special occasion styles.",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 12,
    totalLessons: 8,
    category: "Hair Care",
    level: "Advanced",
    isActive: true,
    enrolledCount: 87,
    rating: 4.8,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "c2",
    providerId: "4",
    title: "Skin Care Fundamentals",
    description: "Learn the science behind effective skin care routines. This comprehensive course covers skin types, common concerns, and how to build a personalized regimen for yourself or clients.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 10,
    totalLessons: 12,
    category: "Skin Care",
    level: "Beginner",
    isActive: true,
    enrolledCount: 215,
    rating: 4.9,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-07-05"),
  },
  {
    id: "c3",
    providerId: "2",
    title: "Therapeutic Massage Masterclass",
    description: "Learn advanced massage techniques to provide deep relaxation and healing. This course covers Swedish massage, deep tissue massage, and trigger point therapy.",
    price: 180,
    imageUrl: "https://images.unsplash.com/photo-1576457412953-dff582c00977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 15,
    totalLessons: 10,
    category: "Massage",
    level: "Intermediate",
    isActive: true,
    enrolledCount: 150,
    rating: 4.7,
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-06-25"),
  },
  {
    id: "c4",
    providerId: "3",
    title: "Professional Nail Art Techniques",
    description: "Master the art of creating stunning nail designs. Learn everything from basic manicure techniques to advanced nail art, 3D designs, and the latest trends.",
    price: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 8,
    totalLessons: 10,
    category: "Nail Care",
    level: "All Levels",
    isActive: true,
    enrolledCount: 128,
    rating: 4.6,
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-07-15"),
  },
  {
    id: "c5",
    providerId: "5",
    title: "Makeup Artistry Essentials",
    description: "Transform your makeup skills with this comprehensive course. Learn professional techniques for different occasions, from everyday looks to bridal and editorial makeup.",
    price: 139.99,
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 14,
    totalLessons: 15,
    category: "Makeup",
    level: "Intermediate",
    isActive: true,
    enrolledCount: 176,
    rating: 4.8,
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-07-10"),
  },
  {
    id: "c6",
    providerId: "6",
    title: "Mindfulness and Meditation Fundamentals",
    description: "Develop a sustainable meditation practice for stress reduction and wellbeing. This course provides techniques for mindfulness, breathing, and incorporating meditation into daily life.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 8,
    totalLessons: 12,
    category: "Wellness",
    level: "Beginner",
    isActive: true,
    enrolledCount: 210,
    rating: 4.9,
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "c7",
    providerId: "9",
    title: "Natural Ayurvedic Beauty Treatments",
    description: "Learn the ancient art of Ayurvedic beauty treatments using natural ingredients. This course covers traditional recipes and techniques for holistic skin, hair, and body care.",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1601973089982-44d578b475e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 10,
    totalLessons: 8,
    category: "Skin Care",
    level: "Intermediate",
    isActive: true,
    enrolledCount: 95,
    rating: 4.7,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-07-02"),
  },
  {
    id: "c8",
    providerId: "13",
    title: "Luxury Spa Treatments Masterclass",
    description: "Bring the luxury spa experience into your home or business. Learn professional spa techniques for relaxation, rejuvenation, and wellness using high-quality ingredients.",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1614108400523-8c1a79c3ab30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 16,
    totalLessons: 12,
    category: "Wellness",
    level: "Advanced",
    isActive: true,
    enrolledCount: 75,
    rating: 4.9,
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-07-20"),
  },
  {
    id: "c9",
    providerId: "15",
    title: "Caribbean-Inspired Wellness Practices",
    description: "Explore traditional Caribbean wellness methods and incorporate them into modern treatments. Learn about natural ingredients, healing techniques, and holistic approaches.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 9,
    totalLessons: 8,
    category: "Wellness",
    level: "All Levels",
    isActive: true,
    enrolledCount: 68,
    rating: 4.8,
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-07-05"),
  },
  {
    id: "c10",
    providerId: "11",
    title: "Modern Color Theory for Hair Stylists",
    description: "Master the science and art of hair coloring. This course covers color theory, formulation, techniques for balayage, ombré, and color correction for professional hair stylists.",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    durationHours: 15,
    totalLessons: 14,
    category: "Hair Care",
    level: "Advanced",
    isActive: true,
    enrolledCount: 112,
    rating: 4.7,
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-06-30"),
  }
];

// Mock Lessons
export const lessons = [
  // Course 1: Advanced Hair Styling Techniques
  {
    id: "l1-1",
    courseId: "c1",
    title: "Introduction to Professional Hair Styling",
    description: "Learn the fundamentals of professional hair styling and the tools you'll need to succeed.",
    durationMinutes: 45,
    videoUrl: "https://example.com/videos/hair-styling-intro",
    order: 1,
    resources: [
      { name: "Tools Checklist", url: "https://example.com/resources/tools-checklist.pdf" },
      { name: "Getting Started Guide", url: "https://example.com/resources/getting-started.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "l1-2",
    courseId: "c1",
    title: "Basic Blowout Techniques",
    description: "Master the art of the perfect blowout for different hair types and lengths.",
    durationMinutes: 60,
    videoUrl: "https://example.com/videos/basic-blowout",
    order: 2,
    resources: [
      { name: "Blowout Quick Reference", url: "https://example.com/resources/blowout-reference.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "l1-3",
    courseId: "c1",
    title: "Curling and Waving Methods",
    description: "Learn different techniques for creating beautiful curls and waves with various tools.",
    durationMinutes: 75,
    videoUrl: "https://example.com/videos/curling-waving",
    order: 3,
    resources: [
      { name: "Curl Patterns Guide", url: "https://example.com/resources/curl-patterns.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "l1-4",
    courseId: "c1",
    title: "Straightening and Smoothing",
    description: "Discover techniques for safely straightening and smoothing various hair textures.",
    durationMinutes: 65,
    videoUrl: "https://example.com/videos/straightening",
    order: 4,
    resources: [
      { name: "Heat Protection Guide", url: "https://example.com/resources/heat-protection.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "l1-5",
    courseId: "c1",
    title: "Updos for Special Occasions",
    description: "Create stunning updos for weddings, proms, and other special events.",
    durationMinutes: 90,
    videoUrl: "https://example.com/videos/special-updos",
    order: 5,
    resources: [
      { name: "Updo Inspirations", url: "https://example.com/resources/updo-inspiration.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "l1-6",
    courseId: "c1",
    title: "Braiding Advanced Techniques",
    description: "Master complex braiding patterns and styles for a variety of hair types.",
    durationMinutes: 85,
    videoUrl: "https://example.com/videos/advanced-braiding",
    order: 6,
    resources: [
      { name: "Braid Pattern Guide", url: "https://example.com/resources/braid-patterns.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "l1-7",
    courseId: "c1",
    title: "Men's Styling Fundamentals",
    description: "Learn techniques specific to men's hair styling and current trends.",
    durationMinutes: 55,
    videoUrl: "https://example.com/videos/mens-styling",
    order: 7,
    resources: [
      { name: "Men's Style Guide", url: "https://example.com/resources/mens-styles.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "l1-8",
    courseId: "c1",
    title: "Building Your Styling Portfolio",
    description: "Learn how to document your work and create a professional portfolio to attract clients.",
    durationMinutes: 50,
    videoUrl: "https://example.com/videos/styling-portfolio",
    order: 8,
    resources: [
      { name: "Portfolio Template", url: "https://example.com/resources/portfolio-template.pdf" },
      { name: "Photography Tips", url: "https://example.com/resources/photography-tips.pdf" }
    ],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  
  // Course 2: Skin Care Fundamentals
  {
    id: "l2-1",
    courseId: "c2",
    title: "Understanding Skin Types",
    description: "Learn to identify different skin types and their unique characteristics and needs.",
    durationMinutes: 40,
    videoUrl: "https://example.com/videos/skin-types",
    order: 1,
    resources: [
      { name: "Skin Type Assessment Guide", url: "https://example.com/resources/skin-assessment.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-2",
    courseId: "c2",
    title: "The Science of Skin",
    description: "Explore the biology and anatomy of skin to better understand how skincare products work.",
    durationMinutes: 55,
    videoUrl: "https://example.com/videos/skin-science",
    order: 2,
    resources: [
      { name: "Skin Anatomy Diagram", url: "https://example.com/resources/skin-anatomy.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-3",
    courseId: "c2",
    title: "Common Skin Concerns",
    description: "Identify and understand common skin issues including acne, hyperpigmentation, and aging.",
    durationMinutes: 65,
    videoUrl: "https://example.com/videos/skin-concerns",
    order: 3,
    resources: [
      { name: "Skin Concerns Reference", url: "https://example.com/resources/skin-concerns.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-4",
    courseId: "c2",
    title: "Cleansing Fundamentals",
    description: "Learn proper cleansing techniques and how to select the right cleanser for different skin types.",
    durationMinutes: 45,
    videoUrl: "https://example.com/videos/cleansing",
    order: 4,
    resources: [
      { name: "Cleanser Ingredients Guide", url: "https://example.com/resources/cleanser-ingredients.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-5",
    courseId: "c2",
    title: "Exfoliation Methods",
    description: "Understand different exfoliation approaches and their benefits for various skin conditions.",
    durationMinutes: 50,
    videoUrl: "https://example.com/videos/exfoliation",
    order: 5,
    resources: [
      { name: "Exfoliation Safety Guide", url: "https://example.com/resources/exfoliation-safety.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-6",
    courseId: "c2",
    title: "Serums and Treatments",
    description: "Explore active ingredients in serums and how to layer products effectively.",
    durationMinutes: 60,
    videoUrl: "https://example.com/videos/serums",
    order: 6,
    resources: [
      { name: "Active Ingredients Chart", url: "https://example.com/resources/active-ingredients.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-7",
    courseId: "c2",
    title: "Moisturizers and Hydration",
    description: "Learn the importance of hydration and how to select the right moisturizer.",
    durationMinutes: 45,
    videoUrl: "https://example.com/videos/moisturizers",
    order: 7,
    resources: [
      { name: "Hydration Guide", url: "https://example.com/resources/hydration.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-8",
    courseId: "c2",
    title: "Sun Protection Essentials",
    description: "Understand the importance of sun protection and how to incorporate it into skincare routines.",
    durationMinutes: 55,
    videoUrl: "https://example.com/videos/sun-protection",
    order: 8,
    resources: [
      { name: "SPF Guide", url: "https://example.com/resources/spf-guide.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-9",
    courseId: "c2",
    title: "Evening Skincare Routines",
    description: "Design effective evening routines that focus on repair and rejuvenation.",
    durationMinutes: 50,
    videoUrl: "https://example.com/videos/evening-routines",
    order: 9,
    resources: [
      { name: "Evening Routine Templates", url: "https://example.com/resources/evening-routines.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-10",
    courseId: "c2",
    title: "Skin Analysis Techniques",
    description: "Learn professional methods for analyzing skin and identifying client needs.",
    durationMinutes: 70,
    videoUrl: "https://example.com/videos/skin-analysis",
    order: 10,
    resources: [
      { name: "Analysis Form Template", url: "https://example.com/resources/analysis-form.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-11",
    courseId: "c2",
    title: "Creating Custom Regimens",
    description: "Design personalized skincare routines for different client needs and concerns.",
    durationMinutes: 65,
    videoUrl: "https://example.com/videos/custom-regimens",
    order: 11,
    resources: [
      { name: "Regimen Planning Worksheet", url: "https://example.com/resources/regimen-planning.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "l2-12",
    courseId: "c2",
    title: "Building Your Skincare Business",
    description: "Learn practical tips for starting and growing your skincare practice or business.",
    durationMinutes: 75,
    videoUrl: "https://example.com/videos/skincare-business",
    order: 12,
    resources: [
      { name: "Business Plan Template", url: "https://example.com/resources/business-plan.pdf" },
      { name: "Marketing Guide", url: "https://example.com/resources/marketing-guide.pdf" }
    ],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  
  // Course 3: Therapeutic Massage Masterclass
  {
    id: "l3-1",
    courseId: "c3",
    title: "Foundations of Therapeutic Massage",
    description: "Learn the basic principles and benefits of therapeutic massage.",
    durationMinutes: 60,
    videoUrl: "https://example.com/videos/massage-foundations",
    order: 1,
    resources: [
      { name: "Massage Benefits Guide", url: "https://example.com/resources/massage-benefits.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-2",
    courseId: "c3",
    title: "Massage Anatomy and Physiology",
    description: "Understand the muscular and skeletal systems as they relate to massage therapy.",
    durationMinutes: 85,
    videoUrl: "https://example.com/videos/massage-anatomy",
    order: 2,
    resources: [
      { name: "Muscle Reference Chart", url: "https://example.com/resources/muscle-chart.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-3",
    courseId: "c3",
    title: "Swedish Massage Techniques",
    description: "Master the five basic strokes of Swedish massage and their applications.",
    durationMinutes: 90,
    videoUrl: "https://example.com/videos/swedish-massage",
    order: 3,
    resources: [
      { name: "Swedish Stroke Guide", url: "https://example.com/resources/swedish-strokes.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-4",
    courseId: "c3",
    title: "Deep Tissue Approaches",
    description: "Learn effective techniques for addressing deeper muscle layers and chronic tension.",
    durationMinutes: 95,
    videoUrl: "https://example.com/videos/deep-tissue",
    order: 4,
    resources: [
      { name: "Pressure Application Guide", url: "https://example.com/resources/pressure-guide.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-5",
    courseId: "c3",
    title: "Trigger Point Therapy",
    description: "Identify and treat common trigger points to relieve pain and improve mobility.",
    durationMinutes: 80,
    videoUrl: "https://example.com/videos/trigger-points",
    order: 5,
    resources: [
      { name: "Trigger Point Map", url: "https://example.com/resources/trigger-points.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-6",
    courseId: "c3",
    title: "Myofascial Release Techniques",
    description: "Understand fascial anatomy and techniques for releasing restrictions.",
    durationMinutes: 75,
    videoUrl: "https://example.com/videos/myofascial",
    order: 6,
    resources: [
      { name: "Fascial System Overview", url: "https://example.com/resources/fascial-system.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-7",
    courseId: "c3",
    title: "Sports Massage Applications",
    description: "Learn pre-event, post-event, and maintenance techniques for athletes.",
    durationMinutes: 85,
    videoUrl: "https://example.com/videos/sports-massage",
    order: 7,
    resources: [
      { name: "Sports Massage Protocol", url: "https://example.com/resources/sports-protocol.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-8",
    courseId: "c3",
    title: "Aromatherapy Integration",
    description: "Incorporate essential oils safely and effectively into massage sessions.",
    durationMinutes: 65,
    videoUrl: "https://example.com/videos/aromatherapy-massage",
    order: 8,
    resources: [
      { name: "Essential Oil Guide", url: "https://example.com/resources/essential-oils.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-9",
    courseId: "c3",
    title: "Client Assessment and Treatment Planning",
    description: "Develop skills for client interviews, assessments, and creating treatment plans.",
    durationMinutes: 70,
    videoUrl: "https://example.com/videos/treatment-planning",
    order: 9,
    resources: [
      { name: "Assessment Form Template", url: "https://example.com/resources/assessment-form.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "l3-10",
    courseId: "c3",
    title: "Professional Practice and Ethics",
    description: "Understand ethical considerations, boundaries, and best practices for massage therapists.",
    durationMinutes: 55,
    videoUrl: "https://example.com/videos/massage-ethics",
    order: 10,
    resources: [
      { name: "Ethics Guide", url: "https://example.com/resources/ethics.pdf" },
      { name: "Business Standards", url: "https://example.com/resources/business-standards.pdf" }
    ],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  
  // Course 4: Professional Nail Art Techniques
  {
    id: "l4-1",
    courseId: "c4",
    title: "Nail Art Fundamentals",
    description: "Introduction to essential nail art tools, techniques, and preparation methods.",
    durationMinutes: 40,
    videoUrl: "https://example.com/videos/nail-art-intro",
    order: 1,
    resources: [
      { name: "Essential Tools Guide", url: "https://example.com/resources/nail-tools.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-2",
    courseId: "c4",
    title: "Perfect Manicure Basics",
    description: "Learn proper nail preparation, shaping, and basic manicure techniques.",
    durationMinutes: 55,
    videoUrl: "https://example.com/videos/manicure-basics",
    order: 2,
    resources: [
      { name: "Nail Shapes Guide", url: "https://example.com/resources/nail-shapes.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-3",
    courseId: "c4",
    title: "Color Theory for Nail Artists",
    description: "Understanding color combinations, palettes, and trends for stunning nail designs.",
    durationMinutes: 45,
    videoUrl: "https://example.com/videos/nail-color-theory",
    order: 3,
    resources: [
      { name: "Color Wheel Reference", url: "https://example.com/resources/color-wheel.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-4",
    courseId: "c4",
    title: "Freehand Nail Art Techniques",
    description: "Master basic freehand nail art using brushes and dotting tools.",
    durationMinutes: 60,
    videoUrl: "https://example.com/videos/freehand-nail-art",
    order: 4,
    resources: [
      { name: "Brush Techniques Guide", url: "https://example.com/resources/brush-techniques.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-5",
    courseId: "c4",
    title: "Stamping and Transfer Techniques",
    description: "Learn how to use stamping plates and nail transfers for precise designs.",
    durationMinutes: 50,
    videoUrl: "https://example.com/videos/nail-stamping",
    order: 5,
    resources: [
      { name: "Stamping Troubleshooting", url: "https://example.com/resources/stamping-tips.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-6",
    courseId: "c4",
    title: "3D Nail Art and Embellishments",
    description: "Create dimensional nail art using acrylics, gels, and various embellishments.",
    durationMinutes: 65,
    videoUrl: "https://example.com/videos/3d-nail-art",
    order: 6,
    resources: [
      { name: "Embellishment Placement Guide", url: "https://example.com/resources/embellishments.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-7",
    courseId: "c4",
    title: "Gel and Acrylic Extensions",
    description: "Learn techniques for creating and decorating nail extensions.",
    durationMinutes: 75,
    videoUrl: "https://example.com/videos/nail-extensions",
    order: 7,
    resources: [
      { name: "Extension Safety Guide", url: "https://example.com/resources/extension-safety.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-8",
    courseId: "c4",
    title: "Trendy Nail Art Designs",
    description: "Master current nail art trends including geometric patterns, marble effects, and more.",
    durationMinutes: 70,
    videoUrl: "https://example.com/videos/trendy-nail-art",
    order: 8,
    resources: [
      { name: "Trends Lookbook", url: "https://example.com/resources/nail-trends.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-9",
    courseId: "c4",
    title: "Seasonal and Holiday Designs",
    description: "Create themed nail art for seasons, holidays, and special occasions.",
    durationMinutes: 60,
    videoUrl: "https://example.com/videos/seasonal-nail-art",
    order: 9,
    resources: [
      { name: "Holiday Design Templates", url: "https://example.com/resources/holiday-designs.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "l4-10",
    courseId: "c4",
    title: "Building Your Nail Business",
    description: "Learn how to market your nail art skills, build a portfolio, and grow your client base.",
    durationMinutes: 55,
    videoUrl: "https://example.com/videos/nail-business",
    order: 10,
    resources: [
      { name: "Portfolio Template", url: "https://example.com/resources/nail-portfolio.pdf" },
      { name: "Pricing Guide", url: "https://example.com/resources/nail-pricing.pdf" }
    ],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
  },
  
  // Course 5: Makeup Artistry Essentials (first 5 lessons)
  {
    id: "l5-1",
    courseId: "c5",
    title: "Makeup Kit Essentials",
    description: "Learn about the essential tools and products every makeup artist needs.",
    durationMinutes: 50,
    videoUrl: "https://example.com/videos/makeup-kit",
    order: 1,
    resources: [
      { name: "Starter Kit Checklist", url: "https://example.com/resources/makeup-checklist.pdf" }
    ],
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-02-25"),
  },
  {
    id: "l5-2",
    courseId: "c5",
    title: "Skin Preparation and Primer Application",
    description: "Master the techniques for preparing skin and creating the perfect base for makeup.",
    durationMinutes: 45,
    videoUrl: "https://example.com/videos/skin-prep",
    order: 2,
    resources: [
      { name: "Skin Prep Guide", url: "https://example.com/resources/skin-prep.pdf" }
    ],
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-02-25"),
  },
  {
    id: "l5-3",
    courseId: "c5",
    title: "Foundation and Concealer Techniques",
    description: "Learn how to match and apply foundation and concealer for flawless coverage.",
    durationMinutes: 60,
    videoUrl: "https://example.com/videos/foundation-techniques",
    order: 3,
    resources: [
      { name: "Shade Matching Guide", url: "https://example.com/resources/shade-matching.pdf" }
    ],
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-02-25"),
  },
  {
    id: "l5-4",
    courseId: "c5",
    title: "Contouring and Highlighting",
    description: "Master the art of facial sculpting through contouring and highlighting.",
    durationMinutes: 65,
    videoUrl: "https://example.com/videos/contour-highlight",
    order: 4,
    resources: [
      { name: "Face Shape Guide", url: "https://example.com/resources/face-shapes.pdf" }
    ],
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-02-25"),
  },
  {
    id: "l5-5",
    courseId: "c5",
    title: "Eyebrow Shaping and Filling",
    description: "Learn techniques for shaping, filling, and defining perfect eyebrows.",
    durationMinutes: 55,
    videoUrl: "https://example.com/videos/eyebrow-techniques",
    order: 5,
    resources: [
      { name: "Brow Mapping Template", url: "https://example.com/resources/brow-mapping.pdf" }
    ],
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-02-25"),
  },
  
  // Course 6: Mindfulness and Meditation Fundamentals (first 5 lessons)
  {
    id: "l6-1",
    courseId: "c6",
    title: "Introduction to Mindfulness",
    description: "Understand the principles of mindfulness and its benefits for wellness.",
    durationMinutes: 40,
    videoUrl: "https://example.com/videos/mindfulness-intro",
    order: 1,
    resources: [
      { name: "Mindfulness Benefits Guide", url: "https://example.com/resources/mindfulness-benefits.pdf" }
    ],
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "l6-2",
    courseId: "c6",
    title: "Breath Awareness Meditation",
    description: "Learn fundamental breathing techniques for meditation and stress reduction.",
    durationMinutes: 45,
    videoUrl: "https://example.com/videos/breath-awareness",
    order: 2,
    resources: [
      { name: "Breathing Techniques Guide", url: "https://example.com/resources/breathing-techniques.pdf" }
    ],
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "l6-3",
    courseId: "c6",
    title: "Body Scan Meditation",
    description: "Practice the body scan technique for relaxation and body awareness.",
    durationMinutes: 50,
    videoUrl: "https://example.com/videos/body-scan",
    order: 3,
    resources: [
      { name: "Body Scan Script", url: "https://example.com/resources/body-scan-script.pdf" }
    ],
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "l6-4",
    courseId: "c6",
    title: "Walking Meditation",
    description: "Learn how to practice mindfulness while walking for an active meditation practice.",
    durationMinutes: 35,
    videoUrl: "https://example.com/videos/walking-meditation",
    order: 4,
    resources: [
      { name: "Walking Meditation Guide", url: "https://example.com/resources/walking-meditation.pdf" }
    ],
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "l6-5",
    courseId: "c6",
    title: "Loving-Kindness Meditation",
    description: "Practice the loving-kindness meditation to cultivate compassion and positive emotions.",
    durationMinutes: 45,
    videoUrl: "https://example.com/videos/loving-kindness",
    order: 5,
    resources: [
      { name: "Loving-Kindness Script", url: "https://example.com/resources/loving-kindness.pdf" }
    ],
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  }
];

// Mock Course Enrollments
export const courseEnrollments = [
  {
    id: "e1",
    userId: "c1", // Alice
    courseId: "c1", // Advanced Hair Styling Techniques
    enrolledAt: new Date("2023-05-15"),
    completedLessons: ["l1-1", "l1-2", "l1-3"], // First three lessons completed
    currentLessonId: "l1-4", // Currently on lesson 4
    progress: 37.5, // 3/8 lessons = 37.5%
    lastAccessedAt: new Date("2023-07-10"),
  },
  {
    id: "e2",
    userId: "c1", // Alice
    courseId: "c2", // Skin Care Fundamentals
    enrolledAt: new Date("2023-06-20"),
    completedLessons: ["l2-1", "l2-2"], // First two lessons completed
    currentLessonId: "l2-3", // Currently on lesson 3
    progress: 16.7, // 2/12 lessons = ~16.7%
    lastAccessedAt: new Date("2023-07-12"),
  },
  {
    id: "e3",
    userId: "c2", // Bob
    courseId: "c3", // Therapeutic Massage Masterclass
    enrolledAt: new Date("2023-04-10"),
    completedLessons: ["l3-1", "l3-2", "l3-3", "l3-4", "l3-5", "l3-6"], // Six lessons completed
    currentLessonId: "l3-7", // Currently on lesson 7
    progress: 60, // 6/10 lessons = 60%
    lastAccessedAt: new Date("2023-07-08"),
  },
  {
    id: "e4",
    userId: "c3", // Carlos
    courseId: "c5", // Makeup Artistry Essentials
    enrolledAt: new Date("2023-05-20"),
    completedLessons: ["l5-1", "l5-2", "l5-3"], // First three lessons completed
    currentLessonId: "l5-4", // Currently on lesson 4
    progress: 20, // 3/15 lessons = 20%
    lastAccessedAt: new Date("2023-07-15"),
  },
  {
    id: "e5",
    userId: "c4", // Diana
    courseId: "c2", // Skin Care Fundamentals
    enrolledAt: new Date("2023-03-15"),
    completedLessons: ["l2-1", "l2-2", "l2-3", "l2-4", "l2-5", "l2-6", "l2-7", "l2-8", "l2-9", "l2-10", "l2-11", "l2-12"], // All lessons completed
    currentLessonId: "l2-12", // Completed last lesson
    progress: 100, // 12/12 lessons = 100%
    lastAccessedAt: new Date("2023-06-28"),
  },
  {
    id: "e6",
    userId: "c4", // Diana
    courseId: "c4", // Professional Nail Art Techniques
    enrolledAt: new Date("2023-06-05"),
    completedLessons: ["l4-1", "l4-2", "l4-3", "l4-4"], // First four lessons completed
    currentLessonId: "l4-5", // Currently on lesson 5
    progress: 40, // 4/10 lessons = 40%
    lastAccessedAt: new Date("2023-07-18"),
  },
  {
    id: "e7",
    userId: "c5", // Ethan
    courseId: "c6", // Mindfulness and Meditation Fundamentals
    enrolledAt: new Date("2023-04-25"),
    completedLessons: ["l6-1", "l6-2", "l6-3", "l6-4", "l6-5"], // First five lessons completed
    currentLessonId: "l6-5", // Completed available lessons
    progress: 41.7, // 5/12 lessons = ~41.7%
    lastAccessedAt: new Date("2023-07-10"),
  },
  {
    id: "e8",
    userId: "c6", // Fatima
    courseId: "c1", // Advanced Hair Styling Techniques
    enrolledAt: new Date("2023-05-02"),
    completedLessons: ["l1-1", "l1-2", "l1-3", "l1-4", "l1-5", "l1-6", "l1-7", "l1-8"], // All lessons completed
    currentLessonId: "l1-8", // Completed last lesson
    progress: 100, // 8/8 lessons = 100%
    lastAccessedAt: new Date("2023-06-20"),
  },
  {
    id: "e9",
    userId: "c6", // Fatima
    courseId: "c5", // Makeup Artistry Essentials
    enrolledAt: new Date("2023-06-25"),
    completedLessons: ["l5-1", "l5-2"], // First two lessons completed
    currentLessonId: "l5-3", // Currently on lesson 3
    progress: 13.3, // 2/15 lessons = ~13.3%
    lastAccessedAt: new Date("2023-07-19"),
  },
  {
    id: "e10",
    userId: "c2", // Bob
    courseId: "c6", // Mindfulness and Meditation Fundamentals
    enrolledAt: new Date("2023-06-10"),
    completedLessons: ["l6-1", "l6-2"], // First two lessons completed
    currentLessonId: "l6-3", // Currently on lesson 3
    progress: 16.7, // 2/12 lessons = ~16.7%
    lastAccessedAt: new Date("2023-07-16"),
  },
  {
    id: "e11",
    userId: "c3", // Carlos
    courseId: "c4", // Professional Nail Art Techniques
    enrolledAt: new Date("2023-05-30"),
    completedLessons: ["l4-1", "l4-2", "l4-3", "l4-4", "l4-5", "l4-6", "l4-7", "l4-8", "l4-9", "l4-10"], // All lessons completed
    currentLessonId: "l4-10", // Completed last lesson
    progress: 100, // 10/10 lessons = 100%
    lastAccessedAt: new Date("2023-07-05"),
  },
  {
    id: "e12",
    userId: "c5", // Ethan
    courseId: "c3", // Therapeutic Massage Masterclass
    enrolledAt: new Date("2023-07-01"),
    completedLessons: ["l3-1"], // First lesson completed
    currentLessonId: "l3-2", // Currently on lesson 2
    progress: 10, // 1/10 lessons = 10%
    lastAccessedAt: new Date("2023-07-18"),
  }
];

// Mock Social Posts
export const posts = [
  {
    id: "post1",
    authorId: "1", // Provider: Sarah Johnson
    content: "Just finished a creative color transformation on a client today! Swipe to see the before and after. #haircolor #balayage #transformation",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    likes: 48,
    commentsCount: 7,
    isLiked: true,
    createdAt: new Date("2023-07-15T14:23:00"),
    tags: ["haircolor", "balayage", "transformation"]
  },
  {
    id: "post2",
    authorId: "4", // Provider: Emma Thompson
    content: "New skincare tips! Remember that consistency is key when it comes to your routine. Here are my top 3 recommended products for summer skin health. What are your favorites?",
    imageUrl: "https://images.unsplash.com/photo-1556228841-7db5ca2cd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    likes: 72,
    commentsCount: 15,
    isLiked: false,
    createdAt: new Date("2023-07-14T09:45:00"),
    tags: ["skincare", "beauty", "selfcare"]
  },
  {
    id: "post3",
    authorId: "2", // Provider: Michael Rodriguez
    content: "Excited to announce that I'll be hosting a massage workshop next month! Learn techniques to help friends and family with stress relief. Limited spots available, link in bio to register.",
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    likes: 31,
    commentsCount: 5,
    isLiked: false,
    createdAt: new Date("2023-07-13T16:12:00"),
    tags: ["massage", "workshop", "wellness"]
  },
  {
    id: "post4",
    authorId: "c1", // Customer: Alice Anderson
    content: "Just had the most amazing facial experience at @EmmaThompson's spa! My skin feels incredible. If you're in London, you NEED to book with her. #selfcare #treatyourself",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    likes: 23,
    commentsCount: 3,
    isLiked: true,
    createdAt: new Date("2023-07-12T18:30:00"),
    tags: ["selfcare", "treatyourself", "spa"]
  },
  {
    id: "post5",
    authorId: "3", // Provider: Jennifer Lee
    content: "Before and after of today's bridal makeup! Congratulations to Jessica on her special day. For wedding bookings, check my availability calendar. #bridalmakeup #weddingglam",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    likes: 104,
    commentsCount: 12,
    isLiked: false,
    createdAt: new Date("2023-07-11T13:15:00"),
    tags: ["bridalmakeup", "weddingglam", "makeup"]
  },
  {
    id: "post6",
    authorId: "6", // Provider: David Chen
    content: "Today's meditation tip: Start with just 5 minutes of mindful breathing each morning. Consistency over duration is what builds the habit. How are you incorporating mindfulness into your day?",
    imageUrl: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    likes: 67,
    commentsCount: 9,
    isLiked: true,
    createdAt: new Date("2023-07-10T07:45:00"),
    tags: ["meditation", "mindfulness", "wellness"]
  },
  {
    id: "post7",
    authorId: "c2", // Customer: Bob Brown
    content: "Just completed my first yoga session with @DavidChen and I'm feeling amazing! Can't believe I waited so long to try this. #newyogi #wellness",
    imageUrl: null,
    likes: 19,
    commentsCount: 4,
    isLiked: false,
    createdAt: new Date("2023-07-09T19:20:00"),
    tags: ["newyogi", "wellness", "yoga"]
  },
  {
    id: "post8",
    authorId: "13", // Provider: Fatima Al-Farsi
    content: "The gold facial treatment that's taking Dubai by storm! This luxurious treatment helps reduce fine lines and gives your skin an incredible glow. Limited slots available next week.",
    imageUrl: "https://images.unsplash.com/photo-1614108400523-8c1a79c3ab30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    likes: 85,
    commentsCount: 11,
    isLiked: false,
    createdAt: new Date("2023-07-08T10:30:00"),
    tags: ["luxury", "facial", "dubai", "skincare"]
  }
];

// Mock Comments
export const comments = [
  // Comments for post1
  {
    id: "comment1",
    postId: "post1",
    authorId: "c4", // Customer: Diana Wong
    content: "This looks amazing! What products did you use to achieve this color?",
    likes: 3,
    isLiked: true,
    createdAt: new Date("2023-07-15T14:45:00")
  },
  {
    id: "comment2",
    postId: "post1",
    authorId: "1", // Provider: Sarah Johnson (author reply)
    content: "Thank you! I used a combination of Redken Shades EQ with a balayage technique. Happy to discuss more if you want to book a consultation!",
    likes: 1,
    isLiked: false,
    createdAt: new Date("2023-07-15T15:02:00")
  },
  {
    id: "comment3",
    postId: "post1",
    authorId: "c6", // Customer: Fatima Ali
    content: "Stunning transformation! I need to book with you soon.",
    likes: 0,
    isLiked: false,
    createdAt: new Date("2023-07-15T16:30:00")
  },
  
  // Comments for post2
  {
    id: "comment4",
    postId: "post2",
    authorId: "c1", // Customer: Alice Anderson
    content: "I've been using that vitamin C serum you recommended and my skin is glowing! Thank you!",
    likes: 5,
    isLiked: true,
    createdAt: new Date("2023-07-14T10:15:00")
  },
  {
    id: "comment5",
    postId: "post2",
    authorId: "4", // Provider: Emma Thompson (author reply)
    content: "So happy to hear that, Alice! Vitamin C is a game changer for most skin types.",
    likes: 2,
    isLiked: false,
    createdAt: new Date("2023-07-14T10:25:00")
  },
  
  // Comments for post3
  {
    id: "comment6",
    postId: "post3",
    authorId: "c5", // Customer: Ethan Jackson
    content: "Just signed up! Looking forward to learning some new techniques.",
    likes: 1,
    isLiked: false,
    createdAt: new Date("2023-07-13T17:00:00")
  },
  
  // Comments for post4
  {
    id: "comment7",
    postId: "post4",
    authorId: "4", // Provider: Emma Thompson
    content: "Thank you so much for the kind words, Alice! It was wonderful having you at the spa. See you again soon!",
    likes: 2,
    isLiked: true,
    createdAt: new Date("2023-07-12T19:15:00")
  },
  
  // Comments for post5
  {
    id: "comment8",
    postId: "post5",
    authorId: "c3", // Customer: Carlos Rodriguez
    content: "My sister is getting married next spring. Do you travel for wedding events?",
    likes: 0,
    isLiked: false,
    createdAt: new Date("2023-07-11T14:20:00")
  },
  {
    id: "comment9",
    postId: "post5",
    authorId: "3", // Provider: Jennifer Lee (author reply)
    content: "Yes, I do! Please send me a direct message with the details and we can discuss packages.",
    likes: 1,
    isLiked: false,
    createdAt: new Date("2023-07-11T14:35:00")
  }
];

// User Follow Relationships
export const follows = [
  { followerId: "c1", followingId: "1" }, // Alice follows Sarah
  { followerId: "c1", followingId: "4" }, // Alice follows Emma
  { followerId: "c1", followingId: "2" }, // Alice follows Michael
  { followerId: "c2", followingId: "6" }, // Bob follows David
  { followerId: "c2", followingId: "1" }, // Bob follows Sarah
  { followerId: "c3", followingId: "3" }, // Carlos follows Jennifer
  { followerId: "c4", followingId: "1" }, // Diana follows Sarah
  { followerId: "c4", followingId: "4" }, // Diana follows Emma
  { followerId: "c4", followingId: "13" }, // Diana follows Fatima
  { followerId: "c5", followingId: "2" }, // Ethan follows Michael
  { followerId: "c6", followingId: "1" }, // Fatima (customer) follows Sarah
  { followerId: "c6", followingId: "3" }, // Fatima (customer) follows Jennifer
  { followerId: "1", followingId: "2" }, // Sarah follows Michael (provider follows provider)
  { followerId: "1", followingId: "3" }, // Sarah follows Jennifer (provider follows provider)
  { followerId: "1", followingId: "4" }, // Sarah follows Emma (provider follows provider)
  { followerId: "2", followingId: "1" }, // Michael follows Sarah (provider follows provider)
  { followerId: "4", followingId: "13" }, // Emma follows Fatima (provider follows provider)
];