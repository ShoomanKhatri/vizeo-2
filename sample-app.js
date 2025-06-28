import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  StatusBar,
  Modal,
  TouchableOpacity,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
  Dimensions,
  ActivityIndicator,
  PanResponder, // Import PanResponder
  Easing, // Import Easing for smoother animations
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Menu,
  ListFilter,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  MessageSquareReply,
  FilePlus,
  ImageIcon,
  Volume2,
  Bookmark,
  Heart,
  TrendingUp,
  DollarSign,
  MessageCircle,
  ArrowUp,
  User,
  Check,
  Globe,
  Link,
  Briefcase,
  Award,
  Clock,
  Zap,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window"); // Get screen height

// --- Color Palette Definitions (New Premium Colors) ---
const COLORS = {
  background: "#0A0A0A", // Rich Black / Deep Charcoal
  cardBackground: "#101010", // Slightly lighter charcoal for cards
  primaryAccent: "#C4A77D", // Warm Bronze / Gold
  secondaryAccent: "#B8860B", // Slightly darker gold for subtle highlights
  textWhite: "#F0F0F0", // Refined off-white for main text
  textLightGray: "#CCCCCC", // Premium silver/platinum accent for secondary text
  textMediumGray: "#AAAAAA", // Slightly darker silver for less prominent text
  buttonBorder: "rgba(255, 255, 255, 0.1)", // Subtle white border for UI elements
  shadowColor: "rgba(0, 0, 0, 0.5)", // Softer, deeper shadows
  gradientStart: "rgba(0,0,0,0.0)",
  gradientEnd: "rgba(0,0,0,0.8)",
};

// --- Helper function to convert string to Sentence Case ---
const toSentenceCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// --- Mock Data (Re-emphasized for clarity and potential expansion) ---
// Define CREATORS array first, as it's a stable source for creator profiles
const CREATORS = [
  {
    id: "Krypton T",
    name: "Krypton T",
    avatar:
      "https://cdn.qwenlm.ai/output/88ae44e3-1b93-4c51-8d6a-ae4d0dab9a46/t2i/ecc06355-1b93-4c51-8d6a-ae4d0dab9a46/cf079bc8-9280-48e5-b779-5cc7f6f8d3b0.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiODhhZTQ0ZTMtMWI5My00YzUxLThkNmEtYWU0ZDBhYjkyNjUiLCJyZXNvdXJjZV9pZCI6ImNmMDc5YmM4LTkyODAtNDhlNS03YzdmNmY4ZDNjOCIsImNyZWF0b3JfY2hhdF9pZCI6bnVsbH0.aU9y2SAvlNYxUYv0pfEyQhAtX-wIaqujKa7NPlL36Rs", // Use a unique creator avatar
    bio: "A deep dive into alternative history scenarios, exploring pivotal moments and their potential ripple effects.",
    quote:
      '"History is not just what happened, but what could have been. Imagination fuels understanding."',
    isVerified: true,
    socialLinks: [
      { platform: "youtube", url: "https://youtube.com/kryptont" },
      { platform: "twitter", url: "https://twitter.com/kryptont" },
    ],
    portfolioUrl: "https://kryptont.com/portfolio",
    supportUrl: "https://patreon.com/kryptont",
    isAIenhanced: false,
    followers: 12000,
  },
  {
    id: "SpaceExplorer",
    name: "SpaceExplorer",
    avatar:
      "https://cdn.qwenlm.ai/output/88ae44e3-1b93-4c51-8d6a-ae4d0dab9a46/t2i/ecc06355-1b93-4c51-8d6a-ae4d0dab9a46/ee4f7acc-3d00-428f-90ed-2d96b65d94d4.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiODhhZTQ0ZTMtMWI5My00YzUxLThkNmEtYWU0ZDBhYjkyNjUiLCJyZXNvdXJjZV9pZCI6ImVlNGY3YWNjLTNkMDAtNDI4Zi05MGVkLTJkOTZiNjVkOTQ0NCIsImNyZWF0b3Jf2FjYXQtY2hhdF9pZCI6bnVsbH0.ySsAQAtUytOsP3EZQhCKCgSHwchGzEaCzkcURNrg5D54",
    bio: "Exploring the mysteries of space and human perception. Debunking myths with a scientific lens.",
    quote:
      '"The truth is out there, but so are the theories. Our mission is to find clarity."',
    isVerified: false,
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/spaceexplorer" },
    ],
    portfolioUrl: null,
    supportUrl: null,
    isAIenhanced: true,
    followers: 8500,
  },
  {
    id: "SociologyThinker",
    name: "SociologyThinker",
    avatar:
      "https://cdn.qwenlm.ai/output/88ae44e3-1b93-4c51-8d6a-ae4d0dab9a46/t2i/ecc06355-1b93-4c51-8d6a-ae4d0dab9a46/353a8478-0e21-4e3a-85c7-87442fb090ef.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiODhhZTQ0ZTMtMWI5My00YzUxLThkNmEtYWU0ZDBhYjkyNjUiLCJyZXNvdXJjZV9pZCI6IjM1M2E4NDc4LTBlMjEtNGUzYS04NWM3LTg3NDQyZmIwOTBlZiIsImNyZWF0b3JfY2hhdF9pZCI6bnVsbH0.-yErlq0KGsLbJUQO_zf-400ETC_LR6k-zw0WoTBfyelI",
    bio: "Analyzing societal structures and economic paradigms. Advocating for a more equitable future.",
    quote:
      '"Question everything, especially the status quo. Change begins with understanding."',
    isVerified: true,
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/sociologythinker" },
    ],
    portfolioUrl: null,
    supportUrl: "https://buymeacoffee.com/sociologythinker",
    isAIenhanced: false,
    followers: 25000,
  },
  {
    id: "MarketTruth",
    name: "MarketTruth",
    avatar:
      "https://sdmntprwestus.oaiusercontent.com/files/00000000-ecbc-6230-8d22-729c89e66988/raw?se=2025-05-22T06%3A27%3A35Z&sp=r&sv=2024-08-04&scid=5bd4a3ca-6af3-5b68-a1b1-70b03cbeaaf1&skoid=61180a4f-34a9-42b7-b76d-9ca47d89946d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A41%3A36Z&ske=2025-06-05T20%3A41%3A14Z&sks=b&skv=2024-08-04&sig=eLw7bUgGuWSUor/A9rzR4op7z/VpIk9zYdXE1CPqImQ%3D",
    bio: "Uncovering the hidden truths of financial markets, providing insights for informed decision-making.",
    quote:
      '"Knowledge is power, especially in the markets. Stay informed, stay ahead."',
    isVerified: false,
    socialLinks: [],
    portfolioUrl: null,
    supportUrl: null,
    isAIenhanced: true,
    followers: 6000,
  },
  {
    id: "AIInsights",
    name: "AIInsights",
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=AI",
    bio: "Exploring the bleeding edge of artificial intelligence and its societal impact.",
    quote:
      "\"AI is not just about technology, it's about humanity's next chapter.\"",
    isVerified: true,
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/aiinsights" },
    ],
    portfolioUrl: "https://aiinsights.com",
    supportUrl: null,
    isAIenhanced: true,
    followers: 30000,
  },
  {
    id: "DesignTheory",
    name: "DesignTheory",
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=DE",
    bio: "Simplifying complex design principles for aspiring creatives.",
    quote: '"Less is more, but clarity is everything."',
    isVerified: false,
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/designtory" },
    ],
    portfolioUrl: null,
    supportUrl: null,
    isAIenhanced: false,
    followers: 4500,
  },
  {
    id: "QuantumLeap",
    name: "QuantumLeap",
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=QL",
    bio: "Demystifying complex physics concepts for the curious mind.",
    quote: '"The universe is stranger than we can imagine."',
    isVerified: true,
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/quantumleap" },
    ],
    portfolioUrl: null,
    supportUrl: null,
    isAIenhanced: false,
    followers: 9000,
  },
  {
    id: "CosmicVoyager",
    name: "CosmicVoyager",
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=CV",
    bio: "Exploring the unseen forces that shape our universe.",
    quote: '"The cosmos holds more secrets than stars."',
    isVerified: false,
    socialLinks: [],
    portfolioUrl: null,
    supportUrl: null,
    isAIenhanced: true,
    followers: 7200,
  },
];

const VIDEOS = [
  {
    id: "1",
    title: "What if the Cold War went hot? An Alternate History",
    creator: "Krypton T",
    time: "1 month ago",
    requestedBy: "OceanDreamer",
    thumbnail:
      "https://cdn.qwenlm.ai/output/88ae44e3-1b93-4c51-8d6a-ae4d0dab9a46/t2i/ecc06355-9de3-4f19-bf1d-1524fa1cb984/cf079bc8-9280-48e5-b779-5cc7f6f8d3b0.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiODhhZTQ0ZTMtMWI5My00YzUxLThkNmEtYWU0ZDBhYjkyNjUiLCJyZXNvdXJjZV9pZCI6ImNmMDc5YmM4LTkyODAtNDhlNS03YzdmNmY4ZDNjOCIsImNyZWF0b3JfY2hhdF9pZCI6bnVsbH0.aU9y2SAvlNYxUYv0pfEyQhAtX-wIaqujKa7NPlL36Rs",
    duration: "4:30",
    requested: true,
    isAIenhanced: false,
  },
  {
    id: "2",
    title: "Why Was the Moon Landing Conspiracy So Believable?",
    creator: "SpaceExplorer",
    time: "2 weeks ago",
    requestedBy: "HistoryJunkie",
    thumbnail:
      "https://cdn.qwenlm.ai/output/88ae44e3-1b93-4c51-8d6a-ae4d0dab9a46/t2i/ecc06355-9de3-4f19-bf1d-1524fa1cb984/ee4f7acc-3d00-428f-90ed-2d96b65d94d4.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiODhhZTQ0ZTMtMWI5My00YzUxLThkNmEtYWU0ZDBhYjkyNjUiLCJyZXNvdXJjZV9pZCI6ImVlNGY3YWNjLTNkMDAtNDI4Zi05MGVkLTJkOTZiNjVkOTQ0NCIsImNyZWF0b3Jf2FjYXQtY2hhdF9pZCI6bnVsbH0.ySsAQAtUytOsP3EZQhCKCgSHwchGzEaCzkcURNrg5D54", // Placeholder URL
    duration: "5:30",
    requested: false,
    isAIenhanced: true,
  },
  {
    id: "3",
    title: "Are We All Just Working to Make Billionaires Richer?",
    creator: "SociologyThinker",
    time: "1 week ago",
    requestedBy: "SocialRevolutionary",
    thumbnail:
      "https://cdn.qwenlm.ai/output/88ae44e3-1b93-4c51-8d6a-ae4d0dab9a46/t2i/ecc06355-1b93-4c51-8d6a-ae4d0dab9a46/353a8478-0e21-4e3a-85c7-87442fb090ef.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiODhhZTQ0ZTMtMWI5My00YzUxLThkNmEtYWU0ZDBhYjkyNjUiLCJyZXNvdXJjZV9pZCI6IjM1M2E4NDc4LTBlMjEtNGUzYS04NWM3LTg3NDQyZmIwOTBlZiIsImNyZWF0b3JfY2hhdF9pZCI6bnVsbH0.-yErlq0KGsLbJUQO_zf-400ETC_LR6k-zw0WoTBfyelI",
    duration: "5:00",
    requested: false,
    isAIenhanced: false,
  },
  {
    id: "4",
    title:
      "Is the Stock Market Rigged to Keep Average People from Getting Rich?",
    creator: "MarketTruth",
    time: "1 week ago",
    requestedBy: "EconomicSleuth",
    thumbnail:
      "https://sdmntprwestus.oaiusercontent.com/files/00000000-ecbc-6230-8d22-729c89e66988/raw?se=2025-05-22T06%3A27%3A35Z&sp=r&sv=2024-08-04&scid=5bd4a3ca-6af3-5b68-a1b1-70b03cbeaaf1&skoid=61180a4f-34a9-42b7-b76d-9ca47d89946d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A41%3A36Z&ske=2025-06-05T20%3A41%3A14Z&sks=b&skv=2024-08-04&sig=eLw7bUgGuWSUor/A9rzR4op7z/VpIk9zYdXE1CPqImQ%3D",
    duration: "5:25",
    requested: false,
    isAIenhanced: true,
  },
  {
    id: "5", // Added a new AI-enhanced and requested video
    title: "The Future of AI: From Chatbots to Consciousness",
    creator: "AIInsights",
    time: "3 days ago",
    requestedBy: "TechFuturist",
    thumbnail: "https://placehold.co/400x220/1A1A1A/C4A77D?text=AI+Future", // Placeholder image for AI
    duration: "7:10",
    requested: true,
    isAIenhanced: true,
  },
  {
    id: "6", // Added an original, popular video
    title: "Mastering Minimalist Design: A Guide for Beginners",
    creator: "DesignTheory",
    time: "2 months ago",
    requestedBy: "DesignLover",
    thumbnail: "https://placehold.co/400x220/101010/C4A77D?text=Minimal+Design", // Placeholder image for Design
    duration: "8:45",
    requested: false,
    isAIenhanced: false,
  },
  {
    id: "7",
    title: "Understanding Quantum Computing Basics",
    creator: "QuantumLeap",
    time: "1 week ago",
    requestedBy: "OceanDreamer", // Requested by OceanDreamer
    thumbnail: "https://placehold.co/400x220/1A1A1A/C4A77D?text=Quantum+Comp",
    duration: "6:00",
    requested: true,
    isAIenhanced: false,
  },
  {
    id: "8",
    title: "The Enigma of Dark Matter and Dark Energy",
    creator: "CosmicVoyager",
    time: "2 days ago",
    requestedBy: "OceanDreamer", // Requested by OceanDreamer
    thumbnail: "https://placehold.co/400x220/1A1A1A/C4A77D?text=Dark+Matter",
    duration: "7:30",
    requested: true,
    isAIenhanced: true,
  },
];

const COMMUNITY_REQUESTS = [
  {
    id: "cr1",
    user: {
      name: "CryptoGuru",
      avatar: "https://placehold.co/40x40/101010/C4A77D?text=CG",
    },
    timestamp: "Requested 3 days ago",
    tags: ["#blockchain", "#finance"],
    title: "Decentralized Finance Explained for Dummies",
    description:
      "A beginner-friendly video breaking down complex DeFi concepts into understandable terms, focusing on real-world examples and potential risks.",
    attachments: [
      {
        type: "image",
        uri: "https://placehold.co/200x120/101010/C4A77D?text=DeFi+Concept",
      },
    ],
    upvotes: 125,
    comments: 42,
    boosts: 15,
    tips: 50,
    isBookmarked: false,
    visibility: "Public",
    recentBoosters: [
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U1" },
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U2" },
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U3" },
    ],
  },
  {
    id: "cr2",
    user: {
      name: "ArtLover22",
      avatar: "https://placehold.co/40x40/101010/C4A77D?text=AL",
    },
    timestamp: "Requested 1 week ago",
    tags: ["#art", "#history"],
    title: "The Hidden Meanings in Renaissance Paintings",
    description:
      "Explore the symbolism and secret messages embedded in famous Renaissance masterpieces.",
    attachments: [
      {
        type: "image",
        uri: "https://placehold.co/200x120/101010/C4A77D?text=Renaissance+Art",
      },
    ],
    upvotes: 80,
    comments: 20,
    boosts: 5,
    tips: 10,
    isBookmarked: true,
    visibility: "Public",
    recentBoosters: [
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U4" },
    ],
  },
  {
    id: "cr3",
    user: {
      name: "EcoWarrior",
      avatar: "https://placehold.co/40x40/101010/C4A77D?text=EW",
    },
    timestamp: "Requested 2 days ago",
    tags: ["#environment", "#sustainability"],
    title: "Sustainable Living: A Practical Guide",
    description:
      "Practical tips and actionable steps for adopting a more sustainable lifestyle, from reducing waste to conserving energy.",
    attachments: [],
    upvotes: 210,
    comments: 65,
    boosts: 20,
    tips: 75,
    isBookmarked: false,
    visibility: "Sponsored Opportunity",
    recentBoosters: [
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U5" },
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U6" },
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U7" },
    ],
  },
  {
    id: "cr4",
    user: {
      name: "TechGeek",
      avatar: "https://placehold.co/40x40/101010/C4A77D?text=TG",
    },
    timestamp: "Requested 4 days ago",
    tags: ["#AI", "#futuretech"],
    title: "The Ethics of Artificial Intelligence",
    description:
      "A thoughtful discussion on the moral and societal implications of rapidly advancing AI technologies.",
    attachments: [],
    upvotes: 95,
    comments: 30,
    boosts: 8,
    tips: 25,
    isBookmarked: false,
    visibility: "Public",
    recentBoosters: [],
  },
  {
    id: "cr5",
    user: {
      name: "FoodieFan",
      avatar: "https://placehold.co/40x40/101010/C4A77D?text=FF",
    },
    timestamp: "Requested 5 days ago",
    tags: ["#cooking", "#globalcuisine"],
    title: "Mastering Authentic Street Food Recipes",
    description:
      "Learn to cook delicious and authentic street food from around the world with easy-to-follow recipes.",
    attachments: [
      {
        type: "image",
        uri: "https://placehold.co/200x120/101010/C4A77D?text=Street+Food",
      },
    ],
    upvotes: 180,
    comments: 50,
    boosts: 10,
    tips: 60,
    isBookmarked: false,
    visibility: "Public",
    recentBoosters: [
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U8" },
      { avatar: "https://placehold.co/20x20/101010/CCCCCC?text=U9" },
    ],
  },
];

