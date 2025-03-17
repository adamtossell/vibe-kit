import { Kit } from '@/types/kit';
import { updateKitsWithGitHubStats } from './github-api';

// Sample data for starter kits
export const starterKits: Kit[] = [
  {
    id: 1,
    name: "Next.js Starter Kit",
    description: "A comprehensive starter template for Next.js projects with TypeScript, Tailwind CSS, and more.",
    category: "web",
    tags: ["next.js", "react", "typescript", "tailwind"],
    stars: 2345, // Will be updated with real data
    forks: 432, // Will be updated with real data
    lastUpdated: "2 weeks ago",
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    author: "vercel",
    repoUrl: "https://github.com/vercel/next.js",
    demoUrl: "https://nextjs.org",
    featured: true,
  },
  {
    id: 2,
    name: "React Native Starter",
    description: "A React Native starter kit with navigation, state management, and styling solutions pre-configured.",
    category: "mobile",
    tags: ["react-native", "expo", "mobile", "typescript"],
    stars: 1876, // Will be updated with real data
    forks: 321, // Will be updated with real data
    lastUpdated: "1 month ago",
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    author: "expo",
    repoUrl: "https://github.com/expo/expo",
    demoUrl: "https://expo.dev",
    featured: false,
  },
  // Add all other starter kits from page.tsx here
  // ...
];

// Store for updated kits data
let updatedKitsData: Kit[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get starter kits with real GitHub stats
 * @param token Optional GitHub token for authenticated requests
 * @returns Starter kits with updated GitHub stats
 */
export async function getStarterKits(token?: string): Promise<Kit[]> {
  const now = Date.now();
  
  // If we have updated data that's less than 24 hours old, return it
  if (updatedKitsData && (now - lastFetchTime) < CACHE_DURATION) {
    return updatedKitsData;
  }
  
  // Otherwise, fetch fresh data from GitHub API
  try {
    const updatedKits = await updateKitsWithGitHubStats(starterKits, token);
    
    // Update cache
    updatedKitsData = updatedKits;
    lastFetchTime = now;
    
    return updatedKits;
  } catch (error) {
    console.error('Error updating kits with GitHub stats:', error);
    
    // If we have cached data, return it even if expired
    if (updatedKitsData) {
      return updatedKitsData;
    }
    
    // Otherwise, return original data
    return starterKits;
  }
}
