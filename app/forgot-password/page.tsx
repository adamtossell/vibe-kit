"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isGithubUser, setIsGithubUser] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const supabase = createClientComponentClient()

  // Function to check if a user is a GitHub user directly in the client
  const checkGithubUser = async (email: string): Promise<boolean> => {
    try {
      // First try password sign-in with a dummy password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-that-will-fail'
      })
      
      if (signInError) {
        // If we get "Invalid login credentials", it means the user exists with password
        // If we get a different error, they might be using OAuth
        if (!signInError.message.includes('Invalid login credentials')) {
          // Try OTP sign-in to further confirm
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false }
          })
          
          if (otpError) {
            // If we get an error about email link being invalid or email already in use,
            // it suggests the user exists but can't use OTP (likely OAuth)
            if (otpError.message.includes('Email link is invalid') || 
                otpError.message.includes('Email address already in use')) {
              return true // Likely a GitHub user
            }
          }
        }
      }
      
      return false // Not a GitHub user
    } catch (err) {
      console.error('Error checking GitHub user:', err)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Rate limiting check
    const now = Date.now()
    if (now - lastSubmitTime < 60000) { // 1 minute cooldown
      setError("Please wait a minute before trying again")
      return
    }

    setIsLoading(true)

    try {
      // Check if user signed up with GitHub
      const isGithub = await checkGithubUser(email)
      setIsGithubUser(isGithub)

      if (isGithub) {
        setError("This email is associated with GitHub login. Please sign in with GitHub instead.")
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setSuccess(true)
      setLastSubmitTime(now)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
            )}
            {success && (
              <div className="p-3 text-sm bg-green-50 border border-green-200 text-green-600 rounded-md">
                If an account exists with this email, you will receive a password reset link shortly.
              </div>
            )}
            {isGithubUser && (
              <div className="p-3 text-sm bg-blue-50 border border-blue-200 text-blue-600 rounded-md">
                It looks like you signed up with GitHub. Please use the "Continue with GitHub" option on the login page instead of resetting your password.
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => router.push('/login')}
                  >
                    Return to Login
                  </Button>
                </div>
              </div>
            )}

            {!isGithubUser && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending reset link..." : "Send reset link"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}