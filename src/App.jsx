import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <nav className="top-nav">
            <a href="/products">Products</a>
            <a href="/orders">Orders</a>
            <a href="/payments">Payments</a>
            <a href="/profile">Profile</a>
            <a href="/admin/orders">Admin Orders</a>
          </nav>
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
