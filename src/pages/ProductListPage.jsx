import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { formatCurrency, toArray } from '../utils/apiData'

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get('/api/v1/products/')
        setProducts(toArray(data))
      } catch {
        setError('Unable to load products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const cartLines = useMemo(() => Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = products.find((item) => String(item.id) === productId)
      return product ? { product, quantity } : null
    })
    .filter(Boolean), [cart, products])

  const cartTotal = cartLines.reduce((total, line) => total + Number(line.product.price ?? 0) * line.quantity, 0)
  const itemCount = cartLines.reduce((total, line) => total + line.quantity, 0)

  const updateQuantity = (product, nextQuantity) => {
    const stock = Number(product.stock ?? product.quantity ?? 0)
    const safeQuantity = Math.max(0, Math.min(Number(nextQuantity) || 0, stock || 99))
    setSuccess('')
    setCart((current) => {
      const next = { ...current }
      if (safeQuantity <= 0) delete next[product.id]
      else next[product.id] = safeQuantity
      return next
    })
  }

  const createOrder = async () => {
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const payload = {
        items: cartLines.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity,
        })),
      }
      const { data } = await api.post('/api/v1/orders/', payload)
      setCart({})
      setSuccess(`Order #${data?.id ?? data?.order?.id ?? ''} created and inventory reserved.`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create order. Please check item stock and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="loading-state">Loading products...</p>
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Customer ordering</p>
          <h1>Products</h1>
          <p>Select products, build a cart, and submit an order to reserve inventory.</p>
        </div>
        <Link className="button secondary" to="/orders">View my orders</Link>
      </section>

      {error ? <p className="alert error">{error}</p> : null}
      {success ? <p className="alert success">{success}</p> : null}

      <div className="commerce-layout">
        <section className="card-grid product-grid">
          {products.map((product) => {
            const stock = Number(product.stock ?? product.quantity ?? 0)
            const quantity = cart[product.id] ?? 0
            return (
              <article key={product.id} className="card product-card">
                <div>
                  <p className="eyebrow">SKU #{product.id}</p>
                  <h2>{product.name}</h2>
                  <p className="muted">{product.description || 'No description available.'}</p>
                </div>
                <div className="product-meta">
                  <strong>{formatCurrency(product.price)}</strong>
                  <span className={stock > 0 ? 'pill success' : 'pill danger'}>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
                </div>
                <div className="quantity-row">
                  <button type="button" className="button secondary" onClick={() => updateQuantity(product, quantity - 1)} disabled={!quantity}>-</button>
                  <input aria-label={`${product.name} quantity`} min="0" max={stock || undefined} type="number" value={quantity} onChange={(event) => updateQuantity(product, event.target.value)} />
                  <button type="button" className="button" onClick={() => updateQuantity(product, quantity + 1)} disabled={stock <= 0 || quantity >= stock}>Add</button>
                </div>
              </article>
            )
          })}
        </section>

        <aside className="cart-panel card">
          <p className="eyebrow">Cart</p>
          <h2>{itemCount} item{itemCount === 1 ? '' : 's'}</h2>
          {cartLines.length ? (
            <ul className="line-list">
              {cartLines.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>{product.name} × {quantity}</span>
                  <strong>{formatCurrency(Number(product.price ?? 0) * quantity)}</strong>
                </li>
              ))}
            </ul>
          ) : <p className="muted">Add products to start an order.</p>}
          <div className="cart-total"><span>Total</span><strong>{formatCurrency(cartTotal)}</strong></div>
          <button type="button" className="button full-width" onClick={createOrder} disabled={!cartLines.length || submitting}>{submitting ? 'Creating order...' : 'Create order'}</button>
        </aside>
      </div>
    </div>
  )
}
