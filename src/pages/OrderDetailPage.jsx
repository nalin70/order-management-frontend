import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await api.get(`/api/v1/orders/${id}/`)
        setOrder(data)
      } catch (err) {
        setError('Unable to load order details')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id])

  if (loading) {
    return <p>Loading order details...</p>
  }

  if (!order) {
    return <p className="error">{error || 'Order not found'}</p>
  }

  return (
    <div className="card">
      <h1>Order #{order.id}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total_amount}</p>
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </div>
  )
}
