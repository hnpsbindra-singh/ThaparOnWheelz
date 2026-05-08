import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const roleDash = () => {
    if (role === 'STUDENT') return '/student'
    if (role === 'DRIVER') return '/driver'
    if (role === 'ADMIN') return '/admin'
    return '/'
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate(roleDash())}>
        🛺 ThaparOnWheelz
      </div>
      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.roleTag}>{role}</span>
            <span className={styles.username}>{user.name || user.username}</span>
            <button className={styles.logout} onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
