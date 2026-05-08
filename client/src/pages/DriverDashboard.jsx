import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { showToast } from '../components/Toast'
import { prettyLocation } from '../api/locations'
import { MapPin, ChevronRight, CheckCircle, Clock, IndianRupee, TrendingUp, RefreshCw, Bike } from 'lucide-react'
import styles from './DriverDashboard.module.css'

export default function DriverDashboard() {
  const { user } = useAuth()
  const [pending, setPending] = useState([])
  const [history, setHistory] = useState([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [accepting, setAccepting] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const autoRef = useRef(null)

  async function loadPending(silent = false) {
    try {
      const res = await api.get('/driver/view-all-pending')
      setPending(res.data)
      setLastRefresh(new Date())
      if (!silent && res.data.length > 0) showToast(`${res.data.length} ride${res.data.length > 1 ? 's' : ''} available`, 'success')
    } catch { if (!silent) showToast('Could not load rides', 'error') }
  }

  async function loadHistory() {
    try {
      const res = await api.get(`/driver/view-history?username=${encodeURIComponent(user.username)}`)
      setHistory(res.data)
      setHistoryLoaded(true)
    } catch { showToast('Could not load history', 'error') }
  }

  // Auto-refresh pending every 15s
  useEffect(() => {
    loadPending(true)
    loadHistory()
    autoRef.current = setInterval(() => loadPending(true), 15000)
    return () => clearInterval(autoRef.current)
  }, [])

  useEffect(() => {
    if (activeTab === 'history') loadHistory()
  }, [activeTab])

  async function acceptRide(id) {
    setAccepting(id)
    try {
      await api.put(`/driver/accept-ride/${id}?username=${encodeURIComponent(user.username)}`)
      showToast('Ride accepted! 🛺', 'success')
      setPending(p => p.filter(r => r.id !== id))
      loadHistory()
    } catch (err) {
      showToast(err.response?.data || 'Could not accept', 'error')
    } finally {
      setAccepting(null)
    }
  }

  const earnings = history.length * 10
  const timeAgo = lastRefresh
    ? `${Math.floor((Date.now() - lastRefresh) / 1000)}s ago`
    : '—'

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div>
          <span className={styles.greet}>Driver Dashboard</span>
          <h1>{user?.name || user?.username}</h1>
          <p>Accept rides · ₹10 per trip</p>
        </div>
        <div className={styles.bigIcon}>🛺</div>
      </div>

      {/* Stats strip */}
      {historyLoaded && (
        <div className={styles.statsStrip}>
          <div className={styles.statItem}>
            <Bike size={14} color="var(--accent)" />
            <div>
              <div className={styles.statVal}>{history.length}</div>
              <div className={styles.statLbl}>Rides Done</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <IndianRupee size={14} color="#1a783c" />
            <div>
              <div className={styles.statVal} style={{ color: '#1a783c' }}>₹{earnings}</div>
              <div className={styles.statLbl}>Total Earned</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <Clock size={14} color="var(--gold)" />
            <div>
              <div className={styles.statVal} style={{ color: 'var(--gold)' }}>{pending.length}</div>
              <div className={styles.statLbl}>Pending Now</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <TrendingUp size={14} color="var(--blue)" />
            <div>
              <div className={styles.statVal} style={{ color: 'var(--blue)' }}>
                ₹{history.length > 0 ? Math.round(earnings / history.length) : 0}
              </div>
              <div className={styles.statLbl}>Avg / Ride</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
          onClick={() => { setActiveTab('pending'); loadPending() }}>
          Pending Rides
          {pending.length > 0 && <span className={styles.badge}>{pending.length}</span>}
        </button>
        <button className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}>
          My History {history.length > 0 && <span className={styles.badge} style={{ background: 'rgba(255,255,255,0.2)' }}>{history.length}</span>}
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className={styles.list}>
          <div className={styles.listHeader}>
            <span className={styles.listMeta}>
              {pending.length === 0 ? 'No pending rides' : `${pending.length} ride${pending.length > 1 ? 's' : ''} waiting`}
            </span>
            <button className={styles.refreshBtn} onClick={() => loadPending()}>
              <RefreshCw size={13} /> Refresh · {timeAgo}
            </button>
          </div>

          {pending.length === 0 ? (
            <div className={styles.empty}>
              <Clock size={32} color="var(--text3)" />
              <p>No rides right now</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Auto-refreshes every 15 seconds</p>
            </div>
          ) : (
            pending.map(ride => (
              <div key={ride.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.routeInfo}>
                    <div className={styles.locPin} style={{ color: 'var(--accent)' }}>
                      <MapPin size={13} />
                      {prettyLocation(ride.pickUp)}
                    </div>
                    <ChevronRight size={13} color="var(--text3)" />
                    <div className={styles.locPin} style={{ color: '#c0392b' }}>
                      <MapPin size={13} />
                      {prettyLocation(ride.drop)}
                    </div>
                  </div>
                  <span className={styles.fare}>₹10</span>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.cardId}>Ride #{ride.id?.slice(0, 10)}…</span>
                  <span className={styles.newBadge}>New</span>
                </div>
                <button className={styles.acceptBtn} onClick={() => acceptRide(ride.id)} disabled={accepting === ride.id}>
                  {accepting === ride.id ? <span className="loader" /> : <><CheckCircle size={15} /> Accept Ride</>}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className={styles.list}>
          {history.length === 0 ? (
            <div className={styles.empty}><p>No completed rides yet</p></div>
          ) : (
            <>
              <div className={styles.listMeta}>{history.length} completed · ₹{earnings} earned total</div>
              {history.map((ride, i) => (
                <div key={ride.id} className={`${styles.card} ${styles.done}`}>
                  <div className={styles.cardTop}>
                    <div className={styles.routeInfo}>
                      <div className={styles.locPin}>
                        <MapPin size={12} color="var(--text2)" />
                        {prettyLocation(ride.pickUp)}
                      </div>
                      <ChevronRight size={12} color="var(--text3)" />
                      <div className={styles.locPin}>
                        <MapPin size={12} color="var(--text2)" />
                        {prettyLocation(ride.drop)}
                      </div>
                    </div>
                    <span className={styles.fare} style={{ color: '#1a783c' }}>₹10 ✓</span>
                  </div>
                  <div className={styles.cardId}>Ride #{history.length - i} · {ride.id?.slice(0, 10)}…</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}