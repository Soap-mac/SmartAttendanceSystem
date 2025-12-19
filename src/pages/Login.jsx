import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(username.trim(), password.trim())
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-mark">SA</div>
        <h1>Smart Attendance</h1>
        <p className="helper-text">Mock auth · admin / admin123</p>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn primary">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
