'use client'

import { useState, useEffect } from 'react'
import { AdminProtectedRoute } from '@/components/auth/admin-protected-route'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'

type KitSubmission = {
  id: string
  repository_url: string
  submitted_by: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  user_email?: string
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<KitSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      // First, try a simple query without joins to see if we can access the table at all
      console.log("Attempting to fetch kit suggestions...");
      const { data: basicData, error: basicError } = await supabase
        .from('kit_suggestions')
        .select('*')
        .limit(10);
        
      if (basicError) {
        console.error("Basic query error:", basicError.message || JSON.stringify(basicError));
        
        if (basicError.code === '42P01' || (basicError.message && basicError.message.includes("relation \"kit_suggestions\" does not exist"))) {
          setMessage('table-missing');
          throw new Error("The kit_suggestions table does not exist. Please create it in your Supabase dashboard.");
        } else if (basicError.code === '42501' || (basicError.message && basicError.message.includes("permission denied"))) {
          setMessage('permission-denied');
          throw new Error("Permission denied. Please check your RLS policies for the kit_suggestions table.");
        } else {
          setMessage('unknown-error');
          throw new Error(basicError.message || "Unknown error fetching kit suggestions");
        }
      }
      
      console.log("Basic query successful, found items:", basicData?.length || 0);
      if (basicData && basicData.length > 0) {
        console.log("Sample data:", JSON.stringify(basicData[0]));
      }
      
      // Skip the profile check for now as it's causing issues
      
      // If basic query works, try the full query without joins
      const { data, error } = await supabase
        .from('kit_suggestions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error("Full query error:", error.message || JSON.stringify(error));
        setMessage('unknown-error');
        throw new Error(error.message || "Unknown error fetching kit suggestions with joins");
      }

      console.log("Full query successful, found items:", data?.length || 0);
      
      // Format the data without relying on the join
      const formattedData = data.map((item: any) => ({
        id: item.id,
        repository_url: item.repository_url,
        submitted_by: item.submitted_by,
        status: item.status || 'pending',
        submitted_at: item.submitted_at,
        user_email: 'Unknown' // We can't get the email without the join
      }));

      setSubmissions(formattedData);
      setMessage(formattedData.length === 0 ? 'no-data' : null);
      
    } catch (error: any) {
      console.error('Error fetching submissions:', error.message || JSON.stringify(error));
      toast({
        title: 'Error',
        description: error.message || 'Failed to load submissions. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('kit_suggestions')
        .update({ status })
        .eq('id', id)

      if (error) {
        throw error
      }

      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ))

      toast({
        title: 'Success',
        description: `Submission ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'reset to pending'} successfully.`,
      })
    } catch (error) {
      console.error('Error updating submission:', error)
      toast({
        title: 'Error',
        description: 'Failed to update submission. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminProtectedRoute>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Kit Submissions</CardTitle>
            <CardDescription>
              Review and manage kit submissions from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No submissions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Repository URL</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          <a 
                            href={submission.repository_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {submission.repository_url}
                          </a>
                        </TableCell>
                        <TableCell>{submission.user_email}</TableCell>
                        <TableCell>{formatDate(submission.submitted_at)}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          {submission.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-50 hover:bg-green-100 text-green-700"
                                onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-red-50 hover:bg-red-100 text-red-700"
                                onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {submission.status !== 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateSubmissionStatus(submission.id, 'pending')}
                            >
                              Reset to Pending
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={fetchSubmissions}>
              Refresh
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminProtectedRoute>
  )
}
