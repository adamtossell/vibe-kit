"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { UserAvatar } from "@/components/user-avatar"
import { SubmitRepositoryModal } from "@/components/submit-repository-modal"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="w-full bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline-block">VibeKit</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <SubmitRepositoryModal />
              <UserAvatar />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 pt-6">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Github className="h-6 w-6" />
                <span className="font-bold text-xl">VibeKit</span>
              </Link>
              <nav className="flex flex-col gap-4">{/* Navigation links removed */}</nav>
              {user ? (
                <div className="mt-4">
                  <SubmitRepositoryModal />
                  <div className="mt-4">
                    <UserAvatar />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild className="border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    variant="default"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
