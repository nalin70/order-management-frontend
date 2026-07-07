import { BrowserRouter, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function AppShell() {
  const { isAuthenticated, isAdmin, loading, logout } = useContext(AuthContext)
  const navClassName = ({ isActive }) => (isActive ? 'active' : undefined)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="app-shell">
      {isAuthenticated ? (
        <nav className="top-nav">
          <div className="nav-links">
            {!isAdmin ? <NavLink className={navClassName} to="/products">Products</NavLink> : null}
            {!isAdmin ? <NavLink className={navClassName} to="/orders">My Orders</NavLink> : null}
            {isAdmin ? <NavLink className={navClassName} to="/admin/orders">Orders</NavLink> : null}
            {isAdmin ? <NavLink className={navClassName} to="/admin/products">Products</NavLink> : null}
            <NavLink className={navClassName} to="/profile">Profile</NavLink>
          </div>
          <button type="button" className="logout-button" onClick={logout}>
            Logout
          </button>
        </nav>
      ) : null}
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
