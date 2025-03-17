'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto py-12 flex items-center justify-center">
          <p>Loading authentication status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 font-medium mb-2">✅ You are signed in!</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
                </div>
              </div>
              
              <Button 
                onClick={signOut} 
                variant="outline" 
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 font-medium">❌ You are not signed in</p>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  asChild
                  className="w-full"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
