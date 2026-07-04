import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext)
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '' })
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await api.patch('/api/auth/profile/', form)
      setMessage(response.data.message || 'Profile updated successfully.')
    } catch {
      setMessage('Profile update failed.')
    }
  }

  return (
    <div className="card">
      <h1>Profile</h1>
      <p><strong>Email:</strong> {user?.email || '—'}</p>
      <p><strong>Role:</strong> {user?.role || '—'}</p>
      <form onSubmit={handleSubmit} className="profile-form">
        <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} />
        <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} />
        <button type="submit">Update profile</button>
      </form>
      {message ? <p className="success">{message}</p> : null}
      <button type="button" className="logout-button" onClick={logout}>Logout</button>
    </div>
  )
}
