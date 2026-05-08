import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { showToast } from '../components/Toast'
import { Zap } from 'lucide-react'
import styles from './Auth.module.css'

export default function Register() {
  const [form, setForm] = useState({
    role: 'STUDENT',
    name: '',
    number: '',
    username: '',
    password: '',
    vehicleNumber: '',
    rollNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      showToast('Registered! Verify your OTP now.', 'success')
      navigate('/verify?username=' + encodeURIComponent(form.username))
    } catch (err) {
      showToast(err.response?.data || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card} style={{ maxWidth: 500 }}>
        <div className={styles.brand}>
          <Zap size={28} fill="var(--accent)" strokeWidth={0} />
          <h1>Create Account</h1>
        </div>
        <p className={styles.sub}>Join ThaparOnWheelz campus ride network</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>I am a</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="DRIVER">Driver</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input placeholder="Arjun Singh" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input placeholder="98765XXXXX" value={form.number} onChange={e => set('number', e.target.value)} required />
            </div>
          </div>

          <div className={styles.field}>
            <label>Email / Username</label>
            <input type="text" placeholder="you@thapar.edu" value={form.username} onChange={e => set('username', e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input type="password" placeholder="Min 8 chars" value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>

          {form.role === 'STUDENT' && (
            <div className={styles.field}>
              <label>Roll Number</label>
              <input placeholder="102XXXXX" value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} />
            </div>
          )}

          {form.role === 'DRIVER' && (
            <div className={styles.field}>
              <label>Vehicle Number</label>
              <input placeholder="PB65AB1234" value={form.vehicleNumber} onChange={e => set('vehicleNumber', e.target.value)} />
            </div>
          )}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? <span className="loader" /> : 'Create Account →'}
          </button>
        </form>

        <p className={styles.footer}>
          Already registered? <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
