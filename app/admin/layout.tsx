'use client'

import { AdminProtectedRoute } from '@/components/auth/admin-protected-route'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
  }

  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen">
        {/* Admin Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-white">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900">Admin Panel</h2>
          </div>
          <nav className="space-y-1 px-3 pb-5">
            <Link 
              href="/admin/submissions" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/admin/submissions')}`}
            >
              Kit Submissions
            </Link>
            {/* Add more admin navigation links here as needed */}
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 bg-slate-50">
          {children}
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
