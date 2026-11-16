
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSignup(event) {
    event.preventDefault()
    setError('')

    const existingAccount = localStorage.getItem('docmind_account')

    if (existingAccount) {
      const account = JSON.parse(existingAccount)

      if (account.email.toLowerCase() === email.trim().toLowerCase()) {
        setError('An account with this email already exists.')
        return
      }
    }

    const newAccount = {
      name: name.trim(),
      email: email.trim(),
      password
    }

    localStorage.setItem('docmind_account', JSON.stringify(newAccount))

    alert('Account created successfully! Please sign in.')
    navigate('/login')
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>DOCMIND</h1>
        <h2>Create your account</h2>
        <p className="signup-description">
          Start organizing and discovering your documents.
        </p>

        <form onSubmit={handleSignup}>
          <label>Full name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

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
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit">Create Account</button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
