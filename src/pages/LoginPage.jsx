import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function getLoginErrorMessage(err) {
  const data = err.response?.data
  const errors = data?.errors || {}
  const firstFieldError = Object.values(errors).flat().find(Boolean)

  return errors.detail
    || data?.detail
    || data?.non_field_errors?.[0]
    || firstFieldError
    || data?.message
    || err.message
    || 'Login failed'
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const nextUser = await login(form)
      navigate(String(nextUser?.role).toUpperCase() === 'ADMIN' ? '/admin/products' : '/products')
    } catch (err) {
      setError(getLoginErrorMessage(err))
    }
  }

  return (
    <div className="auth-card">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      <p>
        No account yet? <Link to="/register">Create one</Link>
      </p>
    </div>
  )
}
