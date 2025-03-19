'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/use-auth'

export function useFavorites() {
  const { user, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize Supabase client
  const supabase = createClientComponentClient()

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
        setLoading(true)
        const { data, error } = await supabase
          .from('user_favorites')
          .select('kit_id')
          .eq('user_id', user.id)

        if (error) throw error

        if (mounted) {
          setFavorites(data?.map(f => f.kit_id) || [])
        }
      } catch (err) {
        console.error('Error fetching favorites:', err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchFavorites()

    return () => {
      mounted = false
    }
  }, [user, supabase])

  // Toggle favorite status
  const toggleFavorite = async (kitId: number) => {
    if (!user) return

    try {
      const isFavorited = favorites.includes(kitId)

      if (isFavorited) {
        // Remove from favorites
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('kit_id', kitId)

        setFavorites(favorites.filter(id => id !== kitId))
      } else {
        // Add to favorites
        await supabase
          .from('user_favorites')
          .insert([{ user_id: user.id, kit_id: kitId }])

        setFavorites([...favorites, kitId])
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  return {
    favorites,
    loading: loading || authLoading,
    toggleFavorite
  }
}