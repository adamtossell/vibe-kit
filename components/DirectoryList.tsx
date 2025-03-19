"use client"

import { StarterKitCard } from "@/components/starter-kit-card"
import { useGitHubStats } from "@/hooks/useGitHubStats"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { starterKits } from "@/lib/starter-kits-data"

interface DirectoryListProps {
  showOnlyFavorites?: boolean
}

export function DirectoryList({ showOnlyFavorites = false }: DirectoryListProps) {
  const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ""
  const { kits, loading: kitsLoading } = useGitHubStats(starterKits, githubToken)
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites()
  const { user, loading: authLoading } = useAuth()

  // Wait for authentication to complete
  if (authLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // If we're showing favorites and there's no user, show a message
  if (showOnlyFavorites && !user) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Please sign in to view your favorites</p>
      </div>
    )
  }

  // Filter kits if showing only favorites
  const displayedKits = showOnlyFavorites
    ? kits.filter((kit) => favorites.includes(kit.id))
    : kits

  if (kitsLoading || favoritesLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading starter kits...</p>
      </div>
    )
  }

  if (displayedKits.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {showOnlyFavorites
            ? "You haven't added any favorites yet."
            : "No starter kits found."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {displayedKits.map((kit) => (
        <StarterKitCard
          key={kit.id}
          kit={kit}
          isFavorite={favorites.includes(kit.id)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )
} 