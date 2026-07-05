import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { formatCurrency, toArray } from '../utils/apiData'

const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadOrders = async () => {
    const { data } = await api.get('/api/v1/orders/')
    setOrders(toArray(data))
  }

  useEffect(() => {
    loadOrders().catch(() => setError('Unable to load admin orders')).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId)
    setError('')
    try {
      const { data } = await api.patch(`/api/v1/orders/${orderId}/status/`, { status })
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, ...data, status } : order)))
    } catch {
      setError('Unable to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <p className="loading-state">Loading admin orders...</p>

  return (
    <div className="page-stack">
      <section className="page-hero"><div><p className="eyebrow">Admin operations</p><h1>Orders</h1><p>Review all customer orders and update fulfillment status.</p></div></section>
      {error ? <p className="alert error">{error}</p> : null}
      <div className="table-card">
        <table><thead><tr><th>Order</th><th>Status</th><th>Total</th><th>Customer</th><th>Actions</th></tr></thead><tbody>{orders.map((order) => (<tr key={order.id}><td>#{order.id}</td><td><select value={order.status ?? 'PENDING'} onChange={(event) => updateStatus(order.id, event.target.value)} disabled={updatingId === order.id}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td>{formatCurrency(order.total_amount ?? order.total)}</td><td>{order.customer?.email ?? order.user?.email ?? order.customer_email ?? 'Customer'}</td><td><Link to={`/orders/${order.id}`}>Details</Link></td></tr>))}</tbody></table>
      </div>
    </div>
  )
}
