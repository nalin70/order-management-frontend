import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const { data } = await api.get('/api/v1/payments/')
        setPayments(data)
      } catch (err) {
        setError('Unable to load payments')
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  if (loading) {
    return <p>Loading payments...</p>
  }

  return (
    <div>
      <h1>Payments</h1>
      {error ? <p className="error">{error}</p> : null}
      <div className="card-grid">
        {payments.map((payment) => (
          <article key={payment.id} className="card">
            <h2>Payment #{payment.id}</h2>
            <p>Status: {payment.status}</p>
            <p>Amount: ${payment.amount}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
