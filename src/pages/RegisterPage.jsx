import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import PasswordField from '../components/PasswordField'

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', confirm_password: '' })
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
      navigate('/login')
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
        <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <PasswordField name="password" label="Password" value={form.password} onChange={handleChange} required />
        <PasswordField name="confirm_password" label="Confirm password" value={form.confirm_password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}
