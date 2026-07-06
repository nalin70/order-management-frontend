import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import { canInitiateOrderPayment, formatCurrency, toArray } from '../utils/apiData'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = async () => {
    const [paymentsResponse, ordersResponse] = await Promise.all([
      api.get('/api/v1/payments/'),
      api.get('/api/v1/orders/'),
    ])
    setPayments(toArray(paymentsResponse.data))
    setOrders(toArray(ordersResponse.data))
  }

  useEffect(() => {
    loadData().catch(() => setError('Unable to load payments')).finally(() => setLoading(false))
  }, [])

  const payableOrders = useMemo(() => orders.filter(canInitiateOrderPayment), [orders])

  const initiatePayment = async () => {
    setError('')
    setSuccess('')
    setBusyId('initiate')
    try {
      await api.post('/api/v1/payments/initiate/', { order_id: Number(selectedOrder) })
      setSuccess('Payment initiated successfully.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to initiate payment')
    } finally {
      setBusyId(null)
    }
  }

  const retryPayment = async (paymentId) => {
    setBusyId(paymentId)
    setError('')
    setSuccess('')
    try {
      await api.post(`/api/v1/payments/${paymentId}/retry/`)
      setSuccess(`Payment #${paymentId} retry started.`)
      await loadData()
    } catch {
      setError('Unable to retry failed payment')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <p className="loading-state">Loading payments...</p>

  return (
    <div className="page-stack">
      <section className="page-hero"><div><p className="eyebrow">Payments</p><h1>Payments</h1><p>Initiate payments for orders and retry failed transactions.</p></div></section>
      {error ? <p className="alert error">{error}</p> : null}{success ? <p className="alert success">{success}</p> : null}
      <section className="card payment-initiate"><h2>Initiate payment</h2><div className="form-row"><select value={selectedOrder} onChange={(event) => setSelectedOrder(event.target.value)}><option value="">Select an order</option>{payableOrders.map((order) => <option key={order.id} value={order.id}>Order #{order.id} · {formatCurrency(order.total_amount ?? order.total)}</option>)}</select><button className="button" type="button" onClick={initiatePayment} disabled={!selectedOrder || busyId === 'initiate'}>{busyId === 'initiate' ? 'Starting...' : 'Initiate'}</button></div></section>
      <div className="card-grid">{payments.map((payment) => (<article key={payment.id} className="card payment-card"><span className="pill">{payment.status}</span><h2>Payment #{payment.id}</h2><p className="total-line">{formatCurrency(payment.amount)}</p><p className="muted">Order #{payment.order?.id ?? payment.order_id ?? payment.order ?? '—'}</p>{String(payment.status).toLowerCase() === 'failed' ? <button className="button secondary" type="button" onClick={() => retryPayment(payment.id)} disabled={busyId === payment.id}>{busyId === payment.id ? 'Retrying...' : 'Retry payment'}</button> : null}</article>))}</div>
    </div>
  )
}
