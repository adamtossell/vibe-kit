import { useState, useEffect } from 'react';
import { Kit } from '@/types/kit';

interface GitHubRepoData {
  stargazers_count: number;
  forks_count: number;
}

interface CachedData {
  [repoUrl: string]: {
    stars: number;
    forks: number;
    lastFetched: number;
  };
}

// 12 hours in milliseconds
const CACHE_DURATION = 12 * 60 * 60 * 1000;

// Cache in localStorage
const CACHE_KEY = 'github-repo-stats-cache';

/**
 * Extract owner and repo from GitHub URL
 */
function extractRepoInfo(repoUrl: string): { owner: string; repo: string } | null {
  // Handle different GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,          // Standard github.com/owner/repo
    /github\.com\/([^\/]+)\/([^\/]+)(\/|$)/,    // With trailing slash or end of string
    /github\.com\/([^\/]+)\/([^\/\.]+)(\.git)?/ // With optional .git extension
  ];
  
  for (const pattern of patterns) {
    const match = repoUrl.match(pattern);
    if (match && match[1] && match[2]) {
      // Clean up the repo name by removing .git extension or trailing slashes
      let repo = match[2];
      repo = repo.replace(/\.git$/, '');
      repo = repo.replace(/\/$/, '');
      
      return { owner: match[1], repo };
    }
  }
  
  console.warn(`Could not extract owner/repo from URL: ${repoUrl}`);
  return null;
}

/**
 * Fetch repository data from GitHub API
 */
async function fetchRepoData(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepoData | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    
    const response = await fetch(url, {
      headers,
    });
    
    if (!response.ok) {
      // For 404 errors, we'll just silently fail and use the default values
      if (response.status === 404) {
        console.warn(`Repository not found: ${owner}/${repo} - Using default values`);
      } else {
        console.error(`GitHub API error: ${response.status} for ${owner}/${repo}`);
      }
      return null;
    }
    
    return await response.json() as GitHubRepoData;
  } catch (error) {
    console.error(`Error fetching GitHub repo data for ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Load cache from localStorage
 */
function loadCache(): CachedData {
  if (typeof window === 'undefined') return {};
  
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : {};
  } catch (error) {
    console.error('Error loading cache:', error);
    return {};
  }
}

/**
 * Save cache to localStorage
 */
function saveCache(cache: CachedData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

/**
 * Custom hook to update kits with GitHub stats
 */
export function useGitHubStats(initialKits: Kit[], githubToken?: string) {
  const [kits, setKits] = useState<Kit[]>(initialKits);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const cache = loadCache();
    const now = Date.now();
    
    // Map of fallback repositories for organizations
    const fallbackRepos: Record<string, string> = {
      'vercel': 'next.js',
      'react-native-community': 'react-native',
      'vuejs': 'vue',
      'android': 'kotlin',
      'sveltejs': 'svelte',
      'flutter': 'flutter',
      'django': 'django',
      'expressjs': 'express',
      'laravel': 'laravel',
      'electron-react-boilerplate': 'electron-react-boilerplate'
    };
    
    async function updateKits() {
      setLoading(true);
      
      const updatedKits = [...initialKits];
      const updatedCache = { ...cache };
      const fetchPromises: Promise<void>[] = [];
      
      for (const kit of updatedKits) {
        if (!kit.repoUrl) continue;
        
        const repoInfo = extractRepoInfo(kit.repoUrl);
        if (!repoInfo) continue;
        
        let { owner, repo } = repoInfo;
        const cacheKey = `${owner}/${repo}`;
        
        // Check if we have valid cached data
        if (cache[cacheKey] && (now - cache[cacheKey].lastFetched) < CACHE_DURATION) {
          kit.stars = cache[cacheKey].stars;
          kit.forks = cache[cacheKey].forks;
          continue;
        }
        
        // Need to fetch fresh data
        const fetchPromise = async () => {
          try {
            // Try to fetch the original repository
            let data = await fetchRepoData(owner, repo, githubToken);
            
            // If not found, try the fallback repository for the organization
            if (!data && fallbackRepos[owner]) {
              const fallbackRepo = fallbackRepos[owner];
              const fallbackCacheKey = `${owner}/${fallbackRepo}`;
              
              // Check if we have the fallback in cache
              if (cache[fallbackCacheKey] && (now - cache[fallbackCacheKey].lastFetched) < CACHE_DURATION) {
                kit.stars = cache[fallbackCacheKey].stars;
                kit.forks = cache[fallbackCacheKey].forks;
                return;
              }
              
              // Try to fetch the fallback
              data = await fetchRepoData(owner, fallbackRepo, githubToken);
              
              if (data && isMounted) {
                kit.stars = data.stargazers_count;
                kit.forks = data.forks_count;
                
                // Update cache with fallback data
                updatedCache[fallbackCacheKey] = {
                  stars: data.stargazers_count,
                  forks: data.forks_count,
                  lastFetched: now
                };
              }
            } else if (data && isMounted) {
              kit.stars = data.stargazers_count;
              kit.forks = data.forks_count;
              
              // Update cache
              updatedCache[cacheKey] = {
                stars: data.stargazers_count,
                forks: data.forks_count,
                lastFetched: now
              };
            }
          } catch (error) {
            console.error(`Error fetching data for ${owner}/${repo}:`, error);
            // If fetch fails, keep the original values
          }
        };
        
        // Add a small delay between requests to avoid rate limiting
        fetchPromises.push(
          new Promise<void>(resolve => {
            setTimeout(async () => {
              await fetchPromise();
              resolve();
            }, fetchPromises.length * 100); // 100ms delay between requests
          })
        );
      }
      
      // Wait for all fetch operations to complete
      await Promise.all(fetchPromises);
      
      if (isMounted) {
        setKits(updatedKits);
        setLoading(false);
        saveCache(updatedCache);
      }
    }
    
    updateKits();
    
    // Set up interval to refresh data every 12 hours if the component stays mounted
    const interval = setInterval(() => {
      updateKits();
    }, CACHE_DURATION);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [initialKits, githubToken]);
  
  return { kits, loading };
}
