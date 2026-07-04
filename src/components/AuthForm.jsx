import { useState } from 'react'
import { signIn, signUp } from '../authClient'

function AuthForm() {
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: authError } =
      mode === 'signin'
        ? await signIn.email({ email, password })
        : await signUp.email({ email, password, name })

    setSubmitting(false)
    if (authError) {
      setError(authError.message || 'Something went wrong. Please try again.')
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))
    setError(null)
  }

  return (
    <div className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>🎾 CourtSide</h2>
        <p className="court-meta">{mode === 'signin' ? 'Sign in to book a court' : 'Create an account'}</p>

        {mode === 'signup' && (
          <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>

        {error && <p className="error-banner">{error}</p>}

        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>

        <button type="button" className="link-button" onClick={toggleMode}>
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}

export default AuthForm
