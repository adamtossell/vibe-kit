"use client"

import { DirectoryList } from '@/components/DirectoryList'
import { PageHeader } from '@/components/PageHeader'
import { Navbar } from '@/components/navbar'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto py-6 space-y-8">
            <PageHeader
              heading="Favorites"
              subheading="Your favorite content in one place"
            />
            
            <DirectoryList showOnlyFavorites={true} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 