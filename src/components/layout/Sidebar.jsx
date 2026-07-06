import { Link } from 'react-router-dom'

export default function Sidebar({ isAdmin }) {
  return (
    <aside className="sidebar">
      <nav>
        {isAdmin ? (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/profile">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/products">Products</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </nav>
    </aside>
  )
}
