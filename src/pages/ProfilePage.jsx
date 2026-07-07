import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext)
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '' })
  const [message, setMessage] = useState('')
  const isAdmin = String(user?.role ?? '').toUpperCase() === 'ADMIN'

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
    <div className="page-stack narrow">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
          <p>Manage your account details and session.</p>
        </div>
      </section>

      <section className="card">
        <div className="stat-grid">
          <div>
            <span>Email</span>
            <strong>{user?.email || '-'}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user?.role || '-'}</strong>
          </div>
        </div>

        {!isAdmin ? (
          <>
            <form onSubmit={handleSubmit} className="profile-form">
              <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} />
              <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} />
              <button type="submit">Update profile</button>
            </form>
            {message ? <p className="success">{message}</p> : null}
          </>
        ) : null}
        <button type="button" className="logout-button" onClick={logout}>Logout</button>
      </section>
    </div>
  )
}
