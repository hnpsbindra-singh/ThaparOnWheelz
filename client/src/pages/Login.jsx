import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { showToast } from '../components/Toast'
import { Zap } from 'lucide-react'
import styles from './Auth.module.css'
import lp from './Login.module.css'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      const token = res.data
      const payload = JSON.parse(atob(token.split('.')[1]))
      const role = payload.role?.replace('ROLE_', '')
      login(token, { username: form.username, name: form.username, role })
      showToast('Welcome back! 🚘', 'success')
      if (role === 'STUDENT') navigate('/student')
      else if (role === 'DRIVER') navigate('/driver')
      else if (role === 'ADMIN') navigate('/admin')
      else navigate('/')
    } catch (err) {
      showToast(err.response?.data || 'Login failed. Check your credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Zap size={26} fill="var(--accent)" strokeWidth={0} />
          <h1>ThaparOnWheelz</h1>
        </div>
        <p className={styles.sub}>Campus e-rickshaw booking</p>
        <div className={styles.fare}>⚡ Flat ₹10 per ride · Thapar University</div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username / Email</label>
            <input
              type="text"
              placeholder="you@thapar.edu"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Forgot password link — right aligned under password field */}
          <div className={lp.forgotRow}>
            <Link to="/forgot-password" className={lp.forgotLink}>
              Forgot password? Reset now →
            </Link>
          </div>

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? <span className="loader" /> : 'Sign In'}
          </button>
        </form>

        <p className={styles.footer}>
          No account? <Link to="/register" className={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  )
}