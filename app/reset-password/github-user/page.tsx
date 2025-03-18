"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Github } from "lucide-react"

export default function GithubUserPage() {
  const router = useRouter()

  const handleGithubSignIn = async () => {
    router.push("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">GitHub Account Detected</CardTitle>
            <CardDescription className="text-center">
              You signed up using GitHub authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 text-center bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
              <p className="mb-4">
                Your account was created using GitHub authentication. You don't have a password to reset.
              </p>
              <p>
                Please return to the login page and use the "Continue with GitHub" button to sign in.
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGithubSignIn}
            >
              <Github className="mr-2 h-4 w-4" />
              Return to Login
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              If you believe this is an error or need further assistance, please contact support.
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
