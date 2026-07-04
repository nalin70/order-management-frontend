import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div className="dashboard-card">
      <h1>Admin dashboard</h1>
      <p>Welcome back, {user?.email || user?.username || 'Admin'}</p>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total users</h3>
          <p>—</p>
        </div>
        <div className="stat-card">
          <h3>Total products</h3>
          <p>—</p>
        </div>
      </div>
    </div>
  )
}
