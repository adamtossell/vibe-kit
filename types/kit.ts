export interface Kit {
  id: number;
  name: string;
  description: string;
  category: string;
  tags: string[];
  stars: number;
  forks: number;
  lastUpdated: string;
  updatedAt: Date;
  author: string;
  repoUrl: string;
  demoUrl: string | null;
  featured: boolean;
}