const REQUESTERS = [
  {
    id: "OceanDreamer",
    name: "OceanDreamer",
    isTopRequestor: true,
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=OD",
    bio: "Curious about lost civilizations. Requesting videos that challenge conventional history.",
    requestPhilosophy:
      "Driven by a desire to explore the unknown and uncover hidden truths. I believe in the power of visual storytelling to educate and inspire.",
    requestLevel: "Dream Architect",
    joinedDate: "May 2024",
    totalRequests: 15,
    completedRequests: 10,
    mostLikedRequest: {
      title: "Ancient Alien Theories Unveiled",
      thumbnail:
        "https://sdmntprwestus2.oaiusercontent.com/files/00000000-ee6c-61f8-8cc2-dc7aed06ee48/raw?se=2025-05-22T06%3A43%3A10Z&sp=r&sv=2024-08-04&scid=f3c306ff-6759-55e3-a490-09cc77bcdc70&skoid=1e6af1bf-6b08-4a04-8919-15773e7e7024&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-22T05%3A40%3A14Z&ske=2025-06-05T05%3A40%3A14Z&sks=b&skv=2024-08-04&sig=eLw7bUgGuWSUor/A9rzR4op7z/VpIk9zYdXE1CPqImQ%3D",
      upvotes: 250,
    },
    requestCategories: ["History 📜", "Mystery 🔍", "Speculative Fiction 👽"],
    publicProfileLink: "https://oceandreamer.com/profile",
    socialHandles: {
      twitter: "@OceanDreamer_X",
      discord: "Ocean#1234",
    },
    communityThankYous: 8,
    isSupporter: true,
    donatedAmount: 23,
    // Add requestedVideos array
    requestedVideos: ["1", "7", "8"], // IDs of videos requested by OceanDreamer
  },
  {
    id: "HistoryJunkie",
    name: "HistoryJunkie",
    isTopRequestor: false,
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=HJ",
    bio: "Fascinated by forgotten stories and pivotal moments.",
    requestPhilosophy:
      "I enjoy diving deep into historical events and uncovering their true impact. My requests focus on shedding light on untold narratives.",
    requestLevel: "Visionary",
    joinedDate: "Jan 2024",
    totalRequests: 7,
    completedRequests: 5,
    mostLikedRequest: {
      title: "The Rise and Fall of Ancient Rome",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuyrOMSy7Qbo09OUFvGOd8lZr57bDYuLMpxw&s",
      upvotes: 180,
    },
    requestCategories: ["History 📜", "Politics 🏛️"],
    publicProfileLink: null,
    socialHandles: {
      instagram: "@history_junkie_official",
    },
    communityThankYous: 3,
    isSupporter: false,
    donatedAmount: 0,
    requestedVideos: [],
  },
  {
    id: "SocialRevolutionary",
    name: "SocialRevolutionary",
    isTopRequestor: false,
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=SR",
    bio: "Advocating for systemic change through educational content.",
    requestPhilosophy:
      "My goal is to spark critical thinking and encourage action towards a more equitable society. I seek content that challenges the status quo.",
    requestLevel: "Power Requestor",
    joinedDate: "Feb 2025",
    totalRequests: 20,
    completedRequests: 18,
    mostLikedRequest: {
      title: "Rethinking Capitalism: A Modern Critique",
      thumbnail:
        "https://sdmntprcentralus.oaiusercontent.com/files/00000000-3d88-61f5-a277-aafc460e865a/raw?se=2025-06-04T15%3A02%3A35Z&sp=r&sv=2024-08-04&scid=22736c51-ff2c-5be4-9df8-f12873f023ca&skoid=5cab1ff4-c20d-41dc-babb-df0c2cc21dd4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-04T13%3A00%3A18Z&ske=2025-06-05T13%3A00%3A18Z&sks=b&skv=2024-08-04&sig=pJ9XpqrQG8zfTIjpjaktyJaRbkyJaRbky3rv2QjTe8PsTWE4%3D",
      upvotes: 310,
    },
    requestCategories: ["Sociology ⚖️", "Economics ?", "Philosophy 🧠"],
    publicProfileLink: null,
    socialHandles: {
      youtube: "SocialRevolutionaryTube",
    },
    communityThankYous: 12,
    isSupporter: true,
    donatedAmount: 75,
    requestedVideos: [],
  },
  {
    id: "EconomicSleuth",
    name: "EconomicSleuth",
    isTopRequestor: true,
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=ES",
    bio: "Unraveling the complexities of global finance.",
    requestPhilosophy:
      "I thrive on understanding the intricate workings of financial systems and exposing biases or hidden truths. My requests aim to demystify complex economic topics.",
    requestLevel: "Dream Architect",
    joinedDate: "March 2025",
    totalRequests: 10,
    completedRequests: 8,
    mostLikedRequest: {
      title: "Inside the Shadow Economy",
      thumbnail:
        "https://sdmntprwestus.oaiusercontent.com/files/00000000-ecbc-6230-8d22-729c89e66988/raw?se=2025-05-22T06%3A27%3A35Z&sp=r&sv=2024-08-04&scid=5bd4a3ca-6af3-5b68-a1b1-70b03cbeaaf1&skoid=61180a4f-34a9-42b7-b76d-9ca47d89946d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T20%3A41%3A36Z&ske=2025-06-05T20%3A41%3A14Z&sks=b&skv=2024-08-04&sig=eLw7bUgGuWSUor/A9rzR4op7z/VpIk9zYdXE1CPqImQ%3D",
      upvotes: 195,
    },
    requestCategories: ["Economics 💹", "Investigative 🕵️", "Finance 💰"],
    publicProfileLink: null,
    socialHandles: {
      twitter: "@EconomicSleuth",
    },
    communityThankYous: 6,
    isSupporter: true,
    donatedAmount: 40,
    requestedVideos: [],
  },
  {
    id: "TechFuturist", // New requester for the new AI video
    name: "TechFuturist",
    isTopRequestor: false,
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=TF",
    bio: "Pioneering thought in future technologies and their implications.",
    requestPhilosophy:
      "I believe understanding tomorrow starts with questioning today. I seek content that pushes boundaries and envisions new possibilities.",
    requestLevel: "Visionary",
    joinedDate: "May 2025",
    totalRequests: 3,
    completedRequests: 2,
    mostLikedRequest: null, // No most liked request yet
    requestCategories: ["AI 🤖", "Future Tech ?", "Philosophy 🧠"],
    publicProfileLink: null,
    socialHandles: { twitter: "@TechFuturistAI" },
    communityThankYous: 1,
    isSupporter: false,
    donatedAmount: 0,
    requestedVideos: ["5"], // Requested "The Future of AI"
  },
  {
    id: "DesignLover", // New requester for the new design video
    name: "DesignLover",
    isTopRequestor: false,
    avatar: "https://placehold.co/40x40/101010/C4A77D?text=DL",
    bio: "Appreciating and advocating for beautiful, functional design.",
    requestPhilosophy:
      "Good design simplifies life. I request content that educates and inspires designers of all levels.",
    requestLevel: "Newbie",
    joinedDate: "June 2025",
    totalRequests: 1,
    completedRequests: 1,
    mostLikedRequest: null,
    requestCategories: ["Design 🎨", "Tutorials ?"],
    publicProfileLink: null,
    socialHandles: {},
    communityThankYous: 0,
    isSupporter: false,
    donatedAmount: 0,
    requestedVideos: ["6"], // Requested "Mastering Minimalist Design"
  },
];

// --- Helper Hooks and Components for Reusability and Modularity ---

// Custom hook for consistent pressable animations and haptic feedback
const usePressableAnimation = (onPressCallback) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const onPressIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Apply haptic feedback
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false, // backgroundColor cannot use native driver
    }).start();
  }, [animatedValue]);

  const onPressOut = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  const animatedStyle = {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", "rgba(255, 255, 255, 0.05)"], // Subtle white glow
    }),
  };

  return {
    onPressIn,
    onPressOut,
    onPress: onPressCallback,
    animatedStyle,
  };
};

// CustomDropdown component for reusable dropdown functionality
function CustomDropdown({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder,
  accessibilityLabel,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const animatedRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedRotation, {
      toValue: modalVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  const arrowRotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={requestModalStyles.inputGroup}>
      <Text style={requestModalStyles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={requestModalStyles.dropdownButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        accessibilityLabel={accessibilityLabel || `Select ${label}`}
        accessibilityHint={`Current selection: ${selectedValue || "None"}`}
        accessibilityRole="button"
      >
        <Text
          style={[
            requestModalStyles.dropdownButtonText,
            !selectedValue && requestModalStyles.dropdownPlaceholderText,
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <ChevronDown size={20} color={COLORS.textMediumGray} />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal={true}
      >
        <Pressable
          style={requestModalStyles.dropdownOverlay}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalVisible(false);
          }}
          accessibilityLabel="Close dropdown menu"
        >
          <View
            style={requestModalStyles.dropdownModalView}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView
              style={requestModalStyles.dropdownScrollView}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option, index) => {
                const optionProps = usePressableAnimation(() => {
                  onSelect(option);
                  setModalVisible(false);
                });
                return (
                  <Animated.View
                    key={index}
                    style={[
                      requestModalStyles.dropdownOption,
                      optionProps.animatedStyle,
                      { borderRadius: 8 },
                      index === options.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <Pressable
                      onPressIn={optionProps.onPressIn}
                      onPressOut={optionProps.onPressOut}
                      onPress={optionProps.onPress}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                      }}
                      accessibilityLabel={`Select ${option}`}
                      accessibilityRole="menuitem"
                    >
                      <Text style={requestModalStyles.dropdownOptionText}>
                        {option}
                      </Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// RequestVideoModal component: Simplified request modal with Title and Description fields
function RequestVideoModal({ isVisible, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both video title and description."); // Using alert for now, to be replaced by custom toast
      return;
    }
    console.log("New Video Request Submitted:", { title, description });
    // In a real app, you'd send this data to an an API
    alert(`Your request for "${toSentenceCase(title)}" has been submitted!`); // Apply sentence case here
    setTitle("");
    setDescription("");
    onClose();
  }, [title, description, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Request a Video Modal"
    >
      <View style={requestModalStyles.centeredView}>
        <BlurView
          intensity={80}
          tint="dark"
          style={requestModalStyles.modalBlur}
        >
          <ScrollView
            contentContainerStyle={requestModalStyles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={requestModalStyles.closeButton}
              accessibilityLabel="Close request modal"
            >
              <X size={20} color={COLORS.textLightGray} />
            </TouchableOpacity>

            <Text style={requestModalStyles.modalTitle}>Request A Video</Text>

            <View style={requestModalStyles.inputGroup}>
              <Text style={requestModalStyles.inputLabel}>
                Title <Text style={requestModalStyles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[
                  requestModalStyles.textInput,
                  requestModalStyles.goldBorder,
                ]}
                placeholder="A concise title for your video idea"
                placeholderTextColor={COLORS.textMediumGray}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                accessibilityLabel="Video Title input"
                accessibilityHint="Enter a concise title for your video request"
              />
            </View>

            <View style={requestModalStyles.inputGroup}>
              <Text style={requestModalStyles.inputLabel}>
                Description{" "}
                <Text style={requestModalStyles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[
                  requestModalStyles.textInput,
                  requestModalStyles.multilineInput,
                  requestModalStyles.goldBorder,
                ]}
                placeholder="Explain the context, purpose, or outcome you imagine..."
                placeholderTextColor={COLORS.textMediumGray}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                accessibilityLabel="Video Description input"
                accessibilityHint="Provide detailed context for your video request"
              />
            </View>

            <TouchableOpacity
              style={requestModalStyles.submitButton}
              onPress={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              accessibilityLabel="Submit video request"
              accessibilityHint="Submits your video request after reviewing details"
            >
              <Text style={requestModalStyles.submitButtonText}>
                Submit Request
              </Text>
              <MaterialIcons
                name="send"
                size={20}
                color={COLORS.cardBackground}
                style={requestModalStyles.submitButtonIcon}
              />
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
}

// RequesterProfileModal component: Displays detailed information about a requester.
function RequesterProfileModal({ isVisible, onClose, requester }) {
  const [showFrontSide, setShowFrontSide] = useState(true);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Reset flip animation and state when modal opens/closes
  useEffect(() => {
    if (isVisible) {
      setShowFrontSide(true);
      flipAnimation.setValue(0); // Start at 0 for the front side
    }
  }, [isVisible, flipAnimation]);

  const flipToBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 500, // Duration of the flip animation
      useNativeDriver: true,
    }).start(() => setShowFrontSide(false)); // Once flipped, set state to show back
  }, [flipAnimation]);

  const flipToFront = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 500, // Duration of the flip animation
      useNativeDriver: true,
    }).start(() => setShowFrontSide(true)); // Once flipped, set state to show front
  }, [flipAnimation]);

  const rotateYFront = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Front rotates from 0 to 180
  });

  const rotateYBack = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"], // Back rotates from 180 to 360 (effectively 0)
  });

  // Filter requested videos
  const requestedVideos = useMemo(() => {
    if (!requester || !requester.requestedVideos) return [];
    return VIDEOS.filter((video) =>
      requester.requestedVideos.includes(video.id)
    );
  }, [requester]);

  // Use useCallback for memoized functions to prevent unnecessary re-renders
  const getSocialIcon = useCallback((platform) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return (
          <Feather name="twitter" size={24} color={COLORS.textLightGray} />
        );
      case "youtube":
        return (
          <Feather name="youtube" size={24} color={COLORS.textLightGray} />
        );
      case "discord":
        return (
          <Feather
            name="message-circle"
            size={24}
            color={COLORS.textLightGray}
          />
        );
      case "instagram":
        return (
          <Feather name="instagram" size={24} color={COLORS.textLightGray} />
        );
      default:
        return <Feather name="link" size={24} color={COLORS.textLightGray} />;
    }
  }, []);

  const handleLinkPress = useCallback((url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  }, []);

  if (!requester) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Requester Profile Modal"
    >
      <View style={requesterProfileStyles.centeredView}>
        <BlurView
          intensity={80}
          tint="dark"
          style={requesterProfileStyles.modalBlur}
        >
          <View style={requesterProfileStyles.flipCardContainer}>
            {/* Front Side */}
            <Animated.View
              style={[
                requesterProfileStyles.flipCard,
                requesterProfileStyles.flipCardFront,
                { transform: [{ rotateY: rotateYFront }] },
                !showFrontSide && { opacity: 0 }, // Hide front when showing back
              ]}
            >
              <ScrollView
                contentContainerStyle={requesterProfileStyles.modalView}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onClose();
                  }}
                  style={requesterProfileStyles.closeButton}
                  accessibilityLabel="Close requester profile"
                >
                  <X size={20} color={COLORS.textLightGray} />
                </TouchableOpacity>

                {/* Top decorative element (simulating ID card top design) */}
                <View style={requesterProfileStyles.topShapeContainer}>
                  <View style={requesterProfileStyles.topShapeMain} />
                  <View style={requesterProfileStyles.topShapeAccent} />
                </View>

                {/* Central Avatar */}
                <Image
                  source={{ uri: requester.avatar }}
                  style={[
                    requesterProfileStyles.requesterAvatar,
                    requesterProfileStyles.goldBorder,
                  ]}
                  accessibilityLabel={`${requester.name}'s profile picture`}
                />

                {/* Requester Name and Level */}
                <Text style={requesterProfileStyles.requesterName}>
                  {requester.name}
                </Text>
                <Text style={requesterProfileStyles.requesterLevel}>
                  {requester.requestLevel}
                </Text>
                <Text style={requesterProfileStyles.requesterPhilosophy}>
                  {requester.requestPhilosophy}
                </Text>

                {/* Stats Section */}
                <View style={requesterProfileStyles.statsContainer}>
                  <View style={requesterProfileStyles.statItem}>
                    <Text style={requesterProfileStyles.statNumber}>
                      {requester.totalRequests}
                    </Text>
                    <Text style={requesterProfileStyles.statLabel}>
                      Requests
                    </Text>
                  </View>
                  <View style={requesterProfileStyles.statSeparator} />
                  <View style={requesterProfileStyles.statItem}>
                    <Text style={requesterProfileStyles.statNumber}>
                      {requester.completedRequests}
                    </Text>
                    <Text style={requesterProfileStyles.statLabel}>
                      Fulfilled
                    </Text>
                  </View>
                </View>

                {/* Additional Info Section (Joined Date, Most Liked, Categories, Supporter) */}
                <View style={requesterProfileStyles.infoBlock}>
                  <View style={requesterProfileStyles.infoRow}>
                    <Text style={requesterProfileStyles.infoLabel}>
                      Joined:
                    </Text>
                    <Text style={requesterProfileStyles.infoValue}>
                      {requester.joinedDate}
                    </Text>
                  </View>
                  {requester.mostLikedRequest && (
                    <View style={requesterProfileStyles.infoRow}>
                      <Text style={requesterProfileStyles.infoLabel}>
                        Top Request:
                      </Text>
                      <Text style={requesterProfileStyles.infoValueTitle}>
                        {toSentenceCase(requester.mostLikedRequest.title)}
                      </Text>
                    </View>
                  )}
                  {requester.requestCategories &&
                    requester.requestCategories.length > 0 && (
                      <View style={requesterProfileStyles.infoRow}>
                        <Text style={requesterProfileStyles.infoLabel}>
                          Interests:
                        </Text>
                        <View
                          style={requesterProfileStyles.categoryChipsContainer}
                        >
                          {requester.requestCategories.map(
                            (category, index) => (
                              <View
                                key={index}
                                style={requesterProfileStyles.categoryChip}
                              >
                                <Text
                                  style={
                                    requesterProfileStyles.categoryChipText
                                  }
                                >
                                  {category.replace(" ", "")}
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      </View>
                    )}
                  {requester.isSupporter && (
                    <View style={requesterProfileStyles.infoRow}>
                      <Text style={requesterProfileStyles.infoLabel}>
                        Support:
                      </Text>
                      <Text style={requesterProfileStyles.infoValue}>
                        Patron (Donated ${requester.donatedAmount})
                      </Text>
                    </View>
                  )}
                  {requester.communityThankYous > 0 && (
                    <View style={requesterProfileStyles.infoRow}>
                      <Text style={requesterProfileStyles.infoLabel}>
                        Thanks:
                      </Text>
                      <Text style={requesterProfileStyles.infoValue}>
                        {requester.communityThankYous} Creator Thanks
                      </Text>
                    </View>
                  )}
                </View>

                {/* Social Links */}
                {(requester.publicProfileLink ||
                  (requester.socialHandles &&
                    Object.keys(requester.socialHandles).length > 0)) && (
                  <View style={requesterProfileStyles.socialLinksBlock}>
                    <Text style={requesterProfileStyles.sectionTitle}>
                      Connect
                    </Text>
                    <View style={requesterProfileStyles.socialLinksRow}>
                      {requester.publicProfileLink && (
                        <TouchableOpacity
                          onPress={() =>
                            handleLinkPress(requester.publicProfileLink)
                          }
                          style={requesterProfileStyles.socialIconContainer}
                          accessibilityLabel="Public profile link"
                        >
                          <Globe size={24} color={COLORS.textLightGray} />
                        </TouchableOpacity>
                      )}
                      {Object.entries(requester.socialHandles).map(
                        ([platform, handle]) => (
                          <TouchableOpacity
                            key={platform}
                            onPress={() =>
                              handleLinkPress(
                                `https://${platform}.com/${handle.replace(
                                  "@",
                                  ""
                                )}`
                              )
                            }
                            style={requesterProfileStyles.socialIconContainer}
                            accessibilityLabel={`${platform} profile link`}
                          >
                            {getSocialIcon(platform)}
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>
                )}

                {/* Interactive Buttons - Moved to be more integrated */}
                <View style={requesterProfileStyles.interactiveButtons}>
                  <TouchableOpacity
                    style={requesterProfileStyles.actionButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      alert("Thanks sent!");
                    }}
                    accessibilityLabel="Send thanks to this requester"
                  >
                    <Text style={requesterProfileStyles.actionButtonText}>
                      Send Thanks
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={requesterProfileStyles.actionButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      onClose();
                      alert("Initiating similar request...");
                    }}
                    accessibilityLabel="Make a similar request based on this requester's profile"
                  >
                    <Text style={requesterProfileStyles.actionButtonText}>
                      Make Similar Request
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Flip to back button */}
                {requestedVideos.length > 0 && (
                  <TouchableOpacity
                    onPress={flipToBack}
                    style={requesterProfileStyles.flipButton}
                    accessibilityLabel="View requested videos"
                  >
                    <Text style={requesterProfileStyles.flipButtonText}>
                      View Requested Videos
                    </Text>
                    <ArrowRight
                      size={20}
                      color={COLORS.cardBackground}
                      style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                )}

                {/* Bottom decorative element */}
                <View style={requesterProfileStyles.bottomShapeContainer}>
                  <View style={requesterProfileStyles.bottomShapeMain} />
                  {/* Fixed typo here */}
                  <View style={requesterProfileStyles.bottomShapeAccent} />
                </View>
              </ScrollView>
            </Animated.View>

            {/* Back Side */}
            <Animated.View
              style={[
                requesterProfileStyles.flipCard,
                requesterProfileStyles.flipCardBack,
                { transform: [{ rotateY: rotateYBack }] },
                showFrontSide && { opacity: 0 }, // Hide back when showing front
              ]}
            >
              <ScrollView
                contentContainerStyle={requesterProfileStyles.modalView}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onClose();
                  }}
                  style={requesterProfileStyles.closeButton}
                  accessibilityLabel="Close requester profile"
                >
                  <X size={20} color={COLORS.textLightGray} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={flipToFront}
                  style={requesterProfileStyles.backFlipButton}
                  accessibilityLabel="Go back to requester profile"
                >
                  <ArrowLeft
                    size={20}
                    color={COLORS.cardBackground}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={requesterProfileStyles.flipButtonText}>
                    Back to Profile
                  </Text>
                </TouchableOpacity>

                <Text style={requesterProfileStyles.modalTitle}>
                  {requester.name}'s Requests
                </Text>
                <Text style={requesterProfileStyles.totalRequestsText}>
                  Total: {requester.totalRequests} requests,{" "}
                  {requester.completedRequests} fulfilled
                </Text>

                {requestedVideos.length > 0 ? (
                  <FlatList
                    data={requestedVideos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={requesterProfileStyles.requestedVideoCard}>
                        <Image
                          source={{ uri: item.thumbnail }}
                          style={requesterProfileStyles.requestedVideoThumbnail}
                          accessibilityLabel={`Thumbnail for ${item.title}`}
                        />
                        <View style={requesterProfileStyles.requestedVideoInfo}>
                          <Text
                            style={requesterProfileStyles.requestedVideoTitle}
                          >
                            {toSentenceCase(item.title)}
                          </Text>
                          <Text
                            style={requesterProfileStyles.requestedVideoMeta}
                          >
                            {item.duration} · {item.time}
                          </Text>
                        </View>
                      </View>
                    )}
                    contentContainerStyle={
                      requesterProfileStyles.requestedVideosList
                    }
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={requesterProfileStyles.emptyStateContainer}>
                    <Text style={requesterProfileStyles.emptyStateText}>
                      This requester hasn't made any public requests yet.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

// CreatorModal component: Displays detailed information about a video creator.
function CreatorModal({ isVisible, onClose, creator }) {
  const [showFrontSide, setShowFrontSide] = useState(true);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Reset flip animation and state when modal opens/closes
  useEffect(() => {
    if (isVisible) {
      setShowFrontSide(true);
      flipAnimation.setValue(0); // Start at 0 for the front side
    }
  }, [isVisible, flipAnimation]);

  const flipToBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 500, // Duration of the flip animation
      useNativeDriver: true,
    }).start(() => setShowFrontSide(false)); // Once flipped, set state to show back
  }, [flipAnimation]);

  const flipToFront = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 500, // Duration of the flip animation
      useNativeDriver: true,
    }).start(() => setShowFrontSide(true)); // Once flipped, set state to show front
  }, [flipAnimation]);

  const rotateYFront = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Front rotates from 0 to 180
  });

  const rotateYBack = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"], // Back rotates from 180 to 360 (effectively 0)
  });

  // Filter videos created by this creator
  const createdVideos = useMemo(() => {
    if (!creator || !creator.id) return [];
    return VIDEOS.filter((video) => video.creator === creator.id);
  }, [creator]);

  // Helper function to get the appropriate social icon
  const getSocialIcon = useCallback((platform) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return (
          <Feather name="youtube" size={24} color={COLORS.textLightGray} />
        );
      case "twitter":
        return (
          <Feather name="twitter" size={24} color={COLORS.textLightGray} />
        );
      case "instagram":
        return (
          <Feather name="instagram" size={24} color={COLORS.textLightGray} />
        );
      case "linkedin":
        return (
          <Feather name="linkedin" size={24} color={COLORS.textLightGray} />
        );
      default:
        return <Feather name="globe" size={24} color={COLORS.textLightGray} />;
    }
  }, []);

  const handleLinkPress = useCallback((url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  }, []);

  if (!creator) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Creator Profile Modal"
    >
      <View style={creatorProfileStyles.centeredView}>
        <BlurView
          intensity={80}
          tint="dark"
          style={creatorProfileStyles.modalBlur}
        >
          <View style={creatorProfileStyles.flipCardContainer}>
            {/* Front Side */}
            <Animated.View
              style={[
                creatorProfileStyles.flipCard,
                creatorProfileStyles.flipCardFront,
                { transform: [{ rotateY: rotateYFront }] },
                !showFrontSide && { opacity: 0 }, // Hide front when showing back
              ]}
            >
              <ScrollView
                contentContainerStyle={creatorProfileStyles.modalView}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onClose();
                  }}
                  style={creatorProfileStyles.closeButton}
                  accessibilityLabel="Close creator profile"
                >
                  <X size={20} color={COLORS.textLightGray} />
                </TouchableOpacity>
                {/* Top decorative element (simulating ID card top design) */}
                <View style={creatorProfileStyles.topShapeContainer}>
                  <View style={creatorProfileStyles.topShapeMain} />
                  <View style={creatorProfileStyles.topShapeAccent} />
                </View>
                {/* Central Avatar */}
                <Image
                  source={{ uri: creator.avatar }}
                  style={[
                    creatorProfileStyles.creatorAvatar,
                    creatorProfileStyles.goldBorder,
                  ]}
                  accessibilityLabel={`${creator.name}'s profile picture`}
                />
                {/* Creator Name and Role/Verified Status */}
                <Text style={creatorProfileStyles.creatorName}>
                  {creator.name}
                </Text>
                <Text style={creatorProfileStyles.creatorRole}>
                  Content Architect
                </Text>{" "}
                {/* Hardcoded role */}
                {creator.isVerified && (
                  <CheckCircle
                    size={20}
                    color={COLORS.primaryAccent}
                    style={creatorProfileStyles.verifiedBadge}
                    accessibilityLabel="Verified creator"
                  />
                )}
                {/* Stats Section */}
                <View style={creatorProfileStyles.statsContainer}>
                  <View style={creatorProfileStyles.statItem}>
                    <Text style={creatorProfileStyles.statNumber}>
                      {createdVideos.length}
                    </Text>
                    <Text style={creatorProfileStyles.statLabel}>Videos</Text>
                  </View>
                  <View style={creatorProfileStyles.statSeparator} />
                  <View style={creatorProfileStyles.statItem}>
                    <Text style={creatorProfileStyles.statNumber}>
                      {creator.followers / 1000}K
                    </Text>
                    <Text style={creatorProfileStyles.statLabel}>
                      Followers
                    </Text>
                  </View>
                </View>
                {/* Additional Info Section (Bio, Quote, AI Status) */}
                <View style={creatorProfileStyles.infoBlock}>
                  <View style={creatorProfileStyles.infoRow}>
                    <Text style={creatorProfileStyles.infoLabel}>Bio:</Text>
                    <Text style={creatorProfileStyles.infoValue}>
                      {creator.bio}
                    </Text>
                  </View>
                  <View style={creatorProfileStyles.infoRow}>
                    <Text style={creatorProfileStyles.infoLabel}>
                      Philosophy:
                    </Text>
                    <Text style={creatorProfileStyles.infoValueQuote}>
                      "{creator.quote}"
                    </Text>
                  </View>
                  <View style={creatorProfileStyles.infoRow}>
                    <Text style={creatorProfileStyles.infoLabel}>
                      AI-Enhanced:
                    </Text>
                    <Text style={creatorProfileStyles.infoValue}>
                      {creator.isAIenhanced ? "Yes" : "No"}
                    </Text>
                  </View>
                </View>
                {/* Social Links */}
                {(creator.portfolioUrl ||
                  (creator.socialLinks && creator.socialLinks.length > 0)) && (
                  <View style={creatorProfileStyles.socialLinksBlock}>
                    <Text style={creatorProfileStyles.sectionTitle}>
                      Connect
                    </Text>
                    <View style={creatorProfileStyles.socialLinksRow}>
                      {creator.portfolioUrl && (
                        <TouchableOpacity
                          onPress={() => handleLinkPress(creator.portfolioUrl)}
                          style={creatorProfileStyles.socialIconContainer}
                          accessibilityLabel="Creator's portfolio"
                        >
                          <Briefcase size={24} color={COLORS.textLightGray} />
                        </TouchableOpacity>
                      )}
                      {creator.socialLinks.map((link, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleLinkPress(link.url)}
                          style={creatorProfileStyles.socialIconContainer}
                          accessibilityLabel={`${link.platform} profile`}
                        >
                          {getSocialIcon(link.platform)}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                {/* Interactive Buttons */}
                <View style={creatorProfileStyles.interactiveButtons}>
                  {creator.supportUrl && (
                    <TouchableOpacity
                      style={creatorProfileStyles.actionButton}
                      onPress={() => handleLinkPress(creator.supportUrl)}
                      accessibilityLabel={`Support ${creator.name}`}
                    >
                      <Text style={creatorProfileStyles.actionButtonText}>
                        Support Creator
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={creatorProfileStyles.actionButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      alert(`Following ${creator.name} for updates!`);
                    }}
                    accessibilityLabel={`Follow ${creator.name} for updates`}
                  >
                    <Text style={creatorProfileStyles.actionButtonText}>
                      Follow Creator
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Flip to back button */}
                {createdVideos.length > 0 && (
                  <TouchableOpacity
                    onPress={flipToBack}
                    style={creatorProfileStyles.flipButton}
                    accessibilityLabel="View created videos"
                  >
                    <Text style={creatorProfileStyles.flipButtonText}>
                      View Created Videos
                    </Text>
                    <ArrowRight
                      size={20}
                      color={COLORS.cardBackground}
                      style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                )}
                {/* Bottom decorative element */}
                <View style={creatorProfileStyles.bottomShapeContainer}>
                  <View style={creatorProfileStyles.bottomShapeMain} />
                  {/* Fixed typo here */}
                  <View style={creatorProfileStyles.bottomShapeAccent} />
                </View>
              </ScrollView>
            </Animated.View>

            {/* Back Side */}
            <Animated.View
              style={[
                creatorProfileStyles.flipCard,
                creatorProfileStyles.flipCardBack,
                { transform: [{ rotateY: rotateYBack }] },
                showFrontSide && { opacity: 0 }, // Hide back when showing front
              ]}
            >
              <ScrollView
                contentContainerStyle={creatorProfileStyles.modalView}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onClose();
                  }}
                  style={creatorProfileStyles.closeButton}
                  accessibilityLabel="Close creator profile"
                >
                  <X size={20} color={COLORS.textLightGray} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={flipToFront}
                  style={creatorProfileStyles.backFlipButton}
                  accessibilityLabel="Go back to creator profile"
                >
                  <ArrowLeft
                    size={20}
                    color={COLORS.cardBackground}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={creatorProfileStyles.flipButtonText}>
                    Back to Profile
                  </Text>
                </TouchableOpacity>

                <Text style={creatorProfileStyles.modalTitle}>
                  {creator.name}'s Videos
                </Text>
                <Text style={creatorProfileStyles.totalVideosText}>
                  Total: {createdVideos.length} videos
                </Text>

                {createdVideos.length > 0 ? (
                  <FlatList
                    data={createdVideos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={creatorProfileStyles.createdVideoCard}>
                        <Image
                          source={{ uri: item.thumbnail }}
                          style={creatorProfileStyles.createdVideoThumbnail}
                          accessibilityLabel={`Thumbnail for ${item.title}`}
                        />
                        <View style={creatorProfileStyles.createdVideoInfo}>
                          <Text style={creatorProfileStyles.createdVideoTitle}>
                            {toSentenceCase(item.title)}
                          </Text>
                          <Text style={creatorProfileStyles.createdVideoMeta}>
                            {item.duration} · {item.time}
                          </Text>
                        </View>
                      </View>
                    )}
                    contentContainerStyle={
                      creatorProfileStyles.createdVideosList
                    }
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={creatorProfileStyles.emptyStateContainer}>
                    <Text style={creatorProfileStyles.emptyStateText}>
                      This creator hasn't published any videos yet.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

// NEW COMPONENT: ReportModal
function ReportModal({ isVisible, onClose, videoData }) {
  if (!videoData) return null;

  const [reportReason, setReportReason] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (isVisible) {
      setReportReason("");
      setComments("");
    }
  }, [isVisible, videoData]);

  const reportReasons = useMemo(
    () => [
      "Inappropriate Content",
      "Spam or Misleading",
      "Hate Speech or Harassment",
      "Violent or Abusive Content",
      "Copyright Infringement",
      "Other",
    ],
    []
  );

  const handleSubmitReport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (!reportReason) {
      // TODO: Replace with a custom, non-blocking toast notification
      alert("Please select a report reason.");
      return;
    }
    console.log(
      `Reporting video "${videoData.title}" (ID: ${videoData.id}) for:`
    );
    console.log(`Reason: ${reportReason}`);
    if (comments) {
      console.log(`Comments: ${comments}`);
    }
    // TODO: Replace with a custom, non-blocking toast notification
    alert(
      `Report for "${toSentenceCase(
        videoData.title
      )}" submitted successfully! Thank you for helping us keep the community safe.`
    ); // Apply sentence case here
    onClose();
  }, [reportReason, comments, videoData, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Report Video Modal"
    >
      <View style={reportModalStyles.centeredView}>
        <BlurView
          intensity={80}
          tint="dark"
          style={reportModalStyles.modalBlur}
        >
          <ScrollView
            contentContainerStyle={reportModalStyles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={reportModalStyles.closeButton}
              accessibilityLabel="Close report modal"
            >
              <X size={20} color={COLORS.textLightGray} />
            </TouchableOpacity>

            <Text style={reportModalStyles.modalTitle}>Report Video</Text>
            <Text style={reportModalStyles.videoTitleText}>
              "{toSentenceCase(videoData.title)}"
            </Text>

            <Text style={reportModalStyles.sectionLabel}>
              Reason for Reporting
            </Text>
            <View style={reportModalStyles.reasonOptionsContainer}>
              {reportReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    reportModalStyles.reasonButton,
                    reportReason === reason &&
                      reportModalStyles.reasonButtonSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setReportReason(reason);
                  }}
                  accessibilityLabel={`Select report reason: ${reason}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: reportReason === reason }}
                >
                  <Text
                    style={[
                      reportModalStyles.reasonButtonText,
                      reportReason === reason &&
                        reportModalStyles.reasonButtonTextSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={reportModalStyles.sectionLabel}>
              Additional Comments (Optional)
            </Text>
            <TextInput
              style={[
                reportModalStyles.textInput,
                reportModalStyles.multilineInput,
              ]}
              placeholder="Provide more details..."
              placeholderTextColor={COLORS.textMediumGray}
              value={comments}
              onChangeText={setComments}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
              accessibilityLabel="Additional comments for report"
              accessibilityHint="Optional text input for more details on the report"
            />

            <TouchableOpacity
              style={reportModalStyles.submitButton}
              onPress={handleSubmitReport}
              disabled={!reportReason}
              accessibilityLabel="Submit report"
              accessibilityHint="Submits the video report to the moderation team"
            >
              <Text style={reportModalStyles.submitButtonText}>
                Submit Report
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
}

// NEW COMPONENT: RequestSimilarVideoModal
function RequestSimilarVideoModal({ isVisible, onClose, originalVideoData }) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [suggestedCreator, setSuggestedCreator] = useState("");
  const [notifyOriginalRequester, setNotifyOriginalRequester] = useState(true);

  useEffect(() => {
    if (isVisible && originalVideoData) {
      setNewTitle(`Similar to: ${toSentenceCase(originalVideoData.title)}`); // Apply sentence case here
      setNewDescription(
        `I'd like a video similar to "${toSentenceCase(
          originalVideoData.title
        )}" by ${originalVideoData.creator}, but with a focus on...`
      ); // Apply sentence case here
    } else {
      setNewTitle("");
      setNewDescription("");
    }
  }, [isVisible, originalVideoData]);

  const handleSubmitSimilarRequest = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (!newTitle.trim() || !newDescription.trim()) {
      // TODO: Replace with a custom, non-blocking toast notification
      alert(
        "Please provide a title and description for your similar video request."
      );
      return;
    }
    console.log("Submitting similar video request:");
    console.log(`Original Video ID: ${originalVideoData.id}`);
    console.log(`New Title: ${newTitle}`);
    console.log(`New Description: ${newDescription}`);
    if (suggestedCreator) {
      console.log(`Suggested Creator: ${suggestedCreator}`);
    }
    console.log(
      `Notify Original Requester (${originalVideoData.requestedBy}): ${notifyOriginalRequester}`
    );

    // TODO: Replace with a custom, non-blocking toast notification
    alert(
      `Your request for a similar video to "${toSentenceCase(
        originalVideoData.title
      )}" has been submitted!`
    ); // Apply sentence case here
    onClose();
  }, [
    newTitle,
    newDescription,
    suggestedCreator,
    notifyOriginalRequester,
    originalVideoData,
    onClose,
  ]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Request Similar Video Modal"
    >
      <View style={requestSimilarModalStyles.centeredView}>
        <BlurView
          intensity={80}
          tint="dark"
          style={requestSimilarModalStyles.modalBlur}
        >
          <ScrollView
            contentContainerStyle={requestSimilarModalStyles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={requestSimilarModalStyles.closeButton}
              accessibilityLabel="Close similar video request modal"
            >
              <X size={20} color={COLORS.textLightGray} />
            </TouchableOpacity>

            <Text style={requestSimilarModalStyles.modalTitle}>
              Request Similar Video
            </Text>
            <Text style={requestSimilarModalStyles.originalVideoContext}>
              Based on:{" "}
              <Text style={requestSimilarModalStyles.originalVideoTitle}>
                {toSentenceCase(originalVideoData?.title)}
              </Text>{" "}
              by{" "}
              <Text style={requestSimilarModalStyles.originalVideoCreator}>
                {originalVideoData?.creator}
              </Text>
            </Text>

            <View style={requestSimilarModalStyles.inputGroup}>
              <Text style={requestSimilarModalStyles.inputLabel}>
                New Video Title
              </Text>
              <TextInput
                style={requestSimilarModalStyles.textInput}
                placeholder="A concise title for your similar video idea"
                placeholderTextColor={COLORS.textMediumGray}
                value={newTitle}
                onChangeText={setNewTitle}
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                accessibilityLabel="New video title input"
                accessibilityHint="Enter a title for the similar video request"
              />
            </View>

            <View style={requestSimilarModalStyles.inputGroup}>
              <Text style={requestSimilarModalStyles.inputLabel}>
                Detailed Description
              </Text>
              <TextInput
                style={[
                  requestSimilarModalStyles.textInput,
                  requestSimilarModalStyles.multilineInput,
                ]}
                placeholder="Specify what aspects you'd like to be similar or different..."
                placeholderTextColor={COLORS.textMediumGray}
                value={newDescription}
                onChangeText={setNewDescription}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                accessibilityLabel="Detailed description for similar video"
                accessibilityHint="Explain what aspects should be similar or different from the original video"
              />
            </View>

            <View style={requestSimilarModalStyles.inputGroup}>
              <Text style={requestSimilarModalStyles.inputLabel}>
                Suggest a Creator (Optional)
              </Text>
              <TextInput
                style={requestSimilarModalStyles.textInput}
                placeholder="e.g., JohnDoe, another similar creator"
                placeholderTextColor={COLORS.textMediumGray}
                value={suggestedCreator}
                onChangeText={setSuggestedCreator}
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                accessibilityLabel="Suggested creator input"
                accessibilityHint="Optionally suggest a specific creator for this video"
              />
            </View>

            <View style={requestSimilarModalStyles.inputGroup}>
              <Text style={requestSimilarModalStyles.inputLabel}>
                Notification
              </Text>
              <View style={requestSimilarModalStyles.privacyToggleContainer}>
                <Text style={requestSimilarModalStyles.privacyToggleText}>
                  Notify original requester ({originalVideoData?.requestedBy})
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: COLORS.primaryAccent }}
                  thumbColor={Platform.OS === "android" ? "#f4f3f2" : "#f4f3f4"} // For Android thumb color
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setNotifyOriginalRequester(value);
                  }}
                  value={notifyOriginalRequester}
                  accessibilityLabel={`Toggle to notify original requester ${originalVideoData?.requestedBy}`}
                  accessibilityHint="Toggle to notify the original requester of this similar video request"
                />
              </View>
            </View>

            <TouchableOpacity
              style={requestSimilarModalStyles.submitButton}
              onPress={handleSubmitSimilarRequest}
              disabled={!newTitle.trim() || !newDescription.trim()}
              accessibilityLabel="Submit similar request"
              accessibilityHint="Submits your request for a similar video"
            >
              <Text style={requestSimilarModalStyles.submitButtonText}>
                Submit Similar Request
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
}

