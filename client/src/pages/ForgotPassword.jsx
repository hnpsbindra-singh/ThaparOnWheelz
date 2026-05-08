import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { showToast } from '../components/Toast'
import { KeyRound, ArrowLeft } from 'lucide-react'
import styles from './Auth.module.css'
import fp from './ForgotPassword.module.css'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [sending, setSending] = useState(false)
  const [resetting, setResetting] = useState(false)
  const navigate = useNavigate()

  async function sendOtp() {
    if (!username.trim()) return showToast('Enter your username first', 'error')
    setSending(true)
    try {
      await api.post(`/auth/send-reset-otp?username=${encodeURIComponent(username)}`)
      showToast('OTP sent to your registered email!', 'success')
      setStep(2)
    } catch {
      showToast('Could not send OTP. Check your username.', 'error')
    } finally {
      setSending(false)
    }
  }

  async function resetPassword() {
    if (!otp.trim()) return showToast('Enter the OTP', 'error')
    if (!newPassword) return showToast('Enter a new password', 'error')
    if (newPassword !== confirm) return showToast('Passwords do not match', 'error')
    if (newPassword.length < 6) return showToast('Password must be at least 6 characters', 'error')
    setResetting(true)
    try {
      await api.post('/auth/reset-password', {
        username,
        OTP: otp,
        newpassword: newPassword,
      })
      showToast('Password reset successfully! Please login.', 'success')
      navigate('/login')
    } catch {
      showToast('Invalid or expired OTP', 'error')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <KeyRound size={22} color="var(--accent)" />
          <h1>Reset Password</h1>
        </div>
        <p className={styles.sub}>
          {step === 1
            ? "Enter your username and we'll send an OTP to your email."
            : `OTP sent to the email linked with "${username}"`}
        </p>

        {/* Step indicator */}
        <div className={fp.steps}>
          <div className={`${fp.step} ${step >= 1 ? fp.stepActive : ''}`}>
            <div className={fp.stepDot}>1</div>
            <span>Send OTP</span>
          </div>
          <div className={fp.stepLine} />
          <div className={`${fp.step} ${step >= 2 ? fp.stepActive : ''}`}>
            <div className={fp.stepDot}>2</div>
            <span>New Password</span>
          </div>
        </div>

        {step === 1 && (
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Username / Email</label>
              <input
                type="text"
                placeholder="you@thapar.edu"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                autoFocus
              />
            </div>
            <button className={styles.btn} onClick={sendOtp} disabled={sending}>
              {sending ? <span className="loader" /> : 'Send OTP →'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <div className={styles.field}>
              <label>OTP (check your email)</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.field}>
              <label>New Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && resetPassword()}
              />
            </div>
            <button className={styles.btn} onClick={resetPassword} disabled={resetting}>
              {resetting ? <span className="loader" /> : 'Reset Password ✓'}
            </button>
            <button className={fp.resendBtn} onClick={() => { setStep(1); setOtp(''); setNewPassword(''); setConfirm('') }}>
              ← Resend / Change Username
            </button>
          </div>
        )}

        <p className={styles.footer}>
          <Link to="/login" className={styles.link}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}