'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

export function useFavorites() {
  const { user, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch favorites when user is available
  useEffect(() => {
    let mounted = true

    const fetchFavorites = async () => {
      if (!user) {
        if (mounted) {
          setFavorites([])
          setLoading(false)
        }
        return
      }

      try {
        console.log('Fetching favorites for user:', user.id)
        setLoading(true)
        const { data, error } = await supabase
          .from('user_favorites')
          .select('kit_id')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching favorites:', error)
          throw error
        }

        if (mounted) {
          // Extract kit_ids from the response
          const favIds = data.map(fav => fav.kit_id)
          console.log('Fetched favorites:', favIds)
          setFavorites(favIds)
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
        if (mounted) {
          setFavorites([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Only fetch favorites if authentication is complete
    if (!authLoading) {
      console.log('Auth state ready, fetching favorites. User:', user?.id)
      fetchFavorites()
    }

    return () => {
      mounted = false
    }
  }, [user, authLoading])

  // Toggle favorite status
  const toggleFavorite = async (kitId: number) => {
    if (!user) {
      console.log('Cannot toggle favorite: No user logged in')
      return false
    }

    try {
      if (favorites.includes(kitId)) {
        console.log('Removing favorite:', kitId)
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .match({ user_id: user.id, kit_id: kitId })

        if (error) {
          console.error('Error removing favorite:', error)
          throw error
        }

        // Update local state immediately for better UX
        setFavorites(prev => prev.filter(id => id !== kitId))
        console.log('Successfully removed favorite:', kitId)
      } else {
        console.log('Adding favorite:', kitId)
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, kit_id: kitId })

        if (error) {
          console.error('Error adding favorite:', error)
          throw error
        }

        // Update local state immediately for better UX
        setFavorites(prev => [...prev, kitId])
        console.log('Successfully added favorite:', kitId)
      }
      return true
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return false
    }
  }

  return { favorites, toggleFavorite, loading }
} 