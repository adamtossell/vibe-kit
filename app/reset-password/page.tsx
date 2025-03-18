"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isGithubUser, setIsGithubUser] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      
      if (event === 'PASSWORD_RECOVERY') {
        // The user has clicked on a password recovery link
        setIsTokenValid(true)
        setIsChecking(false)
        
        if (session?.user) {
          // Check if user is a GitHub user
          const identities = session.user.identities || []
          const isGithub = identities.some(identity => identity.provider === 'github')
          
          if (isGithub) {
            console.log("User is a GitHub user")
            setIsGithubUser(true)
          }
        }
      } else if (event === 'SIGNED_IN') {
        // This can also happen when clicking a reset link
        setIsTokenValid(true)
        setIsChecking(false)
        
        if (session?.user) {
          // Check if user is a GitHub user
          const identities = session.user.identities || []
          const isGithub = identities.some(identity => identity.provider === 'github')
          
          if (isGithub) {
            console.log("User is a GitHub user")
            setIsGithubUser(true)
          }
        }
      } else {
        // If we don't get a PASSWORD_RECOVERY or SIGNED_IN event within a reasonable time,
        // check if we have a session already
        setTimeout(async () => {
          if (isChecking) {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            
            if (sessionError || !session) {
              console.error("Session error or no session:", sessionError)
              setError("Invalid or expired token")
              setIsTokenValid(false)
              setIsChecking(false)
            } else {
              // We have a session, so the token is valid
              setIsTokenValid(true)
              setIsChecking(false)
              
              if (session.user) {
                // Check if user is a GitHub user
                const identities = session.user.identities || []
                const isGithub = identities.some(identity => identity.provider === 'github')
                
                if (isGithub) {
                  console.log("User is a GitHub user")
                  setIsGithubUser(true)
                }
              }
            }
          }
        }, 2000) // Wait 2 seconds before checking
      }
    })
    
    // Cleanup function
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (isGithubUser) {
      router.push("/login")
      return
    }
    
    if (!password) {
      setError("Please enter a new password")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password
      })
      
      if (error) throw error
      
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("Password reset error:", err)
      setError(err.message || "An error occurred while resetting your password")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Show loading state while checking the token
  if (isChecking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Verifying your request</CardTitle>
              <CardDescription className="text-center">
                Please wait while we verify your reset token...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }
  
  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Invalid Reset Link</CardTitle>
              <CardDescription className="text-center text-red-500">
                {error || "Invalid or expired token"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center">
                Please request a new password reset link from the login page.
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push('/login')}
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }
  
  // Show GitHub user message
  if (isGithubUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">GitHub Account</CardTitle>
              <CardDescription className="text-center">
                You signed up with GitHub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 text-sm bg-blue-50 border border-blue-200 text-blue-600 rounded-md">
                It looks like you signed up with GitHub. Please use the "Continue with GitHub" option on the login page instead of resetting your password.
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push('/login')}
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }
  
  // Show success message
  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
              <CardDescription className="text-center">
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 text-sm bg-green-50 border border-green-200 text-green-600 rounded-md">
                You will be redirected to the login page in a few seconds.
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }
  
  // Show reset password form
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900">
              Return to login
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
