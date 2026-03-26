'use client'

import { useState } from 'react'
import { signUp } from '@/app/actions/auth'

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-success-message">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2>Verification Link Sent!</h2>
        <p>We&apos;ve sent a confirmation link to your email address. Please click it to activate your account and start using Socio Max.</p>
        <div className="auth-switch" style={{ marginTop: '1.5rem' }}>
          <a href="/sign-in">Back to Login</a>
        </div>
      </div>
    )
  }

  return (
    <form className="auth-form" action={handleSubmit}>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Full Name"
        required
        className="auth-input"
      />
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        required
        className="auth-input"
      />
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        required
        className="auth-input"
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password (min 8 chars)"
        required
        minLength={8}
        className="auth-input"
      />
      {error && <p className="auth-error">{error}</p>}
      <button id="sign-up-btn" type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Creating account…' : 'Sign up'}
      </button>
    </form>
  )
}
