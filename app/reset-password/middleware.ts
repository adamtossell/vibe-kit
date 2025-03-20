import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Get the token from the URL
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true
        }
      }
    );
    
    // Verify the token to get the user
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    });
    
    if (error || !data.user) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check if the user signed up with GitHub
    const identities = data.user.identities || [];
    const isGithubUser = identities.some(identity => identity.provider === 'github');
    
    if (isGithubUser) {
      // Redirect GitHub users to a special page
      return NextResponse.redirect(new URL('/reset-password/github-user', request.url));
    }
    
    // Continue to the reset password page for non-GitHub users
    return NextResponse.next();
  } catch (error) {
    console.error('Error in reset-password middleware:', error);
    // On error, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/reset-password',
}
