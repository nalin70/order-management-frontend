import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import { formatCurrency } from '../utils/apiData'

const emptyForm = {
  name: '',
  description: '',
  sku: '',
  price: '',
  stock: '',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/v1/products/')
      setProducts(data.results ?? data)
    } catch {
      setError('Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      if (editingId) {
        await api.patch(`/api/v1/products/${editingId}/`, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        })
        setMessage('Product updated successfully.')
      } else {
        await api.post('/api/v1/products/', {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        })
        setMessage('Product created successfully.')
      }
      setForm(emptyForm)
      setEditingId(null)
      setIsProductModalOpen(false)
      await loadProducts()
    } catch {
      setError('Unable to save product')
    }
  }

  const handleAdd = () => {
    setError('')
    setMessage('')
    setEditingId(null)
    setForm(emptyForm)
    setIsProductModalOpen(true)
  }

  const handleEdit = (product) => {
    setError('')
    setMessage('')
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      sku: product.sku || '',
      price: product.price || '',
      stock: product.stock || '',
    })
    setIsProductModalOpen(true)
  }

  const handleDelete = async (id) => {
    setError('')
    setMessage('')
    try {
      await api.delete(`/api/v1/products/${id}/`)
      setMessage('Product deleted successfully.')
      await loadProducts()
    } catch {
      setError('Unable to delete product')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setIsProductModalOpen(false)
  }

  const title = useMemo(() => (editingId ? 'Edit product' : 'Create product'), [editingId])

  if (loading) {
    return <p>Loading products...</p>
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Admin inventory</p>
          <h1>Inventory</h1>
          <p>Create, edit, and monitor stock for products in the catalogue.</p>
        </div>
        <div className="page-hero-actions">
          <button type="button" onClick={handleAdd}>Add product</button>
        </div>
      </section>

      {error ? <p className="alert error">{error}</p> : null}
      {message ? <p className="alert success">{message}</p> : null}

      <section className="admin-product-list">
        <h2>Product list</h2>
        <div className="card-grid">
          {products.map((product) => (
            <article key={product.id} className="card">
              <h3>{product.name}</h3>
              <p>{product.description || 'No description'}</p>
              <p>SKU: {product.sku || 'N/A'}</p>
              <p><strong>{formatCurrency(product.price)}</strong></p>
              <p>Stock: {product.stock}</p>
              <div className="product-actions">
                <button type="button" onClick={() => handleEdit(product)}>Edit</button>
                <button type="button" className="danger" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isProductModalOpen ? (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) cancelEdit()
        }}>
          <section className="modal-panel product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Product</p>
                <h2 id="product-modal-title">{title}</h2>
              </div>
              <button className="modal-close" type="button" aria-label="Close product popup" onClick={cancelEdit}>
                &times;
              </button>
            </div>
            {error ? <p className="alert error">{error}</p> : null}
            <form onSubmit={handleSave} className="product-form">
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
              <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
              <div className="product-form-actions">
                <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>
                <button type="submit">{editingId ? 'Update product' : 'Add product'}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  )
}
