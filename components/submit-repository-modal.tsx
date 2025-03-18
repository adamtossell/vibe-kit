"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"

export function SubmitRepositoryModal() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl) return
    
    setIsSubmitting(true)
    setFeedback(null)
    
    try {
      // Extract repository information from URL
      let validUrl = repoUrl;
      let isValidUrl = false;
      
      try {
        const repoUrlObj = new URL(repoUrl);
        if (!repoUrlObj.hostname.includes("github.com")) {
          setFeedback({
            type: "error",
            message: "Please enter a valid GitHub repository URL"
          });
          return;
        }
        validUrl = repoUrlObj.toString();
        isValidUrl = true;
      } catch (urlError) {
        setFeedback({
          type: "error",
          message: "Please enter a valid URL"
        });
        return;
      }
      
      // Only proceed if URL is valid
      if (isValidUrl) {
        // Insert the kit suggestion into Supabase
        const { error } = await supabase
          .from('kit_suggestions')
          .insert({
            repository_url: validUrl,
            submitted_by: user?.id,
            status: 'pending', // Default status for new submissions
            submitted_at: new Date().toISOString(),
          })

        if (error) {
          console.error("Supabase error:", error)
          throw new Error("Failed to submit repository. Please try again.")
        }
        
        setFeedback({
          type: "success",
          message: "Repository submitted successfully!"
        })
        
        // Close the modal after successful submission
        setTimeout(() => {
          setOpen(false)
          setRepoUrl("")
          setFeedback(null)
        }, 1500)
      }
    } catch (error: any) {
      console.error("Error submitting repository:", error)
      setFeedback({
        type: "error",
        message: error.message || "Failed to submit repository. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    setRepoUrl("")
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        setFeedback(null)
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Submit a Kit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-slate-900">Submit a Kit</DialogTitle>
            <DialogDescription className="text-slate-500">
              Enter the URL of a GitHub repository. Submissions will be reviewed and added to the collection once approved.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onClear={repoUrl ? handleClear : undefined}
              className="w-full border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 placeholder:text-slate-500"
            />
            {feedback && (
              <div className={`mt-2 text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {feedback.message}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
