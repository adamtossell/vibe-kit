"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectSeparator, SelectLabel } from "@/components/ui/select"
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
  X,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Kit } from "@/types/kit"
import { useGitHubStats } from "@/hooks/useGitHubStats"
import { StarterKitCard } from "@/components/starter-kit-card"

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
    name: "Create React App",
    description: "Set up a modern web app by running one command. Includes React, JSX, ES6, TypeScript and Flow syntax support.",
    category: "web",
    tags: ["react", "javascript", "typescript", "frontend"],
    stars: 98500,
    forks: 25600,
    lastUpdated: "1 month ago",
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    author: "facebook",
    repoUrl: "https://github.com/facebook/create-react-app",
    demoUrl: "https://create-react-app.dev",
    featured: true,
  },
  {
    id: 12,
    name: "React Admin",
    description: "A frontend framework for building B2B applications running in the browser, on top of REST/GraphQL APIs.",
    category: "web",
    tags: ["react", "admin", "dashboard", "material-ui"],
    stars: 21000,
    forks: 4200,
    lastUpdated: "2 weeks ago",
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    author: "marmelab",
    repoUrl: "https://github.com/marmelab/react-admin",
    demoUrl: "https://marmelab.com/react-admin/",
    featured: false,
  },
  {
    id: 13,
    name: "Chakra UI",
    description: "Simple, modular and accessible UI components for React applications.",
    category: "web",
    tags: ["react", "ui-library", "accessibility", "design-system"],
    stars: 32000,
    forks: 2900,
    lastUpdated: "1 week ago",
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    author: "chakra-ui",
    repoUrl: "https://github.com/chakra-ui/chakra-ui",
    demoUrl: "https://chakra-ui.com",
    featured: true,
  },
  {
    id: 14,
    name: "Tailwind CSS",
    description: "A utility-first CSS framework for rapidly building custom user interfaces.",
    category: "web",
    tags: ["css", "design", "frontend", "utility"],
    stars: 68000,
    forks: 3400,
    lastUpdated: "3 days ago",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    author: "tailwindlabs",
    repoUrl: "https://github.com/tailwindlabs/tailwindcss",
    demoUrl: "https://tailwindcss.com",
    featured: true,
  },
  {
    id: 15,
    name: "Fastify",
    description: "Fast and low overhead web framework for Node.js",
    category: "backend",
    tags: ["node.js", "web-framework", "performance", "javascript"],
    stars: 26000,
    forks: 2100,
    lastUpdated: "5 days ago",
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    author: "fastify",
    repoUrl: "https://github.com/fastify/fastify",
    demoUrl: "https://www.fastify.io",
    featured: false,
  }
]

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
    case "android":
    case "kotlin":
    case "compose":
    case "mvvm":
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

function getTagColor(tag: string) {
  switch (tag.toLowerCase()) {
    // Frontend/Web Technologies (Sky-600)
    case "next.js":
    case "react":
    case "react-native":
    case "vue.js":
    case "svelte":
    case "sveltekit":
      return "oklch(0.609 0.126 221.723)"
    
    // Languages/File Types (Indigo-600)
    case "typescript":
    case "javascript":
    case "kotlin":
      return "oklch(0.591 0.191 264.043)"
    
    // Styling (Fuchsia-600)
    case "tailwind":
    case "compose":
      return "oklch(0.585 0.248 332.394)"
    
    // Mobile Development (Teal-600)
    case "mobile":
    case "expo":
    case "flutter":
    case "dart":
    case "cross-platform":
    case "android":
    case "mvvm":
      return "oklch(0.576 0.121 196.844)"

    // Backend/Server (Emerald-600)
    case "express":
    case "node.js":
    case "api":
    case "django":
    case "python":
    case "laravel":
    case "php":
      return "oklch(0.561 0.139 160.503)"

    // Database (Blue-600)
    case "mongodb":
    case "postgresql":
      return "oklch(0.570 0.191 242.493)"

    // Web/Frontend (Violet-600)
    case "web":
    case "frontend":
      return "oklch(0.597 0.196 282.078)"

    // Specialized Categories (Purple-600)
    case "dashboard":
    case "docker":
    case "go":
      return "oklch(0.591 0.219 292.409)"

    // Default (Slate-600)
    default:
      return "oklch(0.518 0.017 255.121)"
  }
}

export default function StarterKitsDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState<number[]>([])
  const itemsPerPage = 18
  
  // Use the GitHub stats hook to get real-time star and fork counts
  const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";
  const { kits, loading } = useGitHubStats(starterKits, githubToken);

  // Toggle favorite status of a kit
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((kitId) => kitId !== id) : [...prev, id]))
  }

  // Filter starter kits based on search query and selected categories
  const filteredKits = kits.filter((kit) => {
    const matchesSearch =
      kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kit.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(kit.category) ||
      kit.tags.some(tag => selectedCategories.includes(tag))
    
    return matchesSearch && matchesCategory
  })

  // Sort the filtered kits
  const sortedKits = [...filteredKits].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.stars - a.stars
      case "recent":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      case "forks":
        return b.forks - a.forks
      default:
        return 0
    }
  })

  // Get featured kits
  const featuredKits = kits.filter((kit) => kit.featured)

  const totalPages = Math.ceil(sortedKits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedKits = sortedKits.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-20 px-4">
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">GitHub Starter Kits</h1>
            <p className="text-slate-500 max-w-2xl">
              Discover and use high-quality starter templates for your next project. All kits are open-source and ready
              to use.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 md:max-w-[480px]">
              <Input
                placeholder="Search by name, description or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                className="w-full border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:ml-auto">
              <Select 
                value={selectedCategories.length > 0 ? "has-selected" : undefined}
                onValueChange={() => {}}
              >
                <SelectTrigger 
                  className="w-full sm:w-[192px] border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-slate-800"
                >
                  <SelectValue placeholder="Select category" className="text-slate-500 data-[state=placeholder]:text-slate-500">
                    {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : "Select category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="border-slate-200">
                  <div className="overflow-y-auto pb-[40px]" style={{ maxHeight: "calc(20rem - 40px)" }}>
                    {/* Frontend/Web Technologies */}
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-slate-700">Frontend & Web</SelectLabel>
                      {["next.js", "react", "vue.js", "svelte"].map(category => (
                        <div 
                          key={category} 
                          className="relative flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            setSelectedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-[oklch(0.6112_0.1906_271.6)] cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="text-slate-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                      ))}
                    </SelectGroup>

                    {/* Languages */}
                    <SelectSeparator className="my-2" />
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-slate-700">Languages</SelectLabel>
                      {["typescript", "javascript"].map(category => (
                        <div 
                          key={category} 
                          className="relative flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            setSelectedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-[oklch(0.6112_0.1906_271.6)] cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="text-slate-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                      ))}
                    </SelectGroup>

                    {/* Styling */}
                    <SelectSeparator className="my-2" />
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-slate-700">Styling</SelectLabel>
                      {["tailwind"].map(category => (
                        <div 
                          key={category} 
                          className="relative flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            setSelectedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-[oklch(0.6112_0.1906_271.6)] cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="text-slate-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                      ))}
                    </SelectGroup>

                    {/* Mobile */}
                    <SelectSeparator className="my-2" />
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-slate-700">Mobile Development</SelectLabel>
                      {["mobile", "flutter", "react-native", "kotlin", "android", "mvvm", "compose"].map(category => (
                        <div 
                          key={category} 
                          className="relative flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            setSelectedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-[oklch(0.6112_0.1906_271.6)] cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="text-slate-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                      ))}
                    </SelectGroup>

                    {/* Backend */}
                    <SelectSeparator className="my-2" />
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-slate-700">Backend & Server</SelectLabel>
                      {["express", "node.js", "django", "php"].map(category => (
                        <div 
                          key={category} 
                          className="relative flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            setSelectedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-[oklch(0.6112_0.1906_271.6)] cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="text-slate-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                      ))}
                    </SelectGroup>

                    {/* Database */}
                    <SelectSeparator className="my-2" />
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-slate-700">Database</SelectLabel>
                      {["mongodb", "postgresql"].map(category => (
                        <div 
                          key={category} 
                          className="relative flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            setSelectedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-[oklch(0.6112_0.1906_271.6)] cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="text-slate-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                      ))}
                    </SelectGroup>

                    {/* Specialized */}
                    <SelectSeparator className="my-2" />
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-slate-700">Specialized</SelectLabel>
                      {["dashboard", "docker", "go"].map(category => (
                        <div 
                          key={category} 
                          className="relative flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            setSelectedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category)
                                : [...prev, category]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-2 accent-[oklch(0.6112_0.1906_271.6)] cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="text-slate-600">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                      ))}
                    </SelectGroup>
                  </div>

                  <div className="sticky bottom-0 left-0 right-0 p-2 bg-white border-t border-slate-200">
                    <Button
                      variant="ghost"
                      className={`w-full h-8 text-sm ${
                        selectedCategories.length > 0 
                          ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" 
                          : "text-slate-400 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedCategories([])
                      }}
                      disabled={selectedCategories.length === 0}
                    >
                      Clear filters {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ""}
                    </Button>
                  </div>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger 
                  className="w-full sm:w-[192px] border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-slate-800"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-slate-200">
                  <SelectItem 
                    value="popular" 
                    className="text-slate-600 data-[highlighted]:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-800"
                  >
                    Popular
                  </SelectItem>
                  <SelectItem 
                    value="forks" 
                    className="text-slate-600 data-[highlighted]:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-800"
                  >
                    Most Forks
                  </SelectItem>
                  <SelectItem 
                    value="recent" 
                    className="text-slate-600 data-[highlighted]:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-800"
                  >
                    Recently Updated
                  </SelectItem>
                  <SelectItem 
                    value="name" 
                    className="text-slate-600 data-[highlighted]:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-800"
                  >
                    Name (A-Z)
                  </SelectItem>
                  <SelectItem 
                    value="name-desc" 
                    className="text-slate-600 data-[highlighted]:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-800"
                  >
                    Name (Z-A)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCategories.length > 0 && (
            <div className="mt-4">
              {selectedCategories.map((category) => {
                const tagColor = getTagColor(category);
                return (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="text-xs py-[2px] px-[10px] mr-2 inline-flex items-center border-slate-200"
                    style={{ 
                      color: tagColor,
                    }}
                  >
                    {getTagIcon(category)}
                    {category}
                    <button
                      onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                      className="ml-1 hover:text-destructive"
                      style={{ 
                        color: tagColor,
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              <span
                onClick={() => setSelectedCategories([])}
                className="text-[14px] text-slate-500 hover:text-slate-800 cursor-pointer ml-3"
              >
                Clear all
              </span>
            </div>
          )}

          <Tabs defaultValue="all" className="mt-4 mb-8">
            <TabsList className="mb-6 bg-slate-100">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-600"
              >
                All Kits
              </TabsTrigger>
              <TabsTrigger 
                value="featured"
                className="data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-600"
              >
                Featured
              </TabsTrigger>
              {favorites.length > 0 && (
                <TabsTrigger 
                  value="favorites"
                  className="data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-600"
                >
                  Favorites ({favorites.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all">
              {sortedKits.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-8">
                    {paginatedKits.map((kit) => (
                      <StarterKitCard
                        key={kit.id}
                        kit={kit}
                        isFavorite={favorites.includes(kit.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 p-0 border-slate-200 hover:border-slate-300 disabled:border-slate-200 disabled:text-slate-400"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "outline" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 ${
                              currentPage === page 
                                ? "bg-slate-50 border-slate-300 text-slate-800" 
                                : "border-slate-200 text-slate-800 hover:border-slate-300"
                            }`}
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
                        className="w-8 h-8 p-0 border-slate-200 hover:border-slate-300 disabled:border-slate-200 disabled:text-slate-400"
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
                      setSelectedCategories([])
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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
