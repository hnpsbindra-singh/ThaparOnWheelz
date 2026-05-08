import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { showToast } from '../components/Toast'
import { Zap, Shield } from 'lucide-react'
import styles from './Auth.module.css'

export default function VerifyOTP() {
  const [searchParams] = useSearchParams()
  const [username, setUsername] = useState(searchParams.get('username') || '')
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const navigate = useNavigate()

  async function sendOtp() {
    if (!username) return showToast('Enter username first', 'error')
    setSending(true)
    try {
      await api.post(`/auth/send-otp?username=${encodeURIComponent(username)}`)
      showToast('OTP sent to your email!', 'success')
    } catch {
      showToast('Failed to send OTP', 'error')
    } finally {
      setSending(false)
    }
  }

  async function verifyOtp(e) {
    e.preventDefault()
    setVerifying(true)
    try {
      const res = await api.post(
        `/auth/verify-otp?username=${encodeURIComponent(username)}`,
        Number(otp),
        { headers: { 'Content-Type': 'application/json' } }
      )
      showToast('Verified! Please login.', 'success')
      navigate('/login')
    } catch {
      showToast('Invalid or expired OTP', 'error')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.brand}>
          <Shield size={24} color="var(--accent)" />
          <h1>Verify OTP</h1>
        </div>
        <p className={styles.sub}>Enter the OTP sent to your registered email</p>

        <form onSubmit={verifyOtp} className={styles.form}>
          <div className={styles.field}>
            <label>Username / Email</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="you@thapar.edu"
              required
            />
          </div>

          <button type="button" className={styles.btn} style={{ background: 'var(--bg3)', color: 'var(--accent)', border: '1px solid rgba(181,255,71,0.2)' }} onClick={sendOtp} disabled={sending}>
            {sending ? <span className="loader" style={{ borderTopColor: 'var(--accent)' }} /> : '⚡ Send OTP'}
          </button>

          <div className={styles.field}>
            <label>Enter OTP</label>
            <input
              type="number"
              placeholder="6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
          </div>

          <button className={styles.btn} type="submit" disabled={verifying}>
            {verifying ? <span className="loader" /> : 'Verify →'}
          </button>
        </form>

        <p className={styles.footer}>
          <Link to="/login" className={styles.link}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
