export interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  quote: string;
  isVerified: boolean;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  portfolioUrl?: string;
  supportUrl?: string;
  isAIenhanced: boolean;
  followers: number;
}

export interface Video {
  id: string;
  title: string;
  creator: string;
  time: string;
  requestedBy: string;
  thumbnail: string;
  duration: string;
  requested: boolean;
  isAIenhanced: boolean;
}

export interface Requester {
  id: string;
  name: string;
  isTopRequestor: boolean;
  avatar: string;
  bio: string;
  requestPhilosophy: string;
  requestLevel: string;
  joinedDate: string;
  totalRequests: number;
  completedRequests: number;
  mostLikedRequest?: {
    title: string;
    thumbnail: string;
    upvotes: number;
  };
  requestCategories: string[];
  publicProfileLink?: string;
  socialHandles: Record<string, string>;
  communityThankYous: number;
  isSupporter: boolean;
  donatedAmount: number;
  requestedVideos: string[];
}

export interface CommunityRequest {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  tags: string[];
  title: string;
  description: string;
  attachments: Array<{
    type: string;
    uri: string;
  }>;
  upvotes: number;
  comments: number;
  boosts: number;
  tips: number;
  isBookmarked: boolean;
  visibility: string;
  recentBoosters: Array<{
    avatar: string;
  }>;
}

export interface FilterOptions {
  videoType: string;
  sortBy: string;
  duration: string;
  creatorFilters: string[];
  topics: string[];
}