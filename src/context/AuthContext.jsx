import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AuthContext = createContext(null)

const FIXED_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  name: 'Admin User',
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useLocalStorage('sa-auth', { isAuthenticated: false, user: null })

  const login = (username, password) => {
    if (username === FIXED_CREDENTIALS.username && password === FIXED_CREDENTIALS.password) {
      setAuth({ isAuthenticated: true, user: { name: FIXED_CREDENTIALS.name, username } })
      return { success: true }
    }
    return { success: false, message: 'Invalid credentials. Try admin / admin123.' }
  }

  const logout = () => setAuth({ isAuthenticated: false, user: null })

  const value = useMemo(() => ({ ...auth, login, logout }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
