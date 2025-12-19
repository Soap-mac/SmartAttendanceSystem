import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">SA</span>
          <div>
            <div className="brand-title">Smart Attendance</div>
            <div className="brand-subtitle">Frontend only</div>
          </div>
        </Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Dashboard
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Students
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Attendance
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Reports
          </NavLink>
        </nav>
        <button className="btn ghost" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Logged in</div>
            <div className="user">{user?.name}</div>
          </div>
        </header>
        <section className="page">{children}</section>
      </main>
    </div>
  )
}
