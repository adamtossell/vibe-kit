"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export function UserAvatar() {
  const { user, signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  if (!user) return null
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100">
            <User className="h-4 w-4 text-slate-600" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-slate-200">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-slate-200" />
        <DropdownMenuItem asChild className="text-slate-600 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-800 focus:bg-slate-100 focus:text-slate-800 py-1.5 px-2 cursor-pointer">
          <Link href="/settings">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200" />
        <DropdownMenuItem onClick={handleSignOut} className="text-slate-600 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-800 focus:bg-slate-100 focus:text-slate-800 py-1.5 px-2 cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
