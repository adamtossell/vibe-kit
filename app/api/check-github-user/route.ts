import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with available credentials
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  
  try {
    // Since we don't have admin access, we'll try a different approach
    // We'll attempt to sign in with a dummy password and analyze the error
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-that-will-fail'
    });

    // Check if the error message suggests this is a GitHub user
    if (signInError) {
      console.log('Sign-in error:', signInError.message);
      
      // If the error is "Invalid login credentials", the user exists with password auth
      // If it's a different error, they might be using OAuth
      const isPasswordUser = signInError.message.includes('Invalid login credentials');
      
      if (!isPasswordUser) {
        // Try to check if this is specifically a GitHub user
        // We'll try to sign in with OTP and check the error
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false }
        });
        
        if (otpError) {
          console.log('OTP error:', otpError.message);
          
          // If we get an error about email link being invalid or email already in use,
          // it suggests the user exists but can't use OTP (likely OAuth)
          const isOAuthUser = otpError.message.includes('Email link is invalid') || 
                             otpError.message.includes('Email address already in use');
          
          if (isOAuthUser) {
            // We can't specifically determine if it's GitHub, but we know it's OAuth
            return NextResponse.json({ 
              isGithubUser: true,  // Assuming OAuth = GitHub for simplicity
              exists: true,
              providers: ['oauth']
            }, { status: 200 });
          }
        }
      }
      
      // If we reach here, either:
      // 1. The user exists with password auth
      // 2. We couldn't determine if they're using OAuth
      return NextResponse.json({ 
        isGithubUser: false,
        exists: isPasswordUser,
        providers: isPasswordUser ? ['email'] : []
      }, { status: 200 });
    }
    
    // This shouldn't happen (sign in with dummy password should always fail)
    return NextResponse.json({ 
      isGithubUser: false,
      exists: true,
      providers: ['unknown']
    }, { status: 200 });
  } catch (error: any) {
    console.error('Server error checking GitHub user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
