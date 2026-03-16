'use client'

import { useState } from 'react'
import { signUp } from '@/app/actions/auth'

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
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