// VideoContextMenu component: Provides options for a video (bookmark, follow, report).
function VideoContextMenu({
  isVisible,
  onClose,
  videoData,
  onReport,
  onRequestSimilar,
}) {
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      animatedOpacity.setValue(0);
    }
  }, [isVisible, animatedOpacity]);

  if (!videoData) return null;

  const [isBookmarked, setIsBookmarked] = useState(false); // Local state for bookmarking
  const [isFollowing, setIsFollowing] = useState(false); // Local state for following creator

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(
      `Video ${videoData.id} ${isBookmarked ? "unbookmarked" : "bookmarked"}`
    );
    setIsBookmarked(!isBookmarked);
    onClose();
  }, [isBookmarked, videoData, onClose]);

  const handleFollow = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(
      `Creator ${videoData.creator} ${isFollowing ? "unfollowed" : "followed"}`
    );
    setIsFollowing(!isFollowing);
    onClose();
  }, [isFollowing, videoData, onClose]);

  const handleRequestSimilar = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRequestSimilar(videoData);
    onClose();
  }, [onRequestSimilar, videoData, onClose]);

  const handleReport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onReport(videoData);
    onClose();
  }, [onReport, videoData, onClose]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Video Context Menu"
    >
      <Pressable
        style={contextMenuStyles.overlay}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
        accessibilityLabel="Close context menu"
      >
        <Animated.View
          style={[
            contextMenuStyles.menuContainer,
            { opacity: animatedOpacity },
          ]}
        >
          <TouchableOpacity
            onPress={handleBookmark}
            style={contextMenuStyles.menuItem}
            accessibilityLabel={
              isBookmarked ? "Remove bookmark from video" : "Bookmark video"
            }
          >
            <Text style={contextMenuStyles.menuItemText}>
              {isBookmarked ? "Remove Bookmark" : "Bookmark Video"}
            </Text>
            <MaterialIcons
              name={isBookmarked ? "bookmark" : "bookmark-border"}
              size={20}
              color={COLORS.textLightGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFollow}
            style={contextMenuStyles.menuItem}
            accessibilityLabel={
              isFollowing
                ? `Unfollow ${videoData.creator}`
                : `Follow ${videoData.creator}`
            }
          >
            <Text style={contextMenuStyles.menuItemText}>
              {isFollowing ? "Unfollow Creator" : "Follow Creator"}
            </Text>
            <MaterialIcons
              name={isFollowing ? "person" : "person-add"}
              size={20}
              color={COLORS.textLightGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRequestSimilar}
            style={contextMenuStyles.menuItem}
            accessibilityLabel="Request a similar video"
          >
            <Text style={contextMenuStyles.menuItemText}>
              Request Similar Video
            </Text>
            <MaterialIcons
              name="add-comment"
              size={20}
              color={COLORS.textLightGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReport}
            style={contextMenuStyles.menuItem}
            accessibilityLabel="Report this video"
          >
            <Text style={contextMenuStyles.menuItemText}>Report</Text>
            <MaterialIcons name="flag" size={20} color={COLORS.textLightGray} />
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// FilterModal component: Allows users to filter and sort videos.
function FilterModal({ isVisible, onClose, onApplyFilters, currentFilters }) {
  const [videoType, setVideoType] = useState(currentFilters.videoType || "All");
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "Newest");
  const [duration, setDuration] = useState(currentFilters.duration || "All");
  const [creatorFilters, setCreatorFilters] = useState(
    currentFilters.creatorFilters || []
  );
  const [topics, setTopics] = useState(currentFilters.topics || []);

  const handleToggleCreatorFilter = useCallback((filter) => {
    setCreatorFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleApply = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onApplyFilters({ videoType, sortBy, duration, creatorFilters, topics });
    onClose();
  }, [
    videoType,
    sortBy,
    duration,
    creatorFilters,
    topics,
    onApplyFilters,
    onClose,
  ]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVideoType("All");
    setSortBy("Newest");
    setDuration("All");
    setCreatorFilters([]);
    setTopics([]);
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Filter and Sort Videos Modal"
    >
      <Pressable
        style={filterModalStyles.overlay}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
        accessibilityLabel="Close filter modal"
      >
        <BlurView
          intensity={80}
          tint="dark"
          style={filterModalStyles.modalBlur}
        >
          <View style={filterModalStyles.modalContainer}>
            <View style={filterModalStyles.modalHeader}>
              <Text style={filterModalStyles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                style={filterModalStyles.closeButton}
                accessibilityLabel="Close filter modal"
              >
                <X size={24} color={COLORS.textLightGray} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={filterModalStyles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={filterModalStyles.sectionTitle}>Video Type</Text>
              <View style={filterModalStyles.optionsContainer}>
                {["All", "Requested", "Originals", "AI-enhanced"].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        filterModalStyles.optionButton,
                        videoType === type &&
                          filterModalStyles.optionButtonSelected,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setVideoType(type);
                      }}
                      accessibilityLabel={`Filter by video type: ${type}`}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: videoType === type }}
                    >
                      <Text
                        style={[
                          filterModalStyles.optionText,
                          videoType === type &&
                            filterModalStyles.optionTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <Text style={filterModalStyles.sectionTitle}>Sort By</Text>
              <View style={filterModalStyles.optionsContainer}>
                {[
                  "Newest",
                  "Most Popular",
                  "Most Requested",
                  "Recently Fulfilled",
                ].map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      filterModalStyles.optionButton,
                      sortBy === sort && filterModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSortBy(sort);
                    }}
                    accessibilityLabel={`Sort by: ${sort}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: sortBy === sort }}
                  >
                    <Text
                      style={[
                        filterModalStyles.optionText,
                        sortBy === sort && filterModalStyles.optionTextSelected,
                      ]}
                    >
                      {sort}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={filterModalStyles.sectionTitle}>Duration</Text>
              <View style={filterModalStyles.optionsContainer}>
                {["All", "Under 3 min", "3-10 min", "10+ min"].map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    style={[
                      filterModalStyles.optionButton,
                      duration === dur &&
                        filterModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setDuration(dur);
                    }}
                    accessibilityLabel={`Filter by duration: ${dur}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: duration === dur }}
                  >
                    <Text
                      style={[
                        filterModalStyles.optionText,
                        duration === dur &&
                          filterModalStyles.optionTextSelected,
                      ]}
                    >
                      {dur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={filterModalStyles.sectionTitle}>
                Creator Filters
              </Text>
              <View style={filterModalStyles.optionsContainer}>
                {["Verified", "I Follow", "Full-Time Creators"].map(
                  (filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={[
                        filterModalStyles.optionButton,
                        creatorFilters.includes(filter) &&
                          filterModalStyles.optionButtonSelected,
                      ]}
                      onPress={() => handleToggleCreatorFilter(filter)}
                      accessibilityLabel={`Toggle creator filter: ${filter}`}
                      accessibilityRole="checkbox"
                      accessibilityState={{
                        checked: creatorFilters.includes(filter),
                      }}
                    >
                      <Text
                        style={[
                          filterModalStyles.optionText,
                          creatorFilters.includes(filter) &&
                            filterModalStyles.optionTextSelected,
                        ]}
                      >
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <Text style={filterModalStyles.sectionTitle}>Topics</Text>
              <View style={filterModalStyles.optionsContainer}>
                <TouchableOpacity
                  style={filterModalStyles.optionButton}
                  onPress={() =>
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }
                  accessibilityLabel="Select topics (Coming Soon)"
                >
                  <Text style={filterModalStyles.optionText}>
                    Select Topics (Coming Soon)
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={filterModalStyles.buttonRow}>
              <TouchableOpacity
                style={filterModalStyles.resetButton}
                onPress={handleReset}
                accessibilityLabel="Reset all filters"
              >
                <Text style={filterModalStyles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={filterModalStyles.applyButton}
                onPress={handleApply}
                accessibilityLabel="Apply filters"
              >
                <Text style={filterModalStyles.applyButtonText}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

// VideoCard component: Displays a single video item in the feed.
function VideoCard({
  item,
  onCreatorPress,
  onReport,
  onRequestSimilar,
  onRequesterPress,
}) {
  // Added onRequesterPress to props
  const scale = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  // Animation for the "Requested" badge pulse effect
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (item.requested) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03, // Slightly less aggressive pulse
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [item.requested, pulseAnim]);

  // Handle press-in animation for the card
  const onPressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 1.01, useNativeDriver: true }).start(); // Subtler scale effect
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale]);

  // Handle press-out animation for the card
  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }, [scale]);

  // Show the context menu
  const handleMorePress = useCallback(() => {
    setShowContextMenu(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true); // Still indicate load attempt finished
    setImageError(true);
  });

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityLabel={`View video details for ${toSentenceCase(
          item.title
        )}`}
      >
        <View style={styles.thumbContainer}>
          {!imageLoaded && (
            <View style={styles.thumbnailPlaceholder}>
              <ActivityIndicator size="large" color={COLORS.primaryAccent} />
            </View>
          )}
          {imageError ? (
            <Image
              source={{
                uri: `https://placehold.co/400x220/${COLORS.cardBackground.substring(
                  1
                )}/${COLORS.primaryAccent.substring(1)}?text=Video+Error`,
              }}
              style={styles.thumbnail}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            style={styles.imageFog}
          />
          {item.requested && (
            <Animated.View
              style={[styles.badge, { transform: [{ scale: pulseAnim }] }]}
            >
              <Feather
                name="edit-2"
                size={12}
                color={COLORS.cardBackground}
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeText}>Requested</Text>
            </Animated.View>
          )}
          <View style={styles.duration}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.info}>
        <Text style={styles.title}>{toSentenceCase(item.title)}</Text>
        <Text style={styles.creator}>
          by{" "}
          <Text
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onCreatorPress(item.creator); // Pass the creator's ID (name string)
            }}
            style={styles.creatorName}
            accessibilityLabel={`View profile of ${item.creator}`}
          >
            {item.creator}
          </Text>
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {item.time} · Requested by{" "}
            <Text
              onPress={() => {
                onRequesterPress(item.requestedBy);
              }}
              style={styles.requesterNameLink}
              accessibilityLabel={`Requester: ${item.requestedBy}`}
            >
              {item.requestedBy}
            </Text>
          </Text>
          <Pressable
            onPress={handleMorePress}
            style={styles.moreIconWrapper}
            accessibilityLabel="More options for this video"
          >
            <MaterialIcons
              name="more-vert"
              size={20}
              color={COLORS.textMediumGray}
            />
          </Pressable>
        </View>
      </View>
      <VideoContextMenu
        isVisible={showContextMenu}
        onClose={() => setShowContextMenu(false)}
        videoData={item}
        onReport={onReport}
        onRequestSimilar={onRequestSimilar}
      />
    </Animated.View>
  );
}

