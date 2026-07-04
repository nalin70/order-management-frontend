import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get('/api/v1/products/')
        setProducts(data.results ?? data)
      } catch (err) {
        setError('Unable to load products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return <p>Loading products...</p>
  }

  return (
    <div>
      <h1>Products</h1>
      {error ? <p className="error">{error}</p> : null}
      <div className="card-grid">
        {products.map((product) => (
          <article key={product.id} className="card">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <p>Stock: {product.stock}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
