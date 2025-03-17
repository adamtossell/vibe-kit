import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Copy,
  Download,
  ExternalLink,
  Github,
  Star,
  GitFork,
  Heart,
  Code2,
  FileJson,
  Palette,
  Smartphone,
  Cpu,
  MonitorSmartphone,
  Server,
  Database,
  Globe,
  PieChart,
  Boxes,
  DockIcon as Docker,
  Braces,
  Workflow,
} from "lucide-react";
import { Kit } from "@/types/kit";

// Props for the StarterKitCard component
interface StarterKitCardProps {
  kit: Kit;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

// Function to get the appropriate icon for a tag
export function getTagIcon(tag: string) {
  switch (tag.toLowerCase()) {
    case "next.js":
      return <Code2 className="w-3 h-3 mr-1" />;
    case "react":
    case "react-native":
      return <Code2 className="w-3 h-3 mr-1" />;
    case "typescript":
      return <FileJson className="w-3 h-3 mr-1" />;
    case "javascript":
      return <Braces className="w-3 h-3 mr-1" />;
    case "tailwind":
      return <Palette className="w-3 h-3 mr-1" />;
    case "mobile":
    case "expo":
      return <Smartphone className="w-3 h-3 mr-1" />;
    case "vscode":
    case "extension":
      return <Cpu className="w-3 h-3 mr-1" />;
    case "electron":
    case "desktop":
      return <MonitorSmartphone className="w-3 h-3 mr-1" />;
    case "express":
    case "node.js":
    case "api":
      return <Server className="w-3 h-3 mr-1" />;
    case "mongodb":
    case "postgresql":
      return <Database className="w-3 h-3 mr-1" />;
    case "flutter":
    case "dart":
    case "cross-platform":
      return <Smartphone className="w-3 h-3 mr-1" />;
    case "django":
    case "python":
    case "laravel":
    case "php":
      return <Server className="w-3 h-3 mr-1" />;
    case "vue.js":
    case "svelte":
    case "sveltekit":
      return <Code2 className="w-3 h-3 mr-1" />;
    case "web":
    case "frontend":
      return <Globe className="w-3 h-3 mr-1" />;
    case "dashboard":
      return <PieChart className="w-3 h-3 mr-1" />;
    case "charts":
      return <PieChart className="w-3 h-3 mr-1" />;
    case "go":
      return <Boxes className="w-3 h-3 mr-1" />;
    case "docker":
      return <Docker className="w-3 h-3 mr-1" />;
    default:
      return <Workflow className="w-3 h-3 mr-1" />;
  }
}

// Function to get the color for a tag
export function getTagColor(tag: string) {
  switch (tag.toLowerCase()) {
    // Frontend/Web Technologies (Sky-600)
    case "next.js":
    case "react":
    case "react-native":
    case "vue.js":
    case "svelte":
    case "sveltekit":
      return "oklch(0.609 0.126 221.723)";
    
    // Languages/File Types (Indigo-600)
    case "typescript":
    case "javascript":
      return "oklch(0.591 0.191 264.043)";
    
    // Styling (Fuchsia-600)
    case "tailwind":
      return "oklch(0.585 0.248 332.394)";
    
    // Mobile Development (Teal-600)
    case "mobile":
    case "expo":
    case "flutter":
    case "dart":
    case "cross-platform":
      return "oklch(0.576 0.121 196.844)";

    // Backend/Server (Emerald-600)
    case "express":
    case "node.js":
    case "api":
    case "django":
    case "python":
    case "laravel":
    case "php":
      return "oklch(0.561 0.139 160.503)";

    // Database (Blue-600)
    case "mongodb":
    case "postgresql":
      return "oklch(0.570 0.191 242.493)";

    // Web/Frontend (Violet-600)
    case "web":
    case "frontend":
      return "oklch(0.597 0.196 282.078)";

    // Specialized Categories (Purple-600)
    case "dashboard":
    case "charts":
    case "go":
    case "docker":
      return "oklch(0.591 0.219 292.409)";

    // Default (Slate-600)
    default:
      return "oklch(0.518 0.017 255.121)";
  }
}

export function StarterKitCard({ kit, isFavorite, onToggleFavorite }: StarterKitCardProps) {
  return (
    <Card className="overflow-hidden border border-slate-200">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-slate-900">{kit.name}</CardTitle>
          <div className="flex items-center gap-2">
            {kit.featured && (
              <Badge className="bg-indigo-50 text-indigo-500 hover:bg-indigo-50 border border-indigo-100 shadow-none text-xs py-0.5">
                Featured
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onToggleFavorite(kit.id)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-slate-900"
                }`}
              />
            </Button>
          </div>
        </div>
        <CardDescription className="text-slate-500 mt-1 line-clamp-2">{kit.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-1 mb-4">
          {kit.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs py-0.5 px-2 flex items-center border-slate-200"
              style={{
                color: getTagColor(tag),
              }}
            >
              {getTagIcon(tag)}
              {tag}
            </Badge>
          ))}
          {kit.tags.length > 4 && (
            <Badge
              variant="outline"
              className="text-xs py-0.5 px-2 flex items-center border-slate-200 text-slate-500"
            >
              +{kit.tags.length - 4} more
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-slate-500 space-x-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-amber-500" />
            <span>{kit.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <GitFork className="h-4 w-4 mr-1 text-slate-400" />
            <span>{kit.forks.toLocaleString()}</span>
          </div>
          <div className="text-xs text-slate-400 ml-auto">
            by <a
              href={`https://github.com/${kit.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 hover:text-indigo-500 hover:underline"
            >
              {kit.author}
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
        <div className="flex space-x-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs border-slate-200 hover:border-slate-300 text-slate-600"
            asChild
          >
            <a href={kit.downloadUrl || kit.repoUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </a>
          </Button>
          <Button
            variant="dark"
            size="sm"
            className="flex-1 h-8 text-xs"
            asChild
          >
            <a href={kit.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5 mr-1" />
              Repository
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
