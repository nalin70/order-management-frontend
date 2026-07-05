import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { formatCurrency, toArray } from '../utils/apiData'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/api/v1/orders/')
        setOrders(toArray(data))
      } catch {
        setError('Unable to load orders')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) return <p className="loading-state">Loading orders...</p>

  return (
    <div className="page-stack">
      <section className="page-hero"><div><p className="eyebrow">Order history</p><h1>My Orders</h1><p>Track reserved inventory, order totals, and payment next steps.</p></div><Link className="button" to="/products">Shop products</Link></section>
      {error ? <p className="alert error">{error}</p> : null}
      <div className="card-grid">
        {orders.map((order) => (
          <article key={order.id} className="card order-card">
            <span className="pill">{order.status ?? 'Pending'}</span>
            <h2>Order #{order.id}</h2>
            <p className="muted">Created {order.created_at ? new Date(order.created_at).toLocaleString() : 'recently'}</p>
            <p className="total-line">{formatCurrency(order.total_amount ?? order.total)}</p>
            <div className="button-row"><Link className="button secondary" to={`/orders/${order.id}`}>View details</Link><Link className="button" to="/payments">Pay now</Link></div>
          </article>
        ))}
      </div>
    </div>
  )
}
