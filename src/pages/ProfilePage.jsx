import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext)

  return (
    <div className="card">
      <h1>Profile</h1>
      <p><strong>Username:</strong> {user?.username || '—'}</p>
      <p><strong>Email:</strong> {user?.email || '—'}</p>
      <p><strong>Role:</strong> {user?.role || 'USER'}</p>
      <button type="button" onClick={logout}>Logout</button>
    </div>
  )
}
