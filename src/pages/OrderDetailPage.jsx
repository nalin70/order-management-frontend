import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import { formatCurrency, getItemName, toArray } from '../utils/apiData'

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
      } catch {
        setError('Unable to load order details')
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  if (loading) return <p className="loading-state">Loading order details...</p>
  if (!order) return <p className="alert error">{error || 'Order not found'}</p>

  const items = toArray(order.items ?? order.order_items)

  return (
    <div className="page-stack narrow">
      <section className="page-hero"><div><p className="eyebrow">Order detail</p><h1>Order #{order.id}</h1><p>Status: <strong>{order.status}</strong></p></div><Link className="button" to="/payments">Manage payment</Link></section>
      <section className="card detail-card">
        <div className="stat-grid"><div><span>Total</span><strong>{formatCurrency(order.total_amount ?? order.total)}</strong></div><div><span>Created</span><strong>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</strong></div></div>
        <h2>Items</h2>
        {items.length ? <ul className="line-list">{items.map((item) => <li key={item.id ?? item.product_id}><span>{getItemName(item)} × {item.quantity}</span><strong>{formatCurrency(item.total ?? Number(item.price ?? item.product?.price ?? 0) * Number(item.quantity ?? 1))}</strong></li>)}</ul> : <p className="muted">No line items were returned for this order.</p>}
      </section>
    </div>
  )
}
