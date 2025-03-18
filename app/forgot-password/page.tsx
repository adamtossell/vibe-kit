"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { supabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isGithubUser, setIsGithubUser] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)

  // Function to check if a user is a GitHub user directly in the client
  const checkGithubUser = async (email: string): Promise<boolean> => {
    try {
      // First try password sign-in with a dummy password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-that-will-fail'
      });
      
      if (signInError) {
        console.log('Sign-in error:', signInError.message);
        
        // If we get "Invalid login credentials", it means the user exists with password
        // If we get a different error, they might be using OAuth
        if (!signInError.message.includes('Invalid login credentials')) {
          // Try OTP sign-in to further confirm
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false }
          });
          
          if (otpError) {
            console.log('OTP error:', otpError.message);
            
            // If we get an error about email link being invalid or email already in use,
            // it suggests the user exists but can't use OTP (likely OAuth)
            if (otpError.message.includes('Email link is invalid') || 
                otpError.message.includes('Email address already in use')) {
              return true; // Likely a GitHub user
            }
          }
        }
      }
      
      return false; // Not a GitHub user or couldn't determine
    } catch (error) {
      console.error('Error checking GitHub user:', error);
      return false; // Default to not a GitHub user on error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsGithubUser(false)
    console.log("Checking email:", email)

    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Check for rate limiting - prevent submissions within 60 seconds
    const now = Date.now()
    const timeSinceLastSubmit = now - lastSubmitTime
    if (timeSinceLastSubmit < 60000) {
      setError(`Please wait ${Math.ceil((60000 - timeSinceLastSubmit) / 1000)} seconds before trying again`)
      return
    }

    setIsLoading(true)

    try {
      // First check if the user is currently logged in with this email
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session?.user?.email)
      
      if (session?.user?.email?.toLowerCase() === email.toLowerCase()) {
        // User is trying to reset their own password while logged in
        const identities = session.user.identities || [];
        console.log("User identities:", identities)
        
        const isGithub = identities.some(identity => identity.provider === 'github');
        
        if (isGithub) {
          console.log("Current user is a GitHub user")
          setIsGithubUser(true);
          setIsLoading(false);
          return;
        }
      }
      
      // If not logged in, check if this is a GitHub user using our client-side method
      const isGithubUser = await checkGithubUser(email);
      
      if (isGithubUser) {
        console.log("Detected GitHub user via client-side checks");
        setIsGithubUser(true);
        setIsLoading(false);
        return;
      }
      
      // Only proceed with password reset if we haven't identified a GitHub user
      console.log("Sending password reset email");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Reset password error:", error);
        
        // Check if the error suggests this is a rate limiting issue
        if (error.message.includes("security purposes") || error.message.includes("seconds")) {
          setError("Too many requests. Please try again later.");
        } 
        // Check if the error suggests this is a GitHub user
        else if (error.message.includes("OAuth") || 
                error.message.includes("third-party") || 
                error.message.includes("provider")) {
          setIsGithubUser(true);
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
        setLastSubmitTime(Date.now());
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An error occurred while sending the reset link");
    } finally {
      setIsLoading(false);
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