"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  Download,
  ExternalLink,
  Github,
  Star,
  GitFork,
  ChevronLeft,
  ChevronRight,
  Heart,
  Code2,
  FileJson,
  Palette,
  Smartphone,
  Cpu,
  MonitorSmartphone,
  LayoutDashboard,
  Server,
  Database,
  Globe,
  PieChart,
  Boxes,
  DockIcon as Docker,
  Braces,
  Workflow,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

// Sample data for starter kits
const starterKits = [
  {
    id: 1,
    name: "Next.js Starter Kit",
    description: "A comprehensive starter template for Next.js projects with TypeScript, Tailwind CSS, and more.",
    category: "web",
    tags: ["next.js", "react", "typescript", "tailwind"],
    stars: 2345,
    forks: 432,
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
    stars: 1876,
    forks: 321,
    lastUpdated: "1 month ago",
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    author: "expo",
    repoUrl: "https://github.com/expo/expo",
    demoUrl: "https://expo.dev",
    featured: false,
  },
  {
    id: 3,
    name: "VS Code Extension Starter",
    description: "A starter template for building VS Code extensions with TypeScript.",
    category: "tools",
    tags: ["vscode", "extension", "typescript"],
    stars: 987,
    forks: 156,
    lastUpdated: "3 weeks ago",
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    author: "microsoft",
    repoUrl: "https://github.com/microsoft/vscode-extension-samples",
    demoUrl: null,
    featured: false,
  },
  {
    id: 4,
    name: "Electron App Boilerplate",
    description: "A minimalistic boilerplate for Electron applications with React and TypeScript.",
    category: "desktop",
    tags: ["electron", "react", "desktop", "typescript"],
    stars: 1543,
    forks: 287,
    lastUpdated: "1 week ago",
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    author: "electron-react-boilerplate",
    repoUrl: "https://github.com/electron-react-boilerplate/electron-react-boilerplate",
    demoUrl: null,
    featured: true,
  },
  {
    id: 5,
    name: "Express API Starter",
    description: "A starter template for building RESTful APIs with Express.js, TypeScript, and MongoDB.",
    category: "backend",
    tags: ["express", "node.js", "api", "mongodb"],
    stars: 1234,
    forks: 198,
    lastUpdated: "2 months ago",
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
    author: "expressjs",
    repoUrl: "https://github.com/expressjs/express",
    demoUrl: null,
    featured: false,
  },
  {
    id: 6,
    name: "Flutter Starter Kit",
    description: "A comprehensive starter kit for Flutter applications with state management, routing, and more.",
    category: "mobile",
    tags: ["flutter", "dart", "mobile", "cross-platform"],
    stars: 2109,
    forks: 345,
    lastUpdated: "3 weeks ago",
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    author: "flutter",
    repoUrl: "https://github.com/flutter/flutter",
    demoUrl: "https://flutter.dev",
    featured: true,
  },
  {
    id: 7,
    name: "Django Starter",
    description: "A Django starter template with user authentication, admin panel, and PostgreSQL configuration.",
    category: "backend",
    tags: ["django", "python", "web", "postgresql"],
    stars: 1432,
    forks: 231,
    lastUpdated: "1 month ago",
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    author: "django",
    repoUrl: "https://github.com/django/django",
    demoUrl: null,
    featured: false,
  },
  {
    id: 8,
    name: "Vue.js Starter Kit",
    description: "A Vue.js starter kit with Vuex, Vue Router, and Tailwind CSS pre-configured.",
    category: "web",
    tags: ["vue.js", "javascript", "tailwind", "frontend"],
    stars: 1876,
    forks: 298,
    lastUpdated: "2 weeks ago",
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    author: "vuejs",
    repoUrl: "https://github.com/vuejs/vue",
    demoUrl: "https://vuejs.org",
    featured: false,
  },
  {
    id: 9,
    name: "Svelte Starter Kit",
    description: "A Svelte starter kit with SvelteKit, TypeScript, and Tailwind CSS pre-configured.",
    category: "web",
    tags: ["svelte", "sveltekit", "typescript", "tailwind"],
    stars: 1543,
    forks: 231,
    lastUpdated: "3 days ago",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    author: "sveltejs",
    repoUrl: "https://github.com/sveltejs/kit",
    demoUrl: "https://kit.svelte.dev",
    featured: true,
  },
  {
    id: 10,
    name: "Laravel Starter Kit",
    description: "A Laravel starter kit with authentication, admin panel, and PostgreSQL configuration.",
    category: "backend",
    tags: ["laravel", "php", "web", "postgresql"],
    stars: 1876,
    forks: 345,
    lastUpdated: "1 week ago",
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    author: "laravel",
    repoUrl: "https://github.com/laravel/laravel",
    demoUrl: "https://laravel.com",
    featured: false,
  },
  {
    id: 11,
    name: "React Dashboard Starter",
    description: "A React dashboard starter kit with charts, tables, and authentication pre-configured.",
    category: "web",
    tags: ["react", "dashboard", "typescript", "charts"],
    stars: 2345,
    forks: 432,
    lastUpdated: "5 days ago",
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    author: "reactjs",
    repoUrl: "https://github.com/reactjs/reactjs.org",
    demoUrl: "https://reactjs.org",
    featured: true,
  },
  {
    id: 12,
    name: "Go API Starter",
    description: "A Go API starter kit with authentication, database, and Docker configuration.",
    category: "backend",
    tags: ["go", "api", "docker", "postgresql"],
    stars: 1234,
    forks: 198,
    lastUpdated: "2 weeks ago",
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    author: "golang",
    repoUrl: "https://github.com/golang/go",
    demoUrl: null,
    featured: false,
  },
]

// Function to get the appropriate icon for a tag
function getTagIcon(tag: string) {
  switch (tag.toLowerCase()) {
    case "next.js":
      return <Code2 className="w-3 h-3 mr-1" />
    case "react":
    case "react-native":
      return <Code2 className="w-3 h-3 mr-1" />
    case "typescript":
      return <FileJson className="w-3 h-3 mr-1" />
    case "javascript":
      return <Braces className="w-3 h-3 mr-1" />
    case "tailwind":
      return <Palette className="w-3 h-3 mr-1" />
    case "mobile":
    case "expo":
      return <Smartphone className="w-3 h-3 mr-1" />
    case "vscode":
    case "extension":
      return <Cpu className="w-3 h-3 mr-1" />
    case "electron":
    case "desktop":
      return <MonitorSmartphone className="w-3 h-3 mr-1" />
    case "express":
    case "node.js":
    case "api":
      return <Server className="w-3 h-3 mr-1" />
    case "mongodb":
    case "postgresql":
      return <Database className="w-3 h-3 mr-1" />
    case "flutter":
    case "dart":
    case "cross-platform":
      return <Smartphone className="w-3 h-3 mr-1" />
    case "django":
    case "python":
    case "laravel":
    case "php":
      return <Server className="w-3 h-3 mr-1" />
    case "vue.js":
    case "svelte":
    case "sveltekit":
      return <Code2 className="w-3 h-3 mr-1" />
    case "web":
    case "frontend":
      return <Globe className="w-3 h-3 mr-1" />
    case "dashboard":
      return <LayoutDashboard className="w-3 h-3 mr-1" />
    case "charts":
      return <PieChart className="w-3 h-3 mr-1" />
    case "go":
      return <Boxes className="w-3 h-3 mr-1" />
    case "docker":
      return <Docker className="w-3 h-3 mr-1" />
    default:
      return <Workflow className="w-3 h-3 mr-1" />
  }
}

export default function StarterKitsDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState<number[]>([])
  const itemsPerPage = 6

  // Toggle favorite status of a kit
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((kitId) => kitId !== id) : [...prev, id]))
  }

  // Filter starter kits based on search query and selected category
  const filteredKits = starterKits.filter((kit) => {
    const matchesSearch =
      kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || kit.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Sort the filtered kits
  const sortedKits = [...filteredKits].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.stars * 1.5 + b.forks - (a.stars * 1.5 + a.forks)
      case "stars":
        return b.stars - a.stars
      case "forks":
        return b.forks - a.forks
      case "recent":
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return b.stars * 1.5 + b.forks - (a.stars * 1.5 + a.forks)
    }
  })

  // Get featured kits
  const featuredKits = starterKits.filter((kit) => kit.featured)

  // Pagination logic
  const totalPages = Math.ceil(sortedKits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedKits = sortedKits.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">GitHub Starter Kits</h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover and use high-quality starter templates for your next project. All kits are open-source and ready
              to use.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                placeholder="Search by name, description or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="stars">Most Liked</SelectItem>
                  <SelectItem value="forks">Most Forks</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Kits</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              {favorites.length > 0 && <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>}
            </TabsList>

            <TabsContent value="all">
              {sortedKits.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedKits.map((kit) => (
                      <StarterKitCard
                        key={kit.id}
                        kit={kit}
                        isFavorite={favorites.includes(kit.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 ${currentPage === page ? "bg-[#a855f7] hover:bg-[#9333ea]" : ""}`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No starter kits found matching your criteria.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredKits.map((kit) => (
                  <StarterKitCard
                    key={kit.id}
                    kit={kit}
                    isFavorite={favorites.includes(kit.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </TabsContent>

            {favorites.length > 0 && (
              <TabsContent value="favorites">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {starterKits
                    .filter((kit) => favorites.includes(kit.id))
                    .map((kit) => (
                      <StarterKitCard key={kit.id} kit={kit} isFavorite={true} onToggleFavorite={toggleFavorite} />
                    ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function StarterKitCard({ kit, isFavorite, onToggleFavorite }) {
  return (
    <Card className="h-full flex flex-col relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 hover:bg-background/80"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleFavorite(kit.id)
        }}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-[#a855f7] text-[#a855f7]" : "text-muted-foreground"}`} />
        <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
      </Button>

      <CardHeader>
        <div className="flex justify-between items-start pr-8">
          <CardTitle className="text-xl">{kit.name}</CardTitle>
          {kit.featured && (
            <Badge variant="secondary" className="ml-2">
              Featured
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{kit.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {kit.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs flex items-center">
              {getTagIcon(tag)}
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-4 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {kit.stars.toLocaleString()}
          </div>
          <div className="flex items-center">
            <GitFork className="w-4 h-4 mr-1" />
            {kit.forks.toLocaleString()}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Updated {kit.lastUpdated}</div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1" style={{ backgroundColor: "black", borderColor: "black" }}>
            <Link href={kit.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View Repo
            </Link>
          </Button>
          <Button variant="outline" className="px-3">
            <Copy className="w-4 h-4" />
            <span className="sr-only">Copy Clone URL</span>
          </Button>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="secondary" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {kit.demoUrl && (
            <Button variant="outline" asChild className="flex-1">
              <Link href={kit.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

