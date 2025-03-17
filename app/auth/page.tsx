import { AuthForm } from '@/components/auth/auth-form'

export default function AuthPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to Vibe Kit</h1>
        <AuthForm />
      </div>
    </div>
  )
}