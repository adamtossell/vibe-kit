'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth')
      } else if (!isAdmin) {
        // Redirect non-admin users to home page
        router.push('/')
      }
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}
