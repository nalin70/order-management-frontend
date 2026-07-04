import { BrowserRouter, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function AppShell() {
  const { isAuthenticated, isAdmin, loading, logout } = useContext(AuthContext)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="app-shell">
      {isAuthenticated ? (
        <nav className="top-nav">
          <Link to={isAdmin ? '/admin' : '/dashboard'}>Dashboard</Link>
          {!isAdmin ? <Link to="/products">Products</Link> : null}
          {!isAdmin ? <Link to="/orders">My Orders</Link> : null}
          {!isAdmin ? <Link to="/payments">Payments</Link> : null}
          {isAdmin ? <Link to="/admin/orders">Orders</Link> : null}
          {isAdmin ? <Link to="/admin/products">Inventory</Link> : null}
          <Link to="/profile">Profile</Link>
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
