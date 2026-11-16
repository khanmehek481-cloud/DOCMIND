
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleLogin(event) {
    event.preventDefault()
    setError('')

    const savedUser = localStorage.getItem('docmind_account')

    if (!savedUser) {
      setError('No account found. Please create an account first.')
      return
    }

    const account = JSON.parse(savedUser)

    if (
      account.email.toLowerCase() === email.trim().toLowerCase() &&
      account.password === password
    ) {
      localStorage.setItem('docmind_user', JSON.stringify({
        name: account.name,
        email: account.email
      }))
      navigate('/dashboard')
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>DOCMIND</h1>
        <p className="login-subtitle">Welcome back</p>
        <p className="login-description">
          Sign in to access your document workspace.
        </p>

        <form onSubmit={handleLogin}>
          <label>Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit">Sign In</button>
        </form>

        <p className="login-footer">
          New to DOCMIND? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