// PremiumModal component: Displays premium options/menu.
function PremiumModal({ isVisible, onClose }) {
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, animatedOpacity]);

  const getIcon = useCallback((item) => {
    switch (item) {
      case "Subscriptions":
        return "credit-card";
      case "Guidelines":
        return "book-open";
      case "Switch to Creator":
        return "user-plus";
      case "Logout":
        return "log-out";
      default:
        return "circle";
    }
  }, []);

  const menuItems = useMemo(
    () => [
      {
        name: "Subscriptions",
        action: () => console.log("Go to Subscriptions"),
      },
      { name: "Guidelines", action: () => console.log("Go to Guidelines") },
      {
        name: "Switch to Creator",
        action: () => console.log("Switch to Creator mode"),
      },
      { name: "Logout", action: () => console.log("User Logout") },
    ],
    []
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Premium Options Menu"
    >
      <Pressable
        style={premiumModalStyles.overlay}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
        accessibilityLabel="Close premium menu"
      >
        <Animated.View
          style={[
            premiumModalStyles.modalContainer,
            { opacity: animatedOpacity },
          ]}
        >
          <BlurView intensity={70} tint="dark" style={premiumModalStyles.blur}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  premiumModalStyles.menuItem,
                  index === menuItems.length - 1 &&
                    premiumModalStyles.lastMenuItem,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  item.action();
                  onClose();
                }}
                accessibilityLabel={`${item.name} option`}
              >
                <Feather
                  name={getIcon(item.name)}
                  size={20}
                  color={COLORS.textWhite}
                />
                <Text style={premiumModalStyles.menuItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// BoostModal component
function BoostModal({
  isVisible,
  onClose,
  requestTitle,
  currentBoosts,
  recentBoosters,
}) {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const handleBoost = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const boostValue = customAmount
      ? parseFloat(customAmount)
      : parseFloat(amount);
    if (isNaN(boostValue) || boostValue <= 0) {
      // TODO: Replace with a custom, non-blocking toast notification
      alert("Please enter a valid boost amount.");
      return;
    }
    console.log(`Boosting "${requestTitle}" by $${boostValue}`);
    // TODO: Implement actual boost logic (e.g., API call)
    onClose();
    setAmount("");
    setCustomAmount("");
  }, [amount, customAmount, requestTitle, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Boost Request Modal"
    >
      <Pressable
        style={boostModalStyles.overlay}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
        accessibilityLabel="Close boost request modal"
      >
        <BlurView intensity={80} tint="dark" style={boostModalStyles.modalBlur}>
          <View
            style={boostModalStyles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={boostModalStyles.closeButton}
              accessibilityLabel="Close boost modal"
            >
              <X size={20} color={COLORS.textLightGray} />
            </TouchableOpacity>
            <Text style={boostModalStyles.modalTitle}>Boost Request</Text>
            <Text style={boostModalStyles.requestTitleText}>
              "{toSentenceCase(requestTitle)}"
            </Text>

            <Text style={boostModalStyles.sectionLabel}>Suggested Amounts</Text>
            <View style={boostModalStyles.amountOptionsContainer}>
              {["1", "3", "5"].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    boostModalStyles.amountButton,
                    amount === value && boostModalStyles.amountButtonSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAmount(value);
                    setCustomAmount("");
                  }}
                  accessibilityLabel={`Boost by $${value}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: amount === value }}
                >
                  <Text
                    style={[
                      boostModalStyles.amountButtonText,
                      amount === value &&
                        boostModalStyles.amountButtonTextSelected,
                    ]}
                  >
                    ${value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={boostModalStyles.sectionLabel}>Custom Amount</Text>
            <TextInput
              style={boostModalStyles.customAmountInput}
              placeholder="Enter custom amount"
              placeholderTextColor={COLORS.textMediumGray}
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text);
                setAmount("");
              }}
              keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
              accessibilityLabel="Custom boost amount input"
              accessibilityHint="Enter a custom amount to boost this request"
            />

            <Text style={boostModalStyles.impactText}>
              Your boost adds to the funding and visibility of this request.
            </Text>

            {recentBoosters && recentBoosters.length > 0 && (
              <>
                <Text style={boostModalStyles.sectionLabel}>
                  Recent Boosters
                </Text>
                <View style={boostModalStyles.recentBoostersContainer}>
                  {recentBoosters.slice(0, 3).map((booster, index) => (
                    <Image
                      key={index}
                      source={{ uri: booster.avatar }}
                      style={boostModalStyles.boosterAvatar}
                      accessibilityLabel="Booster avatar"
                    />
                  ))}
                  {recentBoosters.length > 3 && (
                    <Text style={boostModalStyles.moreBoostersText}>
                      +{recentBoosters.length - 3} more
                    </Text>
                  )}
                </View>
              </>
            )}

            <TouchableOpacity
              style={boostModalStyles.boostButton}
              onPress={handleBoost}
              disabled={!amount && !customAmount}
              accessibilityLabel="Boost now button"
              accessibilityHint="Confirm and apply your boost to this request"
            >
              <Text style={boostModalStyles.boostButtonText}>Boost Now</Text>
              <DollarSign size={20} color={COLORS.cardBackground} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

// NEW COMPONENT: CommentModal
function CommentModal({ isVisible, onClose, requestItem }) {
  // Mock comments data for demonstration. In a real app, this would come from a backend.
  const [comments, setComments] = useState([
    {
      id: "c1",
      user: {
        name: "CommenterOne",
        avatar: "https://placehold.co/30x30/101010/C4A77D?text=C1",
      },
      text: "This is a really insightful request! I hope a creator picks it up soon.",
      timestamp: "2 hours ago",
      replies: [
        {
          id: "r1-1",
          user: {
            name: "ReplyGuy",
            avatar: "https://placehold.co/30x30/101010/C4A77D?text=R1",
          },
          text: "Me too! Especially the part about real-world examples.",
          timestamp: "1 hour ago",
        },
      ],
    },
    {
      id: "c2",
      user: {
        name: "AnotherUser",
        avatar: "https://placehold.co/30x30/101010/C4A77D?text=AU",
      },
      text: "Great idea! I'd love to see a video on this. Any specific creators in mind?",
      timestamp: "5 hours ago",
      replies: [],
    },
  ]);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const flatListRef = useRef(null);

  // --- PanResponder for draggable modal ---
  const initialModalHeight = height * 0.95; // Modal now takes 95% of screen height
  const modalOpenPosition = height * 0.05; // Modal stops at 5% from the top

  const panY = useRef(new Animated.Value(height)).current; // Start off-screen at the bottom initially

  // Initial animation when modal becomes visible/invisible
  useEffect(() => {
    if (isVisible) {
      // Animate up from bottom to the 95% height position (5% from top)
      Animated.timing(panY, {
        toValue: modalOpenPosition, // Target Y position
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      // Animate down to close
      Animated.timing(panY, {
        toValue: height, // Animate to bottom of screen (off-screen)
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, panY, height]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // Allow interaction
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond if movement is primarily vertical and significant
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 5
        );
      },
      onPanResponderGrant: () => {
        panY.stopAnimation(); // Stop any ongoing animation
        panY.setOffset(panY._value); // Store the current absolute translateY as an offset
        panY.setValue(0); // Reset the current value to 0, so subsequent moves are relative
      },
      onPanResponderMove: Animated.event(
        [null, { dy: panY }], // Update panY's value with the delta Y
        {
          useNativeDriver: false,
          listener: (event, gestureState) => {
            // Calculate the new absolute Y position
            let newY = panY._offset + gestureState.dy;
            // Clamp the position: cannot go higher than initial open position, can go lower
            newY = Math.max(modalOpenPosition, newY); // Ensure it doesn't go above the target top position
            // Update the animated value, relative to its offset
            panY.setValue(newY - panY._offset);
          },
        }
      ),
      onPanResponderRelease: (_, gestureState) => {
        panY.flattenOffset(); // Add the offset back to the value, so it becomes the absolute Y
        const currentAbsoluteY = panY._value;

        const dismissThreshold = modalOpenPosition + initialModalHeight * 0.3; // Dismiss if dragged down 30% of modal height

        if (gestureState.vy > 0.7 || currentAbsoluteY > dismissThreshold) {
          // Fast flick downwards or dragged past threshold
          Animated.timing(panY, {
            toValue: height, // Animate off-screen downwards
            duration: 300,
            useNativeDriver: false,
            easing: Easing.in(Easing.ease),
          }).start(() => onClose()); // Close the modal after animation
        } else {
          // Snap back to the fully open position
          Animated.spring(panY, {
            toValue: modalOpenPosition,
            bounciness: 0,
            speed: 10,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
          }).start();
        }
      },
    })
  ).current;

  // Scroll to bottom when comments change or modal opens
  useEffect(() => {
    if (isVisible && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [comments, isVisible]);

  const handleAddComment = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (newCommentText.trim()) {
      const newComment = {
        id: `c${Date.now()}`,
        user: {
          name: "CurrentUser",
          avatar: `https://placehold.co/30x30/${COLORS.primaryAccent.substring(
            1
          )}/${COLORS.cardBackground.substring(1)}?text=YOU`,
        }, // Mock current user
        text: newCommentText.trim(),
        timestamp: "Just now",
        replies: [],
      };
      setComments((prev) => [...prev, newComment]);
      setNewCommentText("");
    }
  }, [newCommentText]);

  const handleAddReply = useCallback(
    (parentId) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (replyText.trim()) {
        const newReply = {
          id: `r${Date.now()}`,
          user: {
            name: "CurrentUser",
            avatar: `https://placehold.co/30x30/${COLORS.primaryAccent.substring(
              1
            )}/${COLORS.cardBackground.substring(1)}?text=YOU`,
          }, // Mock current user
          text: replyText.trim(),
          timestamp: "Just now",
        };
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          )
        );
        setReplyToCommentId(null);
        setReplyText("");
      }
    },
    [replyText]
  );

  const renderComment = useCallback(
    ({ item }) => (
      <View style={commentModalStyles.commentContainer}>
        <Image
          source={{ uri: item.user.avatar }}
          style={commentModalStyles.commentAvatar}
        />
        <View style={commentModalStyles.commentContent}>
          <View style={commentModalStyles.commentHeader}>
            <Text style={commentModalStyles.commentUsername}>
              {item.user.name}
            </Text>
            <Text style={commentModalStyles.commentTimestamp}>
              {item.timestamp}
            </Text>
          </View>
          <Text style={commentModalStyles.commentText}>{item.text}</Text>
          <TouchableOpacity
            style={commentModalStyles.replyButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setReplyToCommentId(
                replyToCommentId === item.id ? null : item.id
              );
              setReplyText(""); // Clear reply text when toggling
            }}
            accessibilityLabel={`Reply to ${item.user.name}'s comment`}
          >
            <MessageCircle size={14} color={COLORS.textLightGray} />
            <Text style={commentModalStyles.replyButtonText}>Reply</Text>
          </TouchableOpacity>

          {replyToCommentId === item.id && (
            <View style={commentModalStyles.replyInputContainer}>
              <TextInput
                style={commentModalStyles.replyTextInput}
                placeholder="Write your reply..."
                placeholderTextColor={COLORS.textMediumGray}
                value={replyText}
                onChangeText={setReplyText}
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                returnKeyType="send"
                onSubmitEditing={() => handleAddReply(item.id)}
                autoFocus
                accessibilityLabel="Reply text input"
                accessibilityHint={`Type your reply to ${item.user.name}`}
              />
              <TouchableOpacity
                style={commentModalStyles.sendReplyButton}
                onPress={() => handleAddReply(item.id)}
                disabled={!replyText.trim()}
                accessibilityLabel="Send reply"
              >
                {/* Changed color for better visibility */}
                <Feather
                  name="send"
                  size={18}
                  color={
                    replyText.trim() ? COLORS.textWhite : COLORS.textMediumGray
                  }
                />
              </TouchableOpacity>
            </View>
          )}

          {item.replies && item.replies.length > 0 && (
            <View style={commentModalStyles.repliesContainer}>
              {item.replies.map((reply) => (
                <View key={reply.id} style={commentModalStyles.replyItem}>
                  <Image
                    source={{ uri: reply.user.avatar }}
                    style={commentModalStyles.replyAvatar}
                  />
                  <View style={commentModalStyles.replyContent}>
                    <Text style={commentModalStyles.replyUsername}>
                      {reply.user.name}
                    </Text>
                    <Text style={commentModalStyles.replyText}>
                      {reply.text}
                    </Text>
                    <Text style={commentModalStyles.replyTimestamp}>
                      {reply.timestamp}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    ),
    [replyToCommentId, replyText, handleAddReply]
  );

  return (
    <Modal
      animationType="none" // Controlled by Animated.Value now
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Comments modal" // Generic label for comments modal
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commentModalStyles.keyboardAvoidingView}
      >
        {/* Overlay to close modal when pressing outside, but only if not dragging */}
        <Pressable
          style={commentModalStyles.overlay}
          onPress={onClose}
          accessibilityLabel="Close comments"
        />

        {/* Draggable Comment Modal Container */}
        <Animated.View
          style={[
            commentModalStyles.modalContainer,
            {
              transform: [{ translateY: panY }],
              // Removed fixed top, it's now controlled by translateY
              height: initialModalHeight, // Ensure height is explicitly set
            },
          ]}
          {...panResponder.panHandlers} // Attach pan handlers to the container
        >
          <BlurView
            intensity={80}
            tint="dark"
            style={commentModalStyles.blurContent}
          >
            {" "}
            {/* Apply blur to the content */}
            {/* Draggable bar */}
            <View style={commentModalStyles.draggableBarContainer}>
              <View style={commentModalStyles.draggableBar} />
            </View>
            <Text style={commentModalStyles.modalTitle}>Comments</Text>
            <FlatList
              ref={flatListRef}
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderComment}
              style={commentModalStyles.commentsList}
              contentContainerStyle={commentModalStyles.commentsListContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={commentModalStyles.emptyCommentsContainer}>
                  <Text style={commentModalStyles.emptyCommentsText}>
                    No comments yet. Be the first!
                  </Text>
                </View>
              }
            />
            <View style={commentModalStyles.commentInputContainer}>
              <TextInput
                style={commentModalStyles.mainCommentTextInput}
                placeholder="Add a comment..."
                placeholderTextColor={COLORS.textMediumGray}
                value={newCommentText}
                onChangeText={setNewCommentText}
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                returnKeyType="send"
                onSubmitEditing={handleAddComment}
                accessibilityLabel="New comment text input"
                accessibilityHint="Type your main comment here"
              />
              <TouchableOpacity
                style={commentModalStyles.sendCommentButton}
                onPress={handleAddComment}
                disabled={!newCommentText.trim()}
                accessibilityLabel="Send comment"
              >
                {/* Changed color for better visibility */}
                <Feather
                  name="send"
                  size={20}
                  color={
                    newCommentText.trim()
                      ? COLORS.textWhite
                      : COLORS.textMediumGray
                  }
                />
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// CommunityRequestCard Component
function CommunityRequestCard({ item }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [upvotesCount, setUpvotesCount] = useState(item.upvotes); // State for dynamic upvotes
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked);
  const [isTipped, setIsTipped] = useState(false); // State for tip/heart icon
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false); // State for CommentModal
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Press animation for card
  const onPressIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 1.01, useNativeDriver: true }).start(); // Subtler scale effect
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }, [scale]);

  // Upvote animation
  const upvoteScale = useRef(new Animated.Value(1)).current;
  const handleUpvote = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(upvoteScale, {
        toValue: 1.1,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }), // Subtler scale, snappier feel
      Animated.spring(upvoteScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }),
    ]).start();
    setUpvotesCount((prev) => prev + 1); // Increment upvote count
    console.log(`Upvoted request: ${item.id}`);
    // TODO: Implement actual upvote logic (e.g., API call to increment upvotes)
  }, [item.id, upvoteScale]);

  // Handle Comment button press
  const handleComment = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCommentModal(true); // Open the CommentModal
    console.log("Open comments section for request:", item.id);
  }, [item.id]);

  // Handle Tip button press
  const handleTip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Changed to medium haptic for more emphasis
    setIsTipped((prev) => !prev); // Toggle tipped state
    console.log(
      `Tipping for request: "${item.title}". Tipped status: ${!isTipped}`
    );
    // TODO: Implement actual tipping logic
  }, [item.title, isTipped]);

  // Bookmark toggle
  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsBookmarked(!isBookmarked);
    console.log(`Bookmark toggled for request: ${item.id}`);
    // TODO: Implement actual bookmark logic (e.g., API call to update bookmark status)
  }, [isBookmarked, item.id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true);
    setImageError(true);
  });

  // Truncate description for display
  const truncatedDescription = useMemo(() => {
    return item.description.length > 100
      ? item.description.substring(0, 97) + "..."
      : item.description;
  }, [item.description]);

  return (
    <Animated.View style={[communityStyles.card, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          console.log(`Card pressed: ${item.id}`);
          // TODO: Navigate to a detailed request view
        }}
        accessibilityLabel={`View community request: ${toSentenceCase(
          item.title
        )}`}
      >
        {/* Header */}
        <View style={communityStyles.cardHeader}>
          <Image
            source={{ uri: item.user.avatar }}
            style={communityStyles.userAvatar}
            accessibilityLabel={`${item.user.name}'s avatar`}
          />
          <View style={communityStyles.userInfo}>
            <Text style={communityStyles.username}>{item.user.name}</Text>
            <Text style={communityStyles.timestamp}>{item.timestamp}</Text>
          </View>
          {item.tags && item.tags.length > 0 && (
            <View style={communityStyles.tagBadge}>
              <Text style={communityStyles.tagText}>{item.tags[0]}</Text>
            </View>
          )}
        </View>

        {/* Content Body */}
        <View style={communityStyles.cardBody}>
          <Text style={communityStyles.cardTitle}>
            {toSentenceCase(item.title)}
          </Text>
          <Text style={communityStyles.cardDescription}>
            {truncatedDescription}
          </Text>
          {item.attachments &&
            item.attachments.length > 0 &&
            item.attachments[0].type === "image" && (
              <>
                {!imageLoaded && (
                  <View style={communityStyles.attachedImagePlaceholder}>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primaryAccent}
                    />
                  </View>
                )}
                {imageError ? (
                  <Image
                    source={{
                      uri: `https://placehold.co/200x120/${COLORS.cardBackground.substring(
                        1
                      )}/${COLORS.primaryAccent.substring(1)}?text=Image+Error`,
                    }}
                    style={communityStyles.attachedImage}
                    resizeMode="cover"
                    onError={handleImageError}
                  />
                ) : (
                  <Image
                    source={{ uri: item.attachments[0].uri }}
                    style={communityStyles.attachedImage}
                    resizeMode="cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )}
              </>
            )}
          {item.visibility === "Sponsored Opportunity" && (
            <View style={communityStyles.sponsoredBadge}>
              <Award size={14} color={COLORS.cardBackground} />
              <Text style={communityStyles.sponsoredText}>
                Sponsored Opportunity
              </Text>
            </View>
          )}
        </View>

        {/* Interaction Row */}
        <View style={communityStyles.interactionRow}>
          <TouchableOpacity
            onPress={handleUpvote}
            style={communityStyles.interactionButton}
            accessibilityLabel={`Upvote this request, currently ${upvotesCount} upvotes`}
          >
            <Animated.View style={{ transform: [{ scale: upvoteScale }] }}>
              <ArrowUp size={18} color={COLORS.primaryAccent} />
            </Animated.View>
            <Text style={communityStyles.interactionCount}>{upvotesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleComment}
            style={communityStyles.interactionButton}
            accessibilityLabel={`View comments, currently ${item.comments} comments`}
          >
            <MessageCircle size={18} color={COLORS.textLightGray} />
            <Text style={communityStyles.interactionCount}>
              {item.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowBoostModal(true);
            }}
            style={communityStyles.interactionButton}
            accessibilityLabel={`Boost this request, currently ${item.boosts} boosts`}
          >
            <DollarSign size={18} color={COLORS.secondaryAccent} />
            <Text style={communityStyles.interactionCount}>{item.boosts}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleTip}
            style={communityStyles.interactionButton}
            accessibilityLabel={
              isTipped
                ? `Untip this request`
                : `Tip this request, currently ${item.tips} tips`
            }
          >
            <Heart
              size={18}
              color={isTipped ? "#FF6347" : COLORS.textLightGray}
              fill={isTipped ? "#FF6347" : "none"}
            />
            <Text style={communityStyles.interactionCount}>{item.tips}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBookmark}
            style={communityStyles.interactionButton}
            accessibilityLabel={
              isBookmarked ? "Remove bookmark" : "Bookmark this request"
            }
          >
            <Bookmark
              size={18}
              color={isBookmarked ? COLORS.primaryAccent : COLORS.textLightGray}
              fill={isBookmarked ? COLORS.primaryAccent : "none"}
            />
          </TouchableOpacity>
        </View>
      </Pressable>

      <BoostModal
        isVisible={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        requestTitle={item.title}
        currentBoosts={item.boosts}
        recentBoosters={item.recentBoosters}
      />
      <CommentModal
        isVisible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        requestItem={item}
      />
    </Animated.View>
  );
}

