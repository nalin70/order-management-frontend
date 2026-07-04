import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/api/v1/orders/')
        setOrders(data)
      } catch (err) {
        setError('Unable to load orders')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) {
    return <p>Loading orders...</p>
  }

  return (
    <div>
      <h1>Orders</h1>
      {error ? <p className="error">{error}</p> : null}
      <div className="card-grid">
        {orders.map((order) => (
          <article key={order.id} className="card">
            <h2>Order #{order.id}</h2>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total_amount}</p>
            <Link to={`/orders/${order.id}`}>View details</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
