import type { Metadata } from 'next'
import SignUpForm from '@/components/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Sign Up – Socio Max',
  description: 'Create a new Socio Max account.',
}

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Socio Max</h1>
          <p>Sign up to see photos and videos from your friends.</p>
        </div>
        <SignUpForm />
        <p className="auth-switch">
          Already have an account?{' '}
          <a href="/sign-in">Sign in</a>
        </p>
      </div>
    </div>
  )
}