// Main App component: Manages the video feed, search, filters, and modals.
export default function App() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("recent");
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showRequestVideoModal, setShowRequestVideoModal] = useState(false); // New state for the simplified modal
  const [showRequesterProfileModal, setShowRequesterProfileModal] =
    useState(false);
  const [selectedRequester, setSelectedRequester] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [videoForReport, setVideoForReport] = useState(null);
  const [showRequestSimilarVideoModal, setShowRequestSimilarVideoModal] =
    useState(false);
  const [videoForSimilarRequest, setVideoForSimilarRequest] = useState(null);

  const [currentPage, setCurrentPage] = useState("mainFeed");

  const [currentFilters, setCurrentFilters] = useState({
    videoType: "All",
    sortBy: "Newest",
    duration: "All",
    creatorFilters: [],
    topics: [],
  });

  const [communitySearch, setCommunitySearch] = useState("");
  const [communityCategoryFilter, setCommunityCategoryFilter] = useState("All");
  const [communitySortBy, setCommunitySortBy] = useState("Newest");
  const [selectedCommunitySortChip, setSelectedCommunitySortChip] =
    useState("Newest");

  // State for search bar visibility
  const [showMainSearchBar, setShowMainSearchBar] = useState(false);
  const searchInputWidth = useRef(new Animated.Value(0)).current;
  const searchInputOpacity = useRef(new Animated.Value(0)).current;

  // Animate search bar
  useEffect(() => {
    if (showMainSearchBar) {
      Animated.parallel([
        Animated.timing(searchInputWidth, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchInputOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(searchInputWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchInputOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setSearch("")); // Clear search on collapse
    }
  }, [showMainSearchBar, searchInputWidth, searchInputOpacity]);

  // Floating CTA animation for "Make a Request"
  const floatingCTAAnimatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  // New state and animations for the hint text visibility
  const [showHintText, setShowHintText] = useState(false); // Initially hidden
  const hintOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let hideTimer;
    let reappearInterval;

    if (currentPage === "communityRequestsFeed") {
      // Animate the FAB visibility
      Animated.timing(floatingCTAAnimatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start FAB pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.03,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Logic for timed hint text visibility
      const showAndHideHint = () => {
        setShowHintText(true);
        Animated.timing(hintOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          hideTimer = setTimeout(() => {
            Animated.timing(hintOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => setShowHintText(false));
          }, 10000); // Disappear after 10 seconds
        });
      };

      // Show hint initially
      showAndHideHint();

      // Set interval for reappearance every 30 minutes (1800000 ms)
      reappearInterval = setInterval(() => {
        showAndHideHint();
      }, 1800000); // Reappear every 30 minutes
    } else {
      // When not on communityRequestsFeed, hide everything and stop animations/timers
      Animated.timing(floatingCTAAnimatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(0);
      hintOpacity.setValue(0);
      setShowHintText(false); // Ensure state is reset

      clearTimeout(hideTimer);
      clearInterval(reappearInterval);
    }

    return () => {
      // Cleanup on unmount or dependency change
      clearTimeout(hideTimer);
      clearInterval(reappearInterval);
    };
  }, [currentPage, floatingCTAAnimatedValue, pulseAnimation]); // Only currentPage triggers this effect fully

  const floatingCTAStyle = {
    opacity: floatingCTAAnimatedValue,
    // The scale transform is moved to the floatingCTAButton directly
  };

  const homeButtonProps = usePressableAnimation(
    useCallback(() => {
      setShowCreatorModal(false);
      setShowFilterModal(false);
      setShowPremiumModal(false);
      setShowRequestVideoModal(false);
      setShowRequesterProfileModal(false);
      setShowReportModal(false);
      setShowRequestSimilarVideoModal(false);
      setSearch("");
      setActiveFilter("recent");
      setCurrentFilters({
        videoType: "All",
        sortBy: "Newest",
        duration: "All",
        creatorFilters: [],
        topics: [],
      });
      setCurrentPage("mainFeed");
    }, [])
  );

  const communityRequestsButtonProps = usePressableAnimation(
    useCallback(() => {
      setShowRequesterProfileModal(false);
      setShowReportModal(false);
      setShowRequestSimilarVideoModal(false);
      setShowRequestVideoModal(false);
      setCurrentPage("communityRequestsFeed");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, [])
  );

  const requestButtonProps = usePressableAnimation(
    useCallback(() => {
      setShowRequesterProfileModal(false);
      setShowReportModal(false);
      setShowRequestSimilarVideoModal(false);
      setShowRequestVideoModal(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, [])
  );

  const moreButtonProps = usePressableAnimation(
    useCallback(() => {
      setShowRequesterProfileModal(false);
      setShowReportModal(false);
      setShowRequestSimilarVideoModal(false);
      setShowRequestVideoModal(false);
      setShowPremiumModal(true);
    }, [])
  );

  // Updated handleCreatorPress to find creator from CREATORS array
  const handleCreatorPress = useCallback((creatorId) => {
    const foundCreator = CREATORS.find((c) => c.id === creatorId);
    if (foundCreator) {
      setSelectedCreator(foundCreator);
      setShowCreatorModal(true);
    }
  }, []);

  const handleRequesterPress = useCallback((requesterId) => {
    const requesterData = REQUESTERS.find((r) => r.id === requesterId);
    if (requesterData) {
      setSelectedRequester(requesterData);
      setShowRequesterProfileModal(true);
    }
  }, []);

  const handleReportVideo = useCallback((videoData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVideoForReport(videoData);
    setShowReportModal(true);
  }, []);

  const handleRequestSimilarVideo = useCallback((videoData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVideoForSimilarRequest(videoData);
    setShowRequestSimilarVideoModal(true);
  }, []);

  const handleApplyFilters = useCallback((filters) => {
    setCurrentFilters(filters);
  }, []);

  const filteredVideos = useMemo(() => {
    let videosToFilter = [...VIDEOS];

    if (search) {
      videosToFilter = videosToFilter.filter(
        (video) =>
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.creator.toLowerCase().includes(search.toLowerCase()) ||
          (video.requestedBy &&
            video.requestedBy.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (activeFilter === "requested") {
      videosToFilter = videosToFilter.filter((video) => video.requested);
    } else if (activeFilter === "popular") {
      videosToFilter.sort((a, b) => b.title.length - a.title.length);
    } else {
      videosToFilter.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    if (currentFilters.videoType === "Requested") {
      videosToFilter = videosToFilter.filter((video) => video.requested);
    } else if (currentFilters.videoType === "Originals") {
      videosToFilter = videosToFilter.filter((video) => !video.requested);
    } else if (currentFilters.videoType === "AI-enhanced") {
      videosToFilter = videosToFilter.filter((video) => video.isAIenhanced);
    }

    if (currentFilters.sortBy === "Most Popular") {
      videosToFilter.sort((a, b) => b.title.length - a.title.length);
    } else if (currentFilters.sortBy === "Most Requested") {
      videosToFilter.sort(
        (a, b) =>
          (b.requested ? 1 : 0) - (a.requested ? 1 : 0) ||
          new Date(b.time) - new Date(a.time)
      );
    } else {
      videosToFilter.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    if (currentFilters.duration === "Under 3 min") {
      videosToFilter = videosToFilter.filter((video) => {
        const [minutes, seconds] = video.duration.split(":").map(Number);
        return minutes * 60 + seconds < 180;
      });
    } else if (currentFilters.duration === "3-10 min") {
      videosToFilter = videosToFilter.filter((video) => {
        const [minutes, seconds] = video.duration.split(":").map(Number);
        const totalSeconds = minutes * 60 + seconds;
        return totalSeconds >= 180 && totalSeconds <= 600;
      });
    } else if (currentFilters.duration === "10+ min") {
      videosToFilter = videosToFilter.filter((video) => {
        const [minutes, seconds] = video.duration.split(":").map(Number);
        return minutes * 60 + seconds > 600;
      });
    }

    if (currentFilters.creatorFilters.includes("Verified")) {
      videosToFilter = videosToFilter.filter(
        (video) => CREATORS.find((c) => c.id === video.creator)?.isVerified
      );
    }
    if (currentFilters.creatorFilters.includes("I Follow")) {
      videosToFilter = videosToFilter.filter((video) =>
        ["Krypton T", "SociologyThinker"].includes(video.creator)
      );
    }
    if (currentFilters.creatorFilters.includes("Full-Time Creators")) {
      // This logic will need to be updated based on what defines 'Full-Time'
      videosToFilter = videosToFilter.filter((video) =>
        ["SociologyThinker", "AIInsights"].includes(video.creator)
      );
    }

    return videosToFilter;
  }, [search, activeFilter, currentFilters]);

  const filteredCommunityRequests = useMemo(() => {
    let requestsToFilter = [...COMMUNITY_REQUESTS];

    if (communitySearch) {
      requestsToFilter = requestsToFilter.filter(
        (request) =>
          request.title.toLowerCase().includes(communitySearch.toLowerCase()) ||
          request.description
            .toLowerCase()
            .includes(communitySearch.toLowerCase()) ||
          request.user.name
            .toLowerCase()
            .includes(communitySearch.toLowerCase()) ||
          request.tags.some((tag) =>
            tag.toLowerCase().includes(communitySearch.toLowerCase())
          )
      );
    }

    if (communityCategoryFilter !== "All") {
      requestsToFilter = requestsToFilter.filter((request) =>
        request.tags.some((tag) =>
          tag.toLowerCase().includes(communityCategoryFilter.toLowerCase())
        )
      );
    }

    switch (selectedCommunitySortChip) {
      case "Trending":
        requestsToFilter.sort(
          (a, b) => b.upvotes + b.boosts - (a.upvotes + a.boosts)
        );
        break;
      case "Newest":
        requestsToFilter.sort((a, b) => {
          const timeA = parseInt(a.timestamp.match(/\d+/)[0]);
          const timeB = parseInt(b.timestamp.match(/\d+/)[0]);
          return timeA - timeB;
        });
        break;
      case "Top Funded":
        requestsToFilter.sort((a, b) => b.boosts - a.boosts);
        break;
      case "Urgent":
        requestsToFilter.sort((a, b) => a.comments - b.comments);
        break;
      default:
        requestsToFilter.sort((a, b) => {
          const timeA = parseInt(a.timestamp.match(/\d+/)[0]);
          const timeB = parseInt(b.timestamp.match(/\d+/)[0]);
          return timeA - timeB;
        });
        break;
    }

    if (communitySortBy !== "Newest") {
      requestsToFilter.sort((a, b) => {
        let primarySortDiff = 0;
        switch (selectedCommunitySortChip) {
          case "Trending":
            primarySortDiff = b.upvotes + b.boosts - (a.upvotes + a.boosts);
            break;
          case "Newest":
            primarySortDiff =
              parseInt(a.timestamp.match(/\d+/)[0]) -
              parseInt(b.timestamp.match(/\d+/)[0]);
            break;
          case "Top Funded":
            primarySortDiff = b.boosts - a.boosts;
            break;
          case "Urgent":
            primarySortDiff = a.comments - b.comments;
            break;
          default:
            primarySortDiff =
              parseInt(a.timestamp.match(/\d+/)[0]) -
              parseInt(b.timestamp.match(/\d+/)[0]);
            break;
        }

        if (primarySortDiff !== 0) {
          return primarySortDiff;
        }

        switch (communitySortBy) {
          case "Most Upvoted":
            return b.upvotes - a.upvotes;
          case "Most Tipped":
            return b.tips - a.tips;
          case "Most Commented":
            return b.comments - a.comments;
          default:
            return 0;
        }
      });
    }

    return requestsToFilter;
  }, [
    communitySearch,
    communityCategoryFilter,
    communitySortBy,
    selectedCommunitySortChip,
  ]);

  const renderFeed = useCallback(() => {
    if (showRequestVideoModal) {
      return null;
    }

    if (currentPage === "mainFeed") {
      return (
        <>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                alert("Main menu coming soon!");
              }}
              accessibilityLabel="Open main menu"
            >
              <Menu
                size={18}
                color={COLORS.textLightGray}
                strokeWidth={1.5}
                style={styles.iconSpacing}
              />
            </Pressable>

            {!showMainSearchBar ? (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowMainSearchBar(true);
                }}
                style={styles.searchIconContainer}
                accessibilityLabel="Activate search bar"
              >
                <MaterialIcons
                  name="search"
                  size={20}
                  color={COLORS.textMediumGray}
                />
              </Pressable>
            ) : (
              <Animated.View
                style={[
                  styles.searchBarExpanded,
                  {
                    width: searchInputWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "70%"], // Adjust as needed
                    }),
                    opacity: searchInputOpacity,
                  },
                ]}
              >
                <TextInput
                  style={styles.searchInputExpanded}
                  placeholder="Search videos..."
                  placeholderTextColor={COLORS.textMediumGray}
                  value={search}
                  onChangeText={setSearch}
                  keyboardAppearance={
                    Platform.OS === "ios" ? "dark" : "default"
                  }
                  accessibilityLabel="Search videos"
                  accessibilityHint="Search for videos by title, creator, or requester"
                  autoFocus={true} // Auto-focus when expanded
                />
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowMainSearchBar(false);
                  }}
                  style={styles.searchBarCloseIcon}
                  accessibilityLabel="Close search bar"
                >
                  <X size={18} color={COLORS.textMediumGray} />
                </Pressable>
              </Animated.View>
            )}

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowFilterModal(true);
              }}
              accessibilityLabel="Open filter and sort options"
              style={styles.filterButton} // New style for the "Filter" text button
            >
              <Text style={styles.filterButtonText}>Filter</Text>
              <Feather
                name="sliders"
                size={18}
                color={COLORS.primaryAccent}
                style={styles.filterButtonIcon}
              />
            </Pressable>
          </View>

          <View style={styles.filterBar}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter("recent");
              }}
              style={[
                styles.filterOption,
                activeFilter === "recent" && styles.filterOptionSelected,
              ]}
              accessibilityLabel="Show recent videos"
              accessibilityRole="radio"
              accessibilityState={{ checked: activeFilter === "recent" }}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "recent" && styles.filterTextSelected,
                ]}
              >
                Recent
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter("popular");
              }}
              style={[
                styles.filterOption,
                activeFilter === "popular" && styles.filterOptionSelected,
              ]}
              accessibilityLabel="Show popular videos"
              accessibilityRole="radio"
              accessibilityState={{ checked: activeFilter === "popular" }}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "popular" && styles.filterTextSelected,
                ]}
              >
                Popular
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter("requested");
              }}
              style={[
                styles.filterOption,
                activeFilter === "requested" && styles.filterOptionSelected,
              ]}
              accessibilityLabel="Show requested videos only"
              accessibilityRole="radio"
              accessibilityState={{ checked: activeFilter === "requested" }}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "requested" && styles.filterTextSelected,
                ]}
              >
                Requested Only
              </Text>
            </Pressable>
          </View>

          {filteredVideos.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No videos found matching your criteria.
              </Text>
              <Text style={styles.emptyStateSubText}>
                Try adjusting your search or filters.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredVideos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <VideoCard
                  item={item}
                  onCreatorPress={handleCreatorPress}
                  onReport={handleReportVideo}
                  onRequestSimilar={handleRequestSimilarVideo}
                  onRequesterPress={handleRequesterPress}
                />
              )}
              style={styles.flatListStyle}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          )}
        </>
      );
    } else if (currentPage === "communityRequestsFeed") {
      const numColumns = width > 768 ? 3 : width > 480 ? 2 : 1;
      const communityCategories = [
        "All",
        "Technology",
        "Science",
        "Art",
        "Gaming",
        "Food",
        "History",
        "Finance",
        "Environment",
        "Sociology",
      ];
      const communitySortOptions = [
        "Newest",
        "Most Upvoted",
        "Most Tipped",
        "Most Commented",
      ];

      return (
        <View style={communityStyles.container}>
          <View style={communityStyles.stickyHeader}>
            <TextInput
              style={communityStyles.communitySearchInput}
              placeholder="Search requests by keywords, tags, or user..."
              placeholderTextColor={COLORS.textMediumGray}
              value={communitySearch}
              onChangeText={setCommunitySearch}
              keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
              accessibilityLabel="Search community requests"
              accessibilityHint="Search requests by keywords, tags, or user name"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={communityStyles.chipScrollViewContent}
            >
              {["Trending", "Newest", "Top Funded", "Urgent"].map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={[
                    communityStyles.filterChip,
                    selectedCommunitySortChip === chip &&
                      communityStyles.filterChipSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedCommunitySortChip(chip);
                  }}
                  accessibilityLabel={`Filter by ${chip}`}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: selectedCommunitySortChip === chip,
                  }}
                >
                  {chip === "Trending" && (
                    <TrendingUp
                      size={18}
                      color={
                        selectedCommunitySortChip === chip
                          ? COLORS.cardBackground
                          : COLORS.textLightGray
                      }
                      style={communityStyles.chipIcon}
                    />
                  )}
                  {chip === "Newest" && (
                    <Clock
                      size={18}
                      color={
                        selectedCommunitySortChip === chip
                          ? COLORS.cardBackground
                          : COLORS.textLightGray
                      }
                      style={communityStyles.chipIcon}
                    />
                  )}
                  {chip === "Top Funded" && (
                    <DollarSign
                      size={18}
                      color={
                        selectedCommunitySortChip === chip
                          ? COLORS.cardBackground
                          : COLORS.secondaryAccent
                      }
                      style={communityStyles.chipIcon}
                    />
                  )}
                  {chip === "Urgent" && (
                    <Zap
                      size={18}
                      color={
                        selectedCommunitySortChip === chip
                          ? COLORS.cardBackground
                          : COLORS.textLightGray
                      }
                      style={communityStyles.chipIcon}
                    />
                  )}
                  <Text
                    style={[
                      communityStyles.filterChipText,
                      selectedCommunitySortChip === chip &&
                        communityStyles.filterChipTextSelected,
                    ]}
                  >
                    {chip}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={communityStyles.dropdownWrapper}>
                <CustomDropdown
                  label=""
                  options={communityCategories}
                  selectedValue={communityCategoryFilter}
                  onSelect={setCommunityCategoryFilter}
                  placeholder="Category"
                  accessibilityLabel="Community category filter dropdown"
                />
              </View>
              <View style={communityStyles.dropdownWrapper}>
                <CustomDropdown
                  label=""
                  options={communitySortOptions}
                  selectedValue={communitySortBy}
                  onSelect={setCommunitySortBy}
                  placeholder="Sort By"
                  accessibilityLabel="Community sort by dropdown"
                />
              </View>
            </ScrollView>
          </View>

          {filteredCommunityRequests.length === 0 ? (
            <View style={communityStyles.emptyStateContainer}>
              <Text style={communityStyles.emptyStateText}>
                No requests found matching your criteria.
              </Text>
              <Text style={communityStyles.emptyStateSubText}>
                Be the first to make a request!
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredCommunityRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CommunityRequestCard item={item} />}
              numColumns={numColumns}
              contentContainerStyle={communityStyles.cardGridContainer}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          )}

          <Animated.View
            style={[communityStyles.floatingCTA, floatingCTAStyle]}
          >
            {showHintText && (
              <Animated.View
                style={[
                  communityStyles.hintContainer,
                  { opacity: hintOpacity },
                ]}
              >
                <BlurView
                  intensity={80}
                  tint="dark"
                  style={communityStyles.hintBlurBackground}
                >
                  <Text style={communityStyles.hintText}>
                    Any videos you'd like to see?
                  </Text>
                  <View style={communityStyles.hintArrowContainer}>
                    <Text style={communityStyles.hintText}>
                      Request it now!
                    </Text>
                    <ArrowDown
                      size={24}
                      color={COLORS.primaryAccent}
                      style={communityStyles.hintArrow}
                    />
                  </View>
                </BlurView>
              </Animated.View>
            )}
            <TouchableOpacity
              style={[
                communityStyles.floatingCTAButton,
                {
                  transform: [
                    {
                      scale: pulseAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.03], // Subtler pulse for premium feel
                      }),
                    },
                  ],
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setShowRequestVideoModal(true);
              }}
              accessibilityLabel="Make a new video request"
            >
              <MaterialIcons
                name="lightbulb-outline"
                size={26}
                color={COLORS.cardBackground}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    }
  }, [
    showRequestVideoModal,
    currentPage,
    search,
    activeFilter,
    filteredVideos,
    communitySearch,
    communityCategoryFilter,
    communitySortBy,
    selectedCommunitySortChip,
    filteredCommunityRequests,
    floatingCTAStyle,
    handleCreatorPress,
    handleRequesterPress,
    handleReportVideo,
    handleRequestSimilarVideo,
    showMainSearchBar,
    searchInputWidth,
    searchInputOpacity,
    showHintText,
    hintOpacity,
    pulseAnimation,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {renderFeed()}

      <View style={styles.bottomNav}>
        <Pressable
          {...homeButtonProps}
          style={[styles.navButtonWrapper, homeButtonProps.animatedStyle]}
          accessibilityLabel="Go to Home feed"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentPage === "mainFeed" }}
        >
          <MaterialIcons
            name="home"
            size={22}
            color={
              currentPage === "mainFeed"
                ? COLORS.primaryAccent
                : COLORS.textLightGray
            }
          />
        </Pressable>

        <View style={styles.navItemSeparator} />

        <Pressable
          {...communityRequestsButtonProps}
          style={[
            styles.navButtonWrapper,
            communityRequestsButtonProps.animatedStyle,
          ]}
          accessibilityLabel="Go to Community Requests feed"
          accessibilityRole="tab"
          accessibilityState={{
            selected: currentPage === "communityRequestsFeed",
          }}
        >
          <MessageSquareReply
            size={22}
            color={
              currentPage === "communityRequestsFeed"
                ? COLORS.primaryAccent
                : COLORS.textLightGray
            }
          />
        </Pressable>

        <View style={styles.navItemSeparator} />

        <Pressable
          {...requestButtonProps}
          style={[styles.navButtonWrapper, requestButtonProps.animatedStyle]}
          accessibilityLabel="Open new video request form"
        >
          <MaterialIcons
            name="lightbulb-outline"
            size={22}
            color={COLORS.textLightGray}
          />
        </Pressable>

        <View style={styles.navItemSeparator} />

        <Pressable
          {...moreButtonProps}
          style={[styles.navButtonWrapper, moreButtonProps.animatedStyle]}
          accessibilityLabel="Open more options menu"
        >
          <MaterialIcons
            name="more-vert"
            size={22}
            color={COLORS.textLightGray}
          />
        </Pressable>
      </View>

      {/* Modals rendered conditionally (overlaying the main content) */}
      <CreatorModal
        isVisible={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        creator={selectedCreator}
      />
      <FilterModal
        isVisible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
      <PremiumModal
        isVisible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
      {showRequestVideoModal && (
        <RequestVideoModal
          isVisible={showRequestVideoModal}
          onClose={() => setShowRequestVideoModal(false)}
        />
      )}
      <RequesterProfileModal
        isVisible={showRequesterProfileModal}
        onClose={() => setShowRequesterProfileModal(false)}
        requester={selectedRequester}
      />
      <ReportModal
        isVisible={showReportModal}
        onClose={() => setShowReportModal(false)}
        videoData={videoForReport}
      />
      <RequestSimilarVideoModal
        isVisible={showRequestSimilarVideoModal}
        onClose={() => setShowRequestSimilarVideoModal(false)}
        originalVideoData={videoForSimilarRequest}
      />
    </SafeAreaView>
  );
}

// --- StyleSheet for Components ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Rich Black / Deep Charcoal
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 15 : 0, // Reduced padding for more vertical space
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 44, // Slightly thinner header
    backgroundColor: COLORS.cardBackground, // Background for header
    borderRadius: 12,
    marginHorizontal: 18, // Increased margin for more whitespace
    marginBottom: 25, // Increased margin
    paddingHorizontal: 16,
    shadowColor: COLORS.shadowColor, // Softer shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6, // Softer radius
    elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.buttonBorder, // Subtle border
  },
  iconSpacing: { marginHorizontal: 8 }, // Adjusted icon spacing
  searchInput: {
    flex: 1,
    color: COLORS.textWhite,
    fontSize: 15, // Slightly smaller font
    fontFamily: "Segoe UI Semilight", // Thinner, more elegant font
    paddingVertical: 0,
    letterSpacing: 0.2, // Subtle letter spacing
  },
  searchIconContainer: {
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto", // Push to the right next to filter button
    marginRight: 10,
  },
  searchBarExpanded: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: "80%", // Match height of container
  },
  searchInputExpanded: {
    flex: 1,
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
    paddingVertical: 0,
    paddingRight: 5,
  },
  searchBarCloseIcon: {
    padding: 5,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  filterButtonText: {
    color: COLORS.primaryAccent,
    fontSize: 14,
    fontFamily: "Segoe UI Semilight",
    fontWeight: "600",
    marginRight: 6,
  },
  filterButtonIcon: {
    color: COLORS.primaryAccent,
  },
  flatListStyle: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.cardBackground, // Deeper charcoal for cards
    borderRadius: 20, // Increased border radius for softer curves
    marginHorizontal: 18, // More whitespace
    marginBottom: 35, // More whitespace
    borderWidth: 1, // Slightly thinner border
    borderColor: "rgba(255,255,255,0.08)", // Subtle white border
    overflow: "hidden",
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 }, // Softer, deeper shadow
    shadowOpacity: 0.25,
    shadowRadius: 15, // Wider shadow blur
    elevation: 12,
  },
  thumbContainer: {
    borderTopLeftRadius: 20, // Match card border radius
    borderTopRightRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 200, // Adjusted height for more elegant proportion
  },
  thumbnailPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.cardBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  imageFog: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70, // Slightly larger fog for smoother transition
  },
  badge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: COLORS.primaryAccent, // Warm Bronze for requested badge
    paddingHorizontal: 12, // Increased padding
    paddingVertical: 6, // Increased padding
    borderRadius: 10, // Softer corners
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.primaryAccent, // Accent-colored shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeIcon: {
    marginRight: 6, // More space
  },
  badgeText: {
    color: COLORS.cardBackground, // Dark text on accent background
    fontSize: 12, // Slightly smaller
    fontWeight: "bold", // Bold for emphasis
    fontFamily: "Segoe UI Semilight",
  },
  duration: {
    position: "absolute",
    bottom: 15, // More whitespace
    right: 15, // More whitespace
    backgroundColor: "rgba(0,0,0,0.7)", // Darker overlay
    paddingHorizontal: 8, // More padding
    paddingVertical: 4, // More padding
    borderRadius: 6, // Softer corners
  },
  durationText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontFamily: "Segoe UI Semilight",
  },
  info: { padding: 20 }, // Increased padding for more breathing room
  title: {
    color: COLORS.textWhite,
    fontSize: 17, // Refined title size
    fontFamily: "Segoe UI Semilight",
    fontWeight: "600",
    marginBottom: 8, // Slightly more space
    lineHeight: 24, // Improved line height
  },
  creator: {
    color: COLORS.textLightGray, // Premium silver
    fontSize: 13, // Refined size
    fontFamily: "Segoe UI Semilight",
    marginBottom: 5, // More subtle spacing
    flexDirection: "row",
    alignItems: "center",
  },
  creatorName: {
    textDecorationLine: "underline",
    color: COLORS.secondaryAccent, // Gold for creator link
    fontWeight: "bold",
    textDecorationColor: COLORS.secondaryAccent, // Ensure underline matches text color
  },
  requesterNameLink: {
    textDecorationLine: "underline", // Added underline
    color: COLORS.primaryAccent, // Bronze for requester link
    fontWeight: "bold",
    textDecorationColor: COLORS.primaryAccent, // Underline matches text color
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5, // Adjusted spacing
  },
  metaText: {
    color: COLORS.textMediumGray, // Deeper silver for meta text
    fontSize: 11, // Refined meta text size
    fontFamily: "Segoe UI Semilight",
  },
  moreIconWrapper: {
    padding: 10, // Larger touch target
    marginRight: -10, // Adjust to optical alignment
  },
  bottomNav: {
    backgroundColor: COLORS.background, // Match background for seamless look
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: COLORS.buttonBorder, // Subtle border
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 18, // More vertical padding
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === "android" ? 60 : 0, // Adjust for Android nav bar
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  navButtonWrapper: {
    flex: 1,
    paddingVertical: 10, // Increased vertical padding
    borderRadius: 15, // More rounded corners
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  navItemSeparator: {
    width: StyleSheet.hairlineWidth,
    height: 28, // Taller separator
    backgroundColor: COLORS.buttonBorder, // Subtle separator
    marginHorizontal: 10,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 18, // More whitespace
    marginBottom: 25, // More whitespace
    backgroundColor: COLORS.cardBackground, // Consistent card background
    borderRadius: 15, // More rounded corners
    paddingVertical: 10, // Increased padding
    borderWidth: 1,
    borderColor: COLORS.buttonBorder, // Subtle border
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  filterOption: {
    paddingHorizontal: 18, // Increased padding
    paddingVertical: 10, // Increased padding
    borderRadius: 12, // More rounded corners
  },
  filterOptionSelected: {
    // No background for selected, let the underline be the highlight
    borderBottomWidth: 2, // Subtle underline thickness
    borderBottomColor: COLORS.primaryAccent, // Bronze underline color
    paddingBottom: 8, // Adjust padding to lift the underline slightly
  },
  filterText: {
    color: COLORS.textLightGray, // Platinum gray
    fontSize: 13, // Refined size
    fontFamily: "Segoe UI Semilight",
    fontWeight: "400",
  },
  filterTextSelected: {
    fontWeight: "600", // Slightly bolder for selection
    color: COLORS.primaryAccent, // Warm Bronze highlight
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30, // More whitespace
    minHeight: 250, // Ensure it's visible even on small lists
  },
  emptyStateText: {
    color: COLORS.textLightGray,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Segoe UI Semilight",
  },
  emptyStateSubText: {
    color: COLORS.textMediumGray,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Segoe UI Semilight",
  },
});

const modalStyles = StyleSheet.create({
  // These are the old styles from CreatorModal before redesign, they are no longer used by CreatorModal but kept here for reference.
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Darker overlay
  },
  modalBlur: {
    borderRadius: 25, // More rounded
    overflow: "hidden",
    width: "90%", // Slightly wider
    maxWidth: 450, // Increased max width
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18, // Wider blur
    elevation: 15,
  },
  modalView: {
    backgroundColor: COLORS.cardBackground, // Consistent dark background
    borderRadius: 25,
    padding: 30, // Increased padding
    alignItems: "center",
    borderWidth: 1, // Slightly thicker border
    borderColor: COLORS.buttonBorder, // Subtle border
  },
  closeButton: {
    position: "absolute",
    top: 18, // More whitespace
    right: 18, // More whitespace
    padding: 8, // Larger touch target
  },
  creatorThumbnail: {
    width: 90, // Slightly smaller for refinement
    height: 90,
    borderRadius: 45, // Perfect circle
    marginBottom: 20, // More whitespace
    borderWidth: 2,
    borderColor: COLORS.primaryAccent, // Bronze border
  },
  nameAndBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // More whitespace
  },
  creatorName: {
    color: COLORS.textWhite,
    fontSize: 20, // Slightly smaller
    fontWeight: "600",
    fontFamily: "Segoe UI Semilight",
  },
  verifiedBadge: {
    marginLeft: 10, // More space
    color: COLORS.primaryAccent, // Bronze verified icon
  },
  creatorBio: {
    color: COLORS.textLightGray,
    fontSize: 13, // Refined size
    textAlign: "center",
    marginBottom: 20, // More whitespace
    fontFamily: "Segoe UI Semilight",
    lineHeight: 18, // Improved line height
  },
  // Request button removed as per design spec

  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25, // More whitespace
    paddingVertical: 12, // Increased padding
    paddingHorizontal: 25, // Increased padding
    borderRadius: 15, // More rounded
    backgroundColor: "rgba(255,255,255,0.08)", // Subtle background
    borderWidth: 1,
    borderColor: COLORS.buttonBorder, // Subtle border
  },
  moreButtonText: {
    color: COLORS.textLightGray,
    fontSize: 14,
    marginRight: 10,
    fontFamily: "Segoe UI Semilight",
  },
  expandedSection: {
    width: "100%",
    overflow: "hidden",
    marginTop: 20, // More whitespace
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.buttonBorder,
    paddingTop: 20, // More whitespace
    alignItems: "center",
  },
  socialLinksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20, // More whitespace
    width: "100%",
    flexWrap: "wrap",
  },
  socialLink: {
    padding: 12, // Increased padding
    marginHorizontal: 10, // More whitespace
    backgroundColor: "rgba(255,255,255,0.06)", // Subtle background
    borderRadius: 15, // More rounded
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.buttonBorder, // Subtle border
  },
  actionButton: {
    backgroundColor: "rgba(255,255,255,0.08)", // Subtle background
    paddingVertical: 12, // Increased padding
    paddingHorizontal: 25, // Increased padding
    borderRadius: 15, // More rounded
    marginTop: 12, // More whitespace
    width: "85%", // Wider button
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder, // Subtle border
  },
  actionButtonText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Segoe UI Semilight",
  },
});

const contextMenuStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  menuContainer: {
    backgroundColor: COLORS.cardBackground, // Consistent dark background
    borderRadius: 15, // More rounded
    paddingVertical: 10, // Increased padding
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    width: "75%", // Wider menu
    maxWidth: 280, // Increased max width
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder, // Subtle border
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15, // Increased padding
    paddingHorizontal: 20, // Increased padding
  },
  menuItemText: {
    color: COLORS.textWhite,
    fontSize: 14, // Refined size
    fontFamily: "Segoe UI Semilight",
    marginRight: 12, // More space
    flex: 1,
  },
});

const filterModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalBlur: {
    borderRadius: 25, // More rounded
    overflow: "hidden",
    width: "90%",
    maxHeight: "85%", // Taller modal
    maxWidth: 550, // Wider modal
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20, // Wider blur
    elevation: 15,
  },
  modalContainer: {
    backgroundColor: COLORS.cardBackground, // Consistent dark background
    borderRadius: 25,
    padding: 25, // Increased padding
    borderWidth: 1,
    borderColor: COLORS.buttonBorder, // Subtle border
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25, // More whitespace
    paddingBottom: 15, // More whitespace
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.buttonBorder,
  },
  modalTitle: {
    color: COLORS.textWhite,
    fontSize: 20, // Refined size
    fontWeight: "600",
    fontFamily: "Segoe UI Semilight",
  },
  closeButton: {
    padding: 8, // Larger touch target
  },
  scrollViewContent: {
    paddingBottom: 20, // Adjusted padding
  },
  sectionTitle: {
    color: COLORS.primaryAccent, // Bronze for section titles
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20, // More whitespace
    marginBottom: 12, // More whitespace
    alignSelf: "flex-start",
    fontFamily: "Segoe UI Semilight",
    paddingLeft: 10, // Align with info block content
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15, // More whitespace
    paddingHorizontal: 5, // Slight padding to push items in
  },
  optionButton: {
    backgroundColor: "rgba(255,255,255,0.06)", // Subtle background
    borderRadius: 12, // More rounded
    paddingVertical: 10, // Increased padding
    paddingHorizontal: 18, // Increased padding
    marginRight: 10,
    marginBottom: 10,
    borderColor: COLORS.buttonBorder,
    borderWidth: 1,
  },
  optionButtonSelected: {
    backgroundColor: "transparent", // No background for selected
    borderColor: "transparent", // No border for selected
    borderBottomWidth: 2, // Subtle underline thickness
    borderBottomColor: COLORS.primaryAccent, // Bronze underline color
    paddingBottom: 8, // Adjust padding to lift the underline slightly
  },
  optionText: {
    color: COLORS.textLightGray,
    fontSize: 13,
    fontFamily: "Segoe UI Semilight",
  },
  optionTextSelected: {
    color: COLORS.primaryAccent, // Warm Bronze highlight
    fontWeight: "600", // Slightly bolder for selection
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25, // More whitespace
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.buttonBorder, // Subtle border
    paddingTop: 20, // More whitespace
  },
  resetButton: {
    backgroundColor: "rgba(255,255,255,0.1)", // Subtle background
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 30, // Increased padding
    borderRadius: 15, // More rounded
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  resetButtonText: {
    color: COLORS.textWhite,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Segoe UI Semilight",
  },
  applyButton: {
    backgroundColor: COLORS.primaryAccent, // Bronze for apply
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 15,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  applyButtonText: {
    color: COLORS.cardBackground, // Dark text on accent
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Segoe UI Semilight",
  },
});

const premiumModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly lighter overlay for premium feel
    justifyContent: "flex-end",
  },
  modalContainer: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 80 + 15 : 20 + 15, // Adjusted for more bottom margin
    left: 25, // More margin
    right: 25, // More margin
    borderRadius: 20, // More rounded
    overflow: "hidden",
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20, // Wider blur
    elevation: 15,
  },
  blur: {
    paddingVertical: 20, // More vertical padding
    paddingHorizontal: 25, // More horizontal padding
    backgroundColor: "rgba(20, 20, 20, 0.6)", // Darker translucent background for frosted glass
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.15)", // Subtle border
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16, // Increased padding
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.1)", // Subtle separator
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    color: COLORS.textWhite,
    fontSize: 16, // Refined size
    marginLeft: 18, // More space
    fontWeight: "400",
    fontFamily: "Segoe UI Semilight",
  },
});

const requestModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalBlur: {
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    maxWidth: 480,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 15,
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground, // Consistent dark background
    borderRadius: 25,
    padding: 30, // Increased padding
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    color: COLORS.textWhite,
    fontSize: 24, // Refined size
    fontWeight: "700",
    marginBottom: 35, // More whitespace
    fontFamily: "Segoe UI Semilight",
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 25, // More whitespace
    width: "100%",
  },
  inputLabel: {
    color: COLORS.textLightGray,
    fontSize: 16, // Refined size
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "Segoe UI Semilight",
    letterSpacing: 0.3,
  },
  requiredAsterisk: {
    color: COLORS.primaryAccent, // Bronze for asterisk
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.05)", // Subtle input background
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15, // Thinner input
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    width: "100%",
  },
  multilineInput: {
    height: 140, // Slightly less tall
    paddingTop: 15,
    lineHeight: 22,
  },
  goldBorder: {
    // New style for gold border
    borderWidth: 1.5, // Slightly thicker for accent
    borderColor: COLORS.primaryAccent, // Bronze accent
    shadowColor: COLORS.primaryAccent, // Accent shadow for glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, // Subtle glow
    shadowRadius: 10,
    elevation: 0,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryAccent, // Bronze for submit
    paddingVertical: 16, // Thinner button
    borderRadius: 18, // More rounded
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35, // More whitespace
    alignSelf: "center",
    width: "90%",
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  submitButtonText: {
    color: COLORS.cardBackground, // Dark text on accent
    fontSize: 18, // Refined size
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
    marginRight: 10,
  },
  submitButtonIcon: {
    marginTop: 2,
  },
  // Styles for the dropdown within the request modal
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle background
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
  },
  dropdownButtonText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
    flex: 1,
  },
  dropdownPlaceholderText: {
    color: COLORS.textMediumGray,
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  dropdownModalView: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18, // More rounded
    width: "80%",
    maxHeight: "50%",
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  dropdownScrollView: {
    paddingVertical: 10,
  },
  dropdownOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  dropdownOptionText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
  },
});

const requesterProfileStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalBlur: {
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    maxWidth: 380, // Narrower for ID card look
    maxHeight: "85%", // Adjusted for vertical ID card
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  flipCardContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  flipCard: {
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
  },
  flipCardFront: {
    zIndex: 2,
  },
  flipCardBack: {
    transform: [{ rotateY: "180deg" }],
    zIndex: 1,
  },
  modalView: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 35, // More vertical padding
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    width: "100%",
    position: "relative", // Needed for absolute positioning of shapes
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 3, // Ensure close button is on top
  },
  goldBorder: {
    // Consistent gold border for elements (used for avatar mainly)
    borderWidth: 2,
    borderColor: COLORS.primaryAccent,
  },
  // Top decorative shapes (simulating ID card top design)
  topShapeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Height of the top shape area
    overflow: "hidden",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  topShapeMain: {
    position: "absolute",
    top: -50, // Move up to create the partial circle effect
    width: "120%", // Wider than container
    height: 180, // Larger circle
    borderRadius: 90, // Half circle
    backgroundColor: COLORS.primaryAccent, // Main bronze color
    opacity: 0.2, // Subtle
  },
  topShapeAccent: {
    position: "absolute",
    top: -60, // Slightly higher accent
    width: "100%",
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.secondaryAccent, // Darker gold accent
    opacity: 0.1, // Even more subtle
    transform: [{ rotate: "15deg" }], // Slight rotation
  },
  // Avatar, Name, Level section
  requesterAvatar: {
    width: 100, // Larger avatar
    height: 100,
    borderRadius: 50, // Circular avatar
    marginBottom: 15,
    marginTop: 20, // Push avatar down from top shapes
    zIndex: 2, // Ensure avatar is above shapes
    borderWidth: 3, // Thicker border
    borderColor: COLORS.primaryAccent, // Bronze border
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  requesterName: {
    color: COLORS.textWhite,
    fontSize: 24, // Prominent name
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
    marginBottom: 5,
    textTransform: "uppercase", // All caps like ID cards
    letterSpacing: 1, // Spacing for prominent name
  },
  requesterLevel: {
    color: COLORS.secondaryAccent, // Gold for the level/role
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Segoe UI Semilight",
    marginBottom: 5,
  },
  requesterPhilosophy: {
    color: COLORS.textLightGray,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "Segoe UI Semilight",
    lineHeight: 18,
    paddingHorizontal: 15,
  },

  // Stats Section
  statsContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    marginBottom: 25,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)", // Background for the stats block
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1, // Distribute space evenly
  },
  statNumber: {
    color: COLORS.primaryAccent, // Bronze for numbers
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
  statLabel: {
    color: COLORS.textLightGray,
    fontSize: 12,
    fontFamily: "Segoe UI Semilight",
    marginTop: 4,
  },
  statSeparator: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)", // Subtle separator line
    height: "80%",
    alignSelf: "center",
  },

  // Info blocks
  infoBlock: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.05)", // Lighter background for info
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  infoLabel: {
    color: COLORS.textMediumGray,
    fontSize: 13,
    fontFamily: "Segoe UI Semilight",
    fontWeight: "600",
    marginRight: 10,
    width: "30%", // Allocate space for label
  },
  infoValue: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: "Segoe UI Semilight",
    flex: 1, // Take remaining space
    textAlign: "right", // Align value to the right
  },
  infoValueTitle: {
    color: COLORS.primaryAccent, // Highlight title
    fontSize: 14,
    fontFamily: "Segoe UI Semilight",
    flex: 1,
    textAlign: "right",
  },
  categoryChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-end", // Align chips to the right
  },
  categoryChip: {
    backgroundColor: COLORS.primaryAccent, // Bronze background for chips
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 5,
    marginBottom: 5,
  },
  categoryChipText: {
    color: COLORS.cardBackground, // Dark text on bronze
    fontSize: 11,
    fontFamily: "Segoe UI Semilight",
    fontWeight: "600",
  },

  sectionTitle: {
    // Reused for social links block title
    color: COLORS.primaryAccent,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 15,
    alignSelf: "flex-start",
    fontFamily: "Segoe UI Semilight",
    paddingLeft: 10, // Align with info block content
  },
  socialLinksBlock: {
    width: "100%",
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  socialLinksRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  socialIconContainer: {
    padding: 10,
    marginHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  interactiveButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.buttonBorder,
  },
  actionButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  actionButtonText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Segoe UI Semilight",
  },

  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondaryAccent, // Gold for flip button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 18,
    marginTop: 25,
    width: "90%",
    shadowColor: COLORS.secondaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  flipButtonText: {
    color: COLORS.cardBackground,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
  backFlipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondaryAccent,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 18,
    marginBottom: 25, // Space above content
    width: "90%",
    shadowColor: COLORS.secondaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },

  totalRequestsText: {
    color: COLORS.textLightGray,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "Segoe UI Semilight",
    textAlign: "center",
  },
  requestedVideosList: {
    width: "100%",
    paddingHorizontal: 5,
  },
  requestedVideoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    marginBottom: 15,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  requestedVideoThumbnail: {
    width: 80,
    height: 45,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.primaryAccent,
  },
  requestedVideoInfo: {
    flex: 1,
  },
  requestedVideoTitle: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "Segoe UI Semilight",
  },
  requestedVideoMeta: {
    color: COLORS.textMediumGray,
    fontSize: 11,
    fontFamily: "Segoe UI Semilight",
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 150,
  },
  emptyStateText: {
    color: COLORS.textMediumGray,
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "Segoe UI Semilight",
  },
  // Bottom decorative shapes
  bottomShapeContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Height of the bottom shape area
    overflow: "hidden",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: "center",
  },
  bottomShapeMain: {
    position: "absolute",
    bottom: -50, // Move up to create the partial circle effect
    width: "120%", // Wider than container
    height: 180, // Larger circle
    borderRadius: 90, // Half circle
    backgroundColor: COLORS.primaryAccent, // Main bronze color
    opacity: 0.2, // Subtle
  },
  bottomShapeAccent: {
    position: "absolute",
    bottom: -60, // Slightly higher accent
    width: "100%",
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.secondaryAccent, // Darker gold accent
    opacity: 0.1, // Even more subtle
    transform: [{ rotate: "-15deg" }], // Slight rotation
  },
});

// New styles for CreatorModal to match RequesterProfileModal
const creatorProfileStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalBlur: {
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    maxWidth: 380, // Narrower for ID card look
    maxHeight: "85%", // Adjusted for vertical ID card
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  flipCardContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  flipCard: {
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
  },
  flipCardFront: {
    zIndex: 2,
  },
  flipCardBack: {
    transform: [{ rotateY: "180deg" }],
    zIndex: 1,
  },
  modalView: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 35, // More vertical padding
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    width: "100%",
    position: "relative", // Needed for absolute positioning of shapes
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 3, // Ensure close button is on top
  },
  goldBorder: {
    // Consistent gold border for elements
    borderWidth: 2,
    borderColor: COLORS.primaryAccent,
  },
  // Top decorative shapes
  topShapeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: "hidden",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  topShapeMain: {
    position: "absolute",
    top: -50,
    width: "120%",
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primaryAccent,
    opacity: 0.2,
  },
  topShapeAccent: {
    position: "absolute",
    top: -60,
    width: "100%",
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.secondaryAccent,
    opacity: 0.1,
    transform: [{ rotate: "15deg" }],
  },
  // Avatar, Name, Role/Verified status
  creatorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    marginTop: 20,
    zIndex: 2,
    borderWidth: 3,
    borderColor: COLORS.primaryAccent,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  creatorName: {
    color: COLORS.textWhite,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  creatorRole: {
    color: COLORS.secondaryAccent,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Segoe UI Semilight",
    marginBottom: 5,
  },
  verifiedBadge: {
    marginTop: 5, // Space between role and badge if present
    marginBottom: 15, // Space before next section
  },

  // Stats Section
  statsContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    marginBottom: 25,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: COLORS.primaryAccent,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
  statLabel: {
    color: COLORS.textLightGray,
    fontSize: 12,
    fontFamily: "Segoe UI Semilight",
    marginTop: 4,
  },
  statSeparator: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    height: "80%",
    alignSelf: "center",
  },

  // Info blocks
  infoBlock: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  infoLabel: {
    color: COLORS.textMediumGray,
    fontSize: 13,
    fontFamily: "Segoe UI Semilight",
    fontWeight: "600",
    marginRight: 10,
    width: "30%",
  },
  infoValue: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: "Segoe UI Semilight",
    flex: 1,
    textAlign: "right",
  },
  infoValueQuote: {
    // Specific style for the quote
    color: COLORS.primaryAccent,
    fontSize: 14,
    fontFamily: "Segoe UI Semilight",
    flex: 1,
    textAlign: "right",
    fontStyle: "italic",
  },

  sectionTitle: {
    color: COLORS.primaryAccent,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 15,
    alignSelf: "flex-start",
    fontFamily: "Segoe UI Semilight",
    paddingLeft: 10,
  },
  socialLinksBlock: {
    width: "100%",
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  socialLinksRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  socialIconContainer: {
    padding: 10,
    marginHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  interactiveButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.buttonBorder,
  },
  actionButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  actionButtonText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Segoe UI Semilight",
  },

  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondaryAccent,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 18,
    marginTop: 25,
    width: "90%",
    shadowColor: COLORS.secondaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  flipButtonText: {
    color: COLORS.cardBackground,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
  backFlipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondaryAccent,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 18,
    marginBottom: 25,
    width: "90%",
    shadowColor: COLORS.secondaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },

  totalVideosText: {
    color: COLORS.textLightGray,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "Segoe UI Semilight",
    textAlign: "center",
  },
  createdVideosList: {
    width: "100%",
    paddingHorizontal: 5,
  },
  createdVideoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    marginBottom: 15,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  createdVideoThumbnail: {
    width: 80,
    height: 45,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.primaryAccent,
  },
  createdVideoInfo: {
    flex: 1,
  },
  createdVideoTitle: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "Segoe UI Semilight",
  },
  createdVideoMeta: {
    color: COLORS.textMediumGray,
    fontSize: 11,
    fontFamily: "Segoe UI Semilight",
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 150,
  },
  emptyStateText: {
    color: COLORS.textMediumGray,
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "Segoe UI Semilight",
  },
  // Bottom decorative shapes
  bottomShapeContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: "hidden",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: "center",
  },
  bottomShapeMain: {
    position: "absolute",
    bottom: -50,
    width: "120%",
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primaryAccent,
    opacity: 0.2,
  },
  bottomShapeAccent: {
    position: "absolute",
    bottom: -60,
    width: "100%",
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.secondaryAccent,
    opacity: 0.1,
    transform: [{ rotate: "-15deg" }],
  },
});

const reportModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalBlur: {
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    maxWidth: 480,
    maxHeight: "80%",
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 15,
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    fontFamily: "Segoe UI Semilight",
  },
  videoTitleText: {
    color: COLORS.textLightGray,
    fontSize: 15,
    fontStyle: "italic",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Segoe UI Semilight",
  },
  sectionLabel: {
    color: COLORS.primaryAccent,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontFamily: "Segoe UI Semilight",
  },
  reasonOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  reasonButton: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
  },
  reasonButtonSelected: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.secondaryAccent,
  },
  reasonButtonText: {
    color: COLORS.textLightGray,
    fontSize: 14,
    fontFamily: "Segoe UI Semilight",
  },
  reasonButtonTextSelected: {
    color: COLORS.cardBackground,
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    width: "100%",
  },
  multilineInput: {
    height: 110,
    paddingTop: 15,
    lineHeight: 20,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryAccent,
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    alignSelf: "center",
    width: "90%",
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  submitButtonText: {
    color: COLORS.cardBackground,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
});

const requestSimilarModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalBlur: {
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    maxWidth: 480,
    maxHeight: "90%",
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 15,
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Segoe UI Semilight",
  },
  originalVideoContext: {
    color: COLORS.textLightGray,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "Segoe UI Semilight",
    lineHeight: 20,
  },
  originalVideoTitle: {
    fontWeight: "bold",
    color: COLORS.primaryAccent,
  },
  originalVideoCreator: {
    fontWeight: "bold",
    color: COLORS.secondaryAccent,
  },
  inputGroup: {
    marginBottom: 20,
    width: "100%",
  },
  inputLabel: {
    color: COLORS.textLightGray,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "Segoe UI Semilight",
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    width: "100%",
  },
  multilineInput: {
    height: 110,
    paddingTop: 15,
    lineHeight: 20,
  },
  privacyToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  privacyToggleText: {
    color: COLORS.textWhite,
    fontSize: 15,
    flex: 1,
    fontFamily: "Segoe UI Semilight",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryAccent,
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    alignSelf: "center",
    width: "90%",
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  submitButtonText: {
    color: COLORS.cardBackground,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
});

const communityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 15, // More padding
  },
  stickyHeader: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 18, // More padding
    paddingBottom: 20, // More padding
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.buttonBorder,
    zIndex: 1,
  },
  communitySearchInput: {
    backgroundColor: COLORS.cardBackground, // Consistent with cards
    borderRadius: 15, // More rounded
    paddingHorizontal: 18,
    paddingVertical: 12, // Thinner input
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
    marginBottom: 15, // More whitespace
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  chipScrollViewContent: {
    paddingRight: 20,
  },
  filterChip: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)", // Subtle background
    borderRadius: 15, // More rounded
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    width: 85, // Slightly wider for space
    height: 75, // Slightly taller for space
  },
  filterChipSelected: {
    backgroundColor: COLORS.primaryAccent, // Bronze for selected chip
    borderColor: COLORS.secondaryAccent, // Darker gold border
  },
  chipIcon: {
    marginBottom: 5,
  },
  filterChipText: {
    color: COLORS.textLightGray,
    fontSize: 11, // Slightly smaller
    fontWeight: "500",
    fontFamily: "Segoe UI Semilight",
    textAlign: "center",
  },
  filterChipTextSelected: {
    color: COLORS.cardBackground,
    fontWeight: "bold",
  },
  dropdownWrapper: {
    marginRight: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    minHeight: 250,
  },
  emptyStateText: {
    color: COLORS.textLightGray,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Segoe UI Semilight",
  },
  emptyStateSubText: {
    color: COLORS.textMediumGray,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Segoe UI Semilight",
  },
  cardGridContainer: {
    paddingHorizontal: 15, // More padding
    paddingTop: 15, // More padding
    paddingBottom: 120, // Room for floating CTA
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    margin: 8, // More margin for grid layout
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    flex: 1,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15, // More padding
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.buttonBorder,
  },
  userAvatar: {
    width: 38, // Slightly larger
    height: 38,
    borderRadius: 10, // Softer rectangle for avatar
    marginRight: 12, // More space
    borderWidth: 1.5, // Thicker border
    borderColor: COLORS.primaryAccent,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Segoe UI Semilight",
  },
  timestamp: {
    color: COLORS.textMediumGray,
    fontSize: 10,
    fontFamily: "Segoe UI Semilight",
  },
  tagBadge: {
    backgroundColor: "rgba(255,255,255,0.1)", // Subtle background
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    color: COLORS.textLightGray,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
  cardBody: {
    padding: 15,
  },
  cardTitle: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Segoe UI Semilight",
    lineHeight: 20,
  },
  cardDescription: {
    color: COLORS.textLightGray,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
    fontFamily: "Segoe UI Semilight",
  },
  attachedImagePlaceholder: {
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
  },
  attachedImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
  },
  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondaryAccent, // Gold for sponsored
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginTop: 8,
    shadowColor: COLORS.secondaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  sponsoredText: {
    color: COLORS.cardBackground,
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 6,
    fontFamily: "Segoe UI Semilight",
  },
  interactionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.buttonBorder,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  interactionCount: {
    color: COLORS.textLightGray,
    fontSize: 12,
    marginLeft: 6,
    fontFamily: "Segoe UI Semilight",
  },
  floatingCTA: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 80 + 20 : 20 + 20, // Adjusted to make space for hint
    right: 30, // Adjusted right margin
    zIndex: 10,
    flexDirection: "column", // Stack hint and button vertically
    alignItems: "flex-end", // Align hint and button to the right
  },
  hintContainer: {
    marginBottom: 15, // Space between hint and button
    alignItems: "flex-end", // Align text within its container
    // Removed specific width/height, let content define
  },
  hintBlurBackground: {
    borderRadius: 15, // Rounded corners for blur background
    overflow: "hidden", // Crucial for blur to respect border radius
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "rgba(255,255,255,0.2)", // Slightly stronger border for frosted glass effect
    borderWidth: 1,
  },
  hintText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontFamily: "Segoe UI Semilight",
    textAlign: "right", // Align text right within its own container
    lineHeight: 20,
  },
  hintArrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5, // Space between lines of text
    // Removed justifyContent for now, rely on parent alignment
  },
  hintArrow: {
    marginLeft: 8, // Space between text and arrow
  },
  floatingCTAButton: {
    width: 55, // Fixed width for square shape
    height: 55, // Fixed height for square shape
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 18, // Rounded corners for square
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  floatingCTAText: {
    // This style will effectively be unused but kept for reference
    color: COLORS.cardBackground,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily: "Segoe UI Semilight",
  },
});

const boostModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalBlur: {
    borderRadius: 25,
    overflow: "hidden",
    width: "90%",
    maxWidth: 480,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 15,
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    fontFamily: "Segoe UI Semilight",
  },
  requestTitleText: {
    color: COLORS.textLightGray,
    fontSize: 15,
    fontStyle: "italic",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Segoe UI Semilight",
  },
  sectionLabel: {
    color: COLORS.primaryAccent,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontFamily: "Segoe UI Semilight",
  },
  amountOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  amountButton: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  amountButtonSelected: {
    backgroundColor: COLORS.secondaryAccent, // Gold for selected
    borderColor: COLORS.secondaryAccent,
  },
  amountButtonText: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
  },
  amountButtonTextSelected: {
    color: COLORS.cardBackground,
  },
  customAmountInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: COLORS.textWhite,
    fontSize: 15,
    fontFamily: "Segoe UI Semilight",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
  },
  impactText: {
    color: COLORS.textLightGray,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Segoe UI Semilight",
  },
  recentBoostersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  boosterAvatar: {
    width: 32, // Slightly larger
    height: 32,
    borderRadius: 16,
    marginRight: -10, // More overlap
    borderWidth: 1.5, // Thicker border
    borderColor: COLORS.primaryAccent, // Bronze border
  },
  moreBoostersText: {
    color: COLORS.textLightGray,
    fontSize: 12,
    marginLeft: 20, // More space
    fontFamily: "Segoe UI Semilight",
  },
  boostButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryAccent,
    paddingVertical: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "center",
    width: "90%",
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  boostButtonText: {
    color: COLORS.cardBackground,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Segoe UI Semilight",
    marginRight: 10,
  },
});

const commentModalStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end", // Ensure content aligns to bottom
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    // The 'top' property is now dynamically set by Animated.Value 'panY'
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: Platform.OS === "android" ? 60 + 20 : 20, // Adjusted for Android navigation bar + more space
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 15,
    overflow: "hidden", // Ensure rounded corners are respected for children
  },
  blurContent: {
    // Added a new style to wrap content for blur effect
    flex: 1,
    borderRadius: 25, // Match modal container radius
    overflow: "hidden",
    backgroundColor: "transparent", // BlurView itself provides the background
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 1,
  },
  draggableBarContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: -5,
    marginBottom: 20,
  },
  draggableBar: {
    width: 60,
    height: 6, // Increased height for better visibility
    backgroundColor: COLORS.textLightGray, // More contrasting color
    borderRadius: 3, // Adjusted border radius
    opacity: 1, // Full opacity
  },
  modalTitle: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Segoe UI Semilight",
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingBottom: 20,
  },
  emptyCommentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
  },
  emptyCommentsText: {
    color: COLORS.textMediumGray,
    fontSize: 15,
    fontStyle: "italic",
    fontFamily: "Segoe UI Semilight",
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primaryAccent,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentUsername: {
    color: COLORS.textWhite,
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 10,
    fontFamily: "Segoe UI Semilight",
  },
  commentTimestamp: {
    color: COLORS.textMediumGray,
    fontSize: 11,
    fontFamily: "Segoe UI Semilight",
  },
  commentText: {
    color: COLORS.textLightGray,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Segoe UI Semilight",
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.buttonBorder,
  },
  replyButtonText: {
    color: COLORS.textLightGray,
    fontSize: 12,
    marginLeft: 6,
    fontFamily: "Segoe UI Semilight",
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingLeft: 18,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  replyTextInput: {
    flex: 1,
    color: COLORS.textWhite,
    fontSize: 14,
    paddingVertical: 12,
    fontFamily: "Segoe UI Semilight",
  },
  sendReplyButton: {
    padding: 10,
    borderRadius: 18,
    backgroundColor: COLORS.primaryAccent,
    marginLeft: 8,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  repliesContainer: {
    marginTop: 15,
    marginLeft: 20,
    borderLeftWidth: 1.5,
    borderLeftColor: COLORS.primaryAccent,
    paddingLeft: 15,
  },
  replyItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primaryAccent,
  },
  replyContent: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  replyUsername: {
    color: COLORS.secondaryAccent, // Gold for reply username
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
    fontFamily: "Segoe UI Semilight",
  },
  replyText: {
    color: COLORS.textLightGray,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Segoe UI Semilight",
  },
  replyTimestamp: {
    color: COLORS.textMediumGray,
    fontSize: 10,
    marginTop: 8,
    alignSelf: "flex-end",
    fontFamily: "Segoe UI Semilight",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.buttonBorder,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === "android" ? 10 : 0, // Adjust for android keyboard
  },
  mainCommentTextInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: COLORS.textWhite,
    fontSize: 16,
    marginRight: 12,
    fontFamily: "Segoe UI Semilight",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  sendCommentButton: {
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 20,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});
