'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
        <div className="max-w-md mx-auto">
          {user ? (
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  View and manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 font-medium mb-2">✅ You are signed in!</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  className="w-full"
                >
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Sign in to view your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 font-medium">❌ You are not signed in</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex space-x-4 w-full">
                  <Button 
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button 
                    asChild
                    className="flex-1"
                  >
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
