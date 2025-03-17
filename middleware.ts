import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })
    
    // This will refresh the session if it exists and is expired
    await supabase.auth.getSession()
    
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // Return the original response even if there's an error
    return NextResponse.next()
  }
}

// Apply this middleware to specific routes that need authentication
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and auth callback
    '/((?!_next/static|_next/image|favicon.ico|api|auth/callback).*)',
  ],
}
