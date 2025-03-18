'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSetupPage() {
  const { user, loading } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [profileExists, setProfileExists] = useState(false)
  const [isAdminColumn, setIsAdminColumn] = useState(false)
  const [isCurrentlyAdmin, setIsCurrentlyAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      checkProfileAndAdminStatus()
    }
  }, [user])

  const checkProfileAndAdminStatus = async () => {
    if (!user) return

    try {
      // First, check if the user is already an admin
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
        
      if (profileError) {
        if (profileError.code === 'PGRST116') { // No rows returned
          setMessage({ 
            type: 'info', 
            text: 'Your user profile does not exist. Click "Setup Admin" to create it.' 
          })
        } else if (profileError.code === '42P01' || profileError.message?.includes("relation \"profiles\" does not exist")) {
          // Table doesn't exist
          setMessage({ 
            type: 'info', 
            text: 'The profiles table does not exist in your database. Click "Setup Admin" to create it.' 
          })
        } else if (profileError.message?.includes("column \"is_admin\" does not exist")) {
          // Column doesn't exist
          setProfileExists(true)
          setIsAdminColumn(false)
          setMessage({ 
            type: 'info', 
            text: 'The is_admin column does not exist in the profiles table. Click "Setup Admin" to add it.' 
          })
        } else {
          console.error("Profile error:", profileError);
          setMessage({ 
            type: 'error', 
            text: `Error checking profile: ${profileError.message}` 
          })
        }
      } else {
        setProfileExists(true)
        setIsAdminColumn(true)
        setIsCurrentlyAdmin(!!userProfile?.is_admin)
        
        if (userProfile?.is_admin) {
          setMessage({ 
            type: 'success', 
            text: 'You are already an admin! You can now access the admin pages.' 
          })
        } else {
          setMessage({ 
            type: 'info', 
            text: 'Your user profile exists but you are not an admin. Click "Setup Admin" to make yourself an admin.' 
          })
        }
      }
    } catch (error) {
      console.error('Error checking profile status:', error)
      setMessage({ 
        type: 'error', 
        text: 'Error checking profile status. See console for details.' 
      })
    }
  }

  const setupAdmin = async () => {
    if (!user) return
    
    setIsProcessing(true)
    setMessage(null)
    
    try {
      // Direct SQL approach using service role (if available)
      // Note: This is a simplified approach that attempts to create the profile with admin rights
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          is_admin: true
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false
        })
        
      if (upsertError) {
        console.error("Upsert error:", upsertError);
        
        // If the error is related to the table not existing, we need to inform the user
        if (upsertError.code === '42P01' || upsertError.message?.includes("relation \"profiles\" does not exist")) {
          setMessage({ 
            type: 'error', 
            text: 'The profiles table does not exist in your database. You need to create it in the Supabase dashboard first.' 
          })
        } 
        // If the error is related to the column not existing, we need to inform the user
        else if (upsertError.message?.includes("column \"is_admin\" does not exist")) {
          setMessage({ 
            type: 'error', 
            text: 'The is_admin column does not exist in the profiles table. You need to add it in the Supabase dashboard first.' 
          })
        }
        // If the error is related to permissions, we need to inform the user
        else if (upsertError.code === '42501' || upsertError.message?.includes("permission denied")) {
          setMessage({ 
            type: 'error', 
            text: 'You do not have permission to update the profiles table. You need to adjust the RLS policies in the Supabase dashboard.' 
          })
        } else {
          setMessage({ 
            type: 'error', 
            text: `Error: ${upsertError.message || JSON.stringify(upsertError)}` 
          })
        }
        return;
      }
      
      setMessage({ 
        type: 'success', 
        text: 'Success! You are now an admin. You can now access the admin pages.' 
      })
      setIsCurrentlyAdmin(true)
      
      // Refresh the page after a short delay to update the UI with admin privileges
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (error: any) {
      console.error('Error setting up admin:', error)
      setMessage({ 
        type: 'error', 
        text: `Error setting up admin: ${error?.message || JSON.stringify(error)}` 
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
            <CardDescription>
              You need to be logged in to set up admin access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500">Please log in first to continue.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          <CardDescription>
            Set up admin access for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Current Status:</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsProcessing(false);
                    checkProfileAndAdminStatus();
                  }}
                >
                  Refresh Status
                </Button>
              </div>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 mr-2 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  User: {user ? `Logged in as ${user.email}` : 'Not logged in'}
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 mr-2 rounded-full ${profileExists ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  Profiles Table: {profileExists ? 'Exists' : 'Does not exist'}
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 mr-2 rounded-full ${isAdminColumn ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  Admin Column: {isAdminColumn ? 'Exists' : 'Does not exist'}
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-4 h-4 mr-2 rounded-full ${isCurrentlyAdmin ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  Admin Status: {isCurrentlyAdmin ? 'You are an admin' : 'You are not an admin'}
                </li>
              </ul>
            </div>
            
            {message && (
              <div className={`p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 
                message.type === 'error' ? 'bg-red-50 text-red-700' : 
                'bg-blue-50 text-blue-700'
              }`}>
                {message.text}
              </div>
            )}

            <div className="p-4 rounded-md bg-blue-50 text-blue-700">
              <h3 className="font-medium mb-2">Supabase Setup Instructions:</h3>
              <p className="text-sm mb-2">If you're encountering permission errors, you may need to set up the following in your Supabase dashboard:</p>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                <li>Create a <code>profiles</code> table with columns: <code>id</code> (primary key), <code>email</code>, and <code>is_admin</code> (boolean)</li>
                <li>Add an RLS policy to allow authenticated users to select from and update the profiles table</li>
                <li>Make sure the <code>id</code> column in the profiles table matches the <code>id</code> from the <code>auth.users</code> table</li>
              </ol>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={setupAdmin} 
            disabled={isProcessing || isCurrentlyAdmin}
            className={isCurrentlyAdmin ? 'bg-green-500' : ''}
          >
            {isProcessing ? 'Processing...' : isCurrentlyAdmin ? 'Already Admin' : 'Setup Admin'}
          </Button>
          
          {isCurrentlyAdmin && (
            <Button asChild variant="outline">
              <a href="/admin/submissions">Go to Admin Panel</a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
