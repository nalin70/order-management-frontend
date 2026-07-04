import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/api/v1/orders/')
        setOrders(data)
      } catch (err) {
        setError('Unable to load admin orders')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) {
    return <p>Loading admin orders...</p>
  }

  return (
    <div>
      <h1>Admin orders</h1>
      {error ? <p className="error">{error}</p> : null}
      <div className="card-grid">
        {orders.map((order) => (
          <article key={order.id} className="card">
            <h2>Order #{order.id}</h2>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total_amount}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
