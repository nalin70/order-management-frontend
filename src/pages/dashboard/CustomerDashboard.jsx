import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div className="page-stack narrow">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Customer dashboard</p>
          <h1>Welcome, {user?.email || user?.username || 'Customer'}</h1>
          <p>Your role: {user?.role || 'CUSTOMER'}</p>
        </div>
      </section>

      <section className="dashboard-card">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total orders</h3>
            <p>-</p>
          </div>
          <div className="stat-card">
            <h3>Open payments</h3>
            <p>-</p>
          </div>
        </div>
      </section>
    </div>
  )
}
