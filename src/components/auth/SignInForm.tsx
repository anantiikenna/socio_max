'use client'

import { useState } from 'react'
import { signIn } from '@/app/actions/auth'

export default function SignInForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" action={handleSubmit}>
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
        placeholder="Password"
        required
        className="auth-input"
      />
      {error && <p className="auth-error">{error}</p>}
      <button id="sign-in-btn" type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Signing in…' : 'Log in'}
      </button>
    </form>
  )
}
