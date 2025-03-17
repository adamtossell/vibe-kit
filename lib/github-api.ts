import { Kit } from '@/types/kit';

interface GitHubRepoData {
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface CachedRepoData {
  stars: number;
  forks: number;
  lastFetched: number; // timestamp
}

// Cache object to store GitHub API responses
const repoDataCache: Record<string, CachedRepoData> = {};

// 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Fetch repository data from GitHub API
 * @param owner Repository owner/organization
 * @param repo Repository name
 * @param token Optional GitHub token for authenticated requests
 * @returns Repository data or null if fetch failed
 */
export async function fetchRepoData(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepoData | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    });
    
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json() as GitHubRepoData;
  } catch (error) {
    console.error('Error fetching GitHub repo data:', error);
    return null;
  }
}

/**
 * Get repository data with caching
 * @param repoUrl GitHub repository URL
 * @param token Optional GitHub token for authenticated requests
 * @returns Object with stars and forks counts
 */
export async function getRepoStats(
  repoUrl: string,
  token?: string
): Promise<{ stars: number; forks: number }> {
  // Extract owner and repo from GitHub URL
  const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!urlMatch) {
    console.error('Invalid GitHub URL:', repoUrl);
    return { stars: 0, forks: 0 };
  }
  
  const [, owner, repo] = urlMatch;
  const cacheKey = `${owner}/${repo}`;
  
  // Check if we have cached data that's still valid
  const cachedData = repoDataCache[cacheKey];
  const now = Date.now();
  
  if (cachedData && (now - cachedData.lastFetched) < CACHE_DURATION) {
    return {
      stars: cachedData.stars,
      forks: cachedData.forks
    };
  }
  
  // Fetch fresh data from GitHub API
  const repoData = await fetchRepoData(owner, repo, token);
  
  if (!repoData) {
    // If fetch failed but we have cached data, return it even if expired
    if (cachedData) {
      return {
        stars: cachedData.stars,
        forks: cachedData.forks
      };
    }
    return { stars: 0, forks: 0 };
  }
  
  // Update cache
  const newCacheData = {
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    lastFetched: now
  };
  
  repoDataCache[cacheKey] = newCacheData;
  
  return {
    stars: repoData.stargazers_count,
    forks: repoData.forks_count
  };
}

/**
 * Update kit data with real GitHub stats
 * @param kits Array of kit objects
 * @param token Optional GitHub token for authenticated requests
 * @returns Updated kits with real GitHub stats
 */
export async function updateKitsWithGitHubStats(
  kits: Kit[],
  token?: string
): Promise<Kit[]> {
  const updatedKits = [...kits];
  
  // Process all kits in parallel
  const updatePromises = updatedKits.map(async (kit) => {
    if (!kit.repoUrl) return kit;
    
    try {
      const { stars, forks } = await getRepoStats(kit.repoUrl, token);
      
      // Update kit with real data
      kit.stars = stars;
      kit.forks = forks;
      
      return kit;
    } catch (error) {
      console.error(`Error updating stats for kit ${kit.name}:`, error);
      return kit;
    }
  });
  
  // Wait for all updates to complete
  await Promise.all(updatePromises);
  
  return updatedKits;
}
