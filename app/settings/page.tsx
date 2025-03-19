'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/navbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?returnUrl=/settings')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto py-12 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto py-12">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 font-medium">❌ You need to be signed in to access settings</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Determine authentication providers
  const hasGithubAuth = user.app_metadata?.provider === 'github'
  const hasEmailAuth = user.app_metadata?.provider === 'email' || !user.app_metadata?.provider

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      setError('Password must contain both letters and numbers')
      return
    }

    setIsUpdating(true)

    try {
      const { error: updateError } = await user.update({
        password: password
      })

      if (updateError) {
        throw updateError
      }

      setMessage('Password updated successfully! Please sign in again with your new password.')
      setPassword('')
      setConfirmPassword('')
      
      // Sign out the user after successful password change
      await signOut()
      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
              <TabsTrigger value="profile" className="data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-600">Profile</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:text-slate-800 data-[state=inactive]:text-slate-600">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View your account profile information
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

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    />
                    <p className="text-xs text-slate-500">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Authentication Methods</Label>
                    <div className="flex flex-col gap-2 mt-2">
                      {hasEmailAuth && (
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                          <Badge variant="outline" className="bg-slate-100">Email</Badge>
                          <span className="text-sm">Signed in with email and password</span>
                        </div>
                      )}
                      
                      {hasGithubAuth && (
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                          <Badge variant="outline" className="bg-slate-100 flex items-center gap-1">
                            <Github size={14} />
                            <span>GitHub</span>
                          </Badge>
                          <span className="text-sm">Connected with GitHub account</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">These are the methods you can use to sign in to your account</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={signOut}
                    variant="destructive"
                  >
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password and security preferences
                  </CardDescription>
                </CardHeader>
                {hasEmailAuth ? (
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-slate-500">Password must be at least 8 characters long and contain both letters and numbers</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Password'}
                      </Button>
                    </CardFooter>
                  </form>
                ) : (
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <Github size={18} className="text-blue-600" />
                        <p className="text-blue-600 font-medium">GitHub Authentication</p>
                      </div>
                      <p className="mt-2 text-sm text-blue-600">
                        Your account uses GitHub for authentication. Password management is handled through GitHub and cannot be changed here.
                      </p>
                      <Button 
                        asChild
                        variant="outline" 
                        className="mt-4 text-sm bg-white"
                      >
                        <a href="https://github.com/settings/security" target="_blank" rel="noopener noreferrer">
                          Manage GitHub Security Settings
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
