import type { Metadata } from 'next'
import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign In – Socio Max',
  description: 'Sign in to your Socio Max account.',
}

export default function SignInPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Socio Max</h1>
          <p>Sign in to see photos and videos from your friends.</p>
        </div>
        <SignInForm />
        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <a href="/sign-up">Sign up</a>
        </p>
      </div>
    </div>
  )
}
