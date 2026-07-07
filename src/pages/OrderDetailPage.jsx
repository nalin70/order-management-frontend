import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import { canInitiateOrderPayment, formatCurrency, getItemName, getOrderPaymentState, toArray } from '../utils/apiData'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [paymentSubmitting, setPaymentSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState('')

  const loadOrder = useCallback(async () => {
    const { data } = await api.get(`/api/v1/orders/${id}/`)
    setOrder(data)
    return data
  }, [id])

  useEffect(() => {
    const loadOrderDetail = async () => {
      setError('')
      setLoading(true)

      try {
        await loadOrder()
      } catch {
        setError('Unable to load order details')
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    loadOrderDetail()
  }, [loadOrder])

  const openPayment = () => {
    setPaymentError('')
    setPaymentSuccess('')
    setPaymentOpen(true)
  }

  const closePayment = () => {
    if (!paymentSubmitting) {
      setPaymentOpen(false)
      setPaymentError('')
    }
  }

  const submitPayment = async (event) => {
    event.preventDefault()
    setPaymentSubmitting(true)
    setPaymentError('')

    try {
      await api.post('/api/v1/payments/initiate/', { order_id: Number(order.id) })
      setPaymentSuccess(`Payment request for Order #${order.id} was submitted.`)
      setPaymentOpen(false)

      try {
        await loadOrder()
      } catch {
        // Keep the success message visible even if the follow-up refresh fails.
      }
    } catch (err) {
      setPaymentError(err.response?.data?.detail || 'Unable to process payment for this order')
    } finally {
      setPaymentSubmitting(false)
    }
  }

  if (loading) return <p className="loading-state">Loading order details...</p>
  if (!order) return <p className="alert error">{error || 'Order not found'}</p>

  const items = toArray(order.items ?? order.order_items)
  const paymentState = getOrderPaymentState(order)
  const paymentLabel = paymentState === 'paid' ? 'Paid' : paymentState === 'processing' ? 'Processing' : 'Due'
  const payable = canInitiateOrderPayment(order)
  const orderTotal = order.total_amount ?? order.total

  return (
    <div className="page-stack narrow">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Order detail</p>
          <h1>Order #{order.id}</h1>
          <p>Status: <strong>{order.status}</strong></p>
        </div>
        <div className="page-hero-actions">
          <Link className="button secondary" to="/orders">Back to orders</Link>
          {payable ? <button className="button" type="button" onClick={openPayment}>Pay now</button> : null}
          {paymentState === 'paid' ? <button className="button secondary" type="button" disabled>Paid</button> : null}
          {paymentState === 'processing' ? <button className="button secondary" type="button" disabled>Payment processing</button> : null}
        </div>
      </section>

      {error ? <p className="alert error">{error}</p> : null}
      {paymentSuccess ? <p className="alert success">{paymentSuccess}</p> : null}

      <section className="card detail-card">
        <div className="stat-grid">
          <div>
            <span>Total</span>
            <strong>{formatCurrency(orderTotal)}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{paymentLabel}</strong>
          </div>
          <div>
            <span>Created</span>
            <strong>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</strong>
          </div>
        </div>
        <h2>Items</h2>
        {items.length ? (
          <ul className="line-list">
            {items.map((item) => (
              <li key={item.id ?? item.product_id}>
                <span>{getItemName(item)} x {item.quantity}</span>
                <strong>{formatCurrency(item.total ?? Number(item.price ?? item.product?.price ?? 0) * Number(item.quantity ?? 1))}</strong>
              </li>
            ))}
          </ul>
        ) : <p className="muted">No line items were returned for this order.</p>}
      </section>

      {paymentOpen ? (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePayment()
        }}>
          <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Payment</p>
                <h2 id="payment-modal-title">Pay Order #{order.id}</h2>
              </div>
              <button className="modal-close" type="button" aria-label="Close payment popup" onClick={closePayment} disabled={paymentSubmitting}>
                &times;
              </button>
            </div>
            {paymentError ? <p className="alert error">{paymentError}</p> : null}
            <form className="payment-form" onSubmit={submitPayment}>
              <div className="payment-summary">
                <span>Amount</span>
                <strong>{formatCurrency(orderTotal)}</strong>
              </div>
              <label>
                Payment method
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} disabled={paymentSubmitting}>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="netbanking">Net banking</option>
                </select>
              </label>
              <div className="button-row">
                <button className="button secondary" type="button" onClick={closePayment} disabled={paymentSubmitting}>Cancel</button>
                <button className="button" type="submit" disabled={paymentSubmitting}>{paymentSubmitting ? 'Processing...' : 'Pay now'}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  )
}
