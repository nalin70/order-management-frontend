import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await register(form)
      navigate('/products')
    } catch (err) {
      const data = err.response?.data
      const message = data?.detail || data?.message || 'Registration failed'
      setError(message)
    }
  }

  return (
    <div className="auth-card">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="password2" type="password" placeholder="Confirm password" value={form.password2} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}
