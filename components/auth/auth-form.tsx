'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  // Check if Supabase is properly initialized
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        console.log('Checking Supabase connection...')
        const { data, error } = await supabase.auth.getSession()
        console.log('Supabase session check:', { data, error })
      } catch (err) {
        console.error('Error checking Supabase connection:', err)
      }
    }
    
    checkSupabase()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters long'
      })
      setLoading(false)
      return
    }

    console.log('Attempting to sign up with:', { email })

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      console.log('Sign up response:', { data, error })

      if (error) throw error
      
      setMessage({
        type: 'success',
        text: 'Check your email for the confirmation link!'
      })
      
      console.log('Sign up successful, user:', data.user)
    } catch (error: any) {
      console.error('Sign up error:', error)
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred during sign up'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    console.log('Attempting to sign in with:', { email })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Sign in response:', { data, error })

      if (error) throw error
      
      console.log('Sign in successful, user:', data.user)
    } catch (error: any) {
      console.error('Sign in error:', error)
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred during sign in'
      })
    } finally {
      setLoading(false)
    }
  }

  const clearEmail = () => setEmail('')
  const clearPassword = () => setPassword('')

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClear={clearEmail}
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onClear={clearPassword}
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClear={clearEmail}
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onClear={clearPassword}
                required
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Sign Up'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}