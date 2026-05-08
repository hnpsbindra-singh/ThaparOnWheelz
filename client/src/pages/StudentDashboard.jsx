import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { showToast } from '../components/Toast'
import LocationSelect from '../components/LocationSelect'
import { prettyLocation } from '../api/locations'
import { MapPin, ChevronRight, User, Phone, Car, TrendingUp, Clock, CheckCircle2, Ticket, RefreshCw } from 'lucide-react'
import styles from './StudentDashboard.module.css'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [pickUp, setPickUp] = useState('')
  const [drop, setDrop] = useState('')
  const [booking, setBooking] = useState(null)
  const [rides, setRides] = useState([])
  const [ridesLoaded, setRidesLoaded] = useState(false)
  const [loadingBook, setLoadingBook] = useState(false)
  const [activeTab, setActiveTab] = useState('book')
  const [statusData, setStatusData] = useState({})
  const pollRef = useRef(null)

  async function loadRides() {
    try {
      const res = await api.get(`/student/view-all-rides?username=${encodeURIComponent(user.username)}`)
      setRides(res.data)
      setRidesLoaded(true)
    } catch { /* silent */ }
  }

  useEffect(() => { loadRides() }, [])

  function startPolling(id) {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/student/viewStatus/${id}`)
        setStatusData(s => ({ ...s, [id]: res.data }))
        if (res.data?.name) {
          clearInterval(pollRef.current)
          showToast('Driver assigned! 🛺', 'success')
          loadRides()
        }
      } catch { /* silent */ }
    }, 6000)
  }

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  async function bookRide() {
    if (!pickUp || !drop) return showToast('Select both pickup & drop', 'error')
    if (pickUp === drop) return showToast('Pickup and drop cannot be same', 'error')
    setLoadingBook(true)
    try {
      const res = await api.post(`/student/book-a-ride?username=${encodeURIComponent(user.username)}`, { pickUp, drop })
      setBooking(res.data)
      showToast('Ride booked! ₹10 flat fare.', 'success')
      setPickUp('')
      setDrop('')
      loadRides()
      startPolling(res.data.bookingid)
    } catch (err) {
      showToast(err.response?.data || 'Booking failed', 'error')
    } finally {
      setLoadingBook(false)
    }
  }

  async function checkStatus(id) {
    try {
      const res = await api.get(`/student/viewStatus/${id}`)
      setStatusData(s => ({ ...s, [id]: res.data }))
    } catch { showToast('Status unavailable', 'error') }
  }

  const completedRides = rides.filter(r => r.driverId).length
  const pendingRides = rides.filter(r => !r.driverId).length

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.greet}>Hey {user?.name || user?.username} 👋</span>
          <h1>Where to?</h1>
          <p>Campus e-rickshaw · <strong>₹10 flat fare</strong></p>
        </div>
        <div className={styles.badge}>🛺</div>
      </div>

      {ridesLoaded && (
        <div className={styles.statsStrip}>
          <div className={styles.statItem}>
            <Ticket size={14} color="var(--accent)" />
            <div>
              <div className={styles.statVal}>{rides.length}</div>
              <div className={styles.statLbl}>Total Rides</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <CheckCircle2 size={14} color="#1a783c" />
            <div>
              <div className={styles.statVal} style={{ color: '#1a783c' }}>{completedRides}</div>
              <div className={styles.statLbl}>Completed</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <Clock size={14} color="var(--gold)" />
            <div>
              <div className={styles.statVal} style={{ color: 'var(--gold)' }}>{pendingRides}</div>
              <div className={styles.statLbl}>Pending</div>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <TrendingUp size={14} color="var(--blue)" />
            <div>
              <div className={styles.statVal} style={{ color: 'var(--blue)' }}>₹{completedRides * 10}</div>
              <div className={styles.statLbl}>Spent</div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'book' ? styles.active : ''}`} onClick={() => setActiveTab('book')}>Book a Ride</button>
        <button className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`} onClick={() => { setActiveTab('history'); loadRides() }}>
          My Rides {rides.length > 0 && <span className={styles.tabBadge}>{rides.length}</span>}
        </button>
      </div>

      {activeTab === 'book' && (
        <div className={styles.bookCard}>
          <p className={styles.sectionLabel}>Plan your route</p>
          <div className={styles.routeWrap}>
            <div className={styles.routeRow}>
              <div className={styles.routeRail}>
                <div className={styles.routeDot} style={{ background: 'var(--accent)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <LocationSelect label="Pickup" value={pickUp} onChange={setPickUp} exclude={drop} />
              </div>
            </div>
            <div className={styles.routeRow}>
              <div className={styles.routeRail}><div className={styles.routeRailLine} /></div>
            </div>
            <div className={styles.routeRow}>
              <div className={styles.routeRail}>
                <div className={styles.routeDot} style={{ background: '#c0392b' }} />
              </div>
              <div style={{ flex: 1 }}>
                <LocationSelect label="Drop" value={drop} onChange={setDrop} exclude={pickUp} />
              </div>
            </div>
          </div>

          <div className={styles.fareRow}>
            <div className={styles.fareBox}>🪙 Flat fare <strong>₹10</strong></div>
            {pickUp && drop && (
              <div className={styles.routeSummary}>{prettyLocation(pickUp)} → {prettyLocation(drop)}</div>
            )}
          </div>

          <button className={styles.bookBtn} onClick={bookRide} disabled={loadingBook}>
            {loadingBook ? <span className="loader" /> : <>Book Ride <ChevronRight size={18} /></>}
          </button>

          {booking && (
            <div className={styles.confirmation}>
              <div className={styles.confirmHeader}>
                <span>🎉 Ride Booked!</span>
                <span className={styles.bookingId}>#{booking.bookingid?.slice(0, 8)}…</span>
              </div>
              <div className={styles.confirmRoute}>
                <MapPin size={12} color="var(--accent)" />
                <span>{prettyLocation(booking.pickUp)}</span>
                <ChevronRight size={12} />
                <span>{prettyLocation(booking.drop)}</span>
              </div>
              <p className={styles.confirmNote}>Looking for a driver… status updates automatically every 6s.</p>
              <button className={styles.statusBtn} onClick={() => checkStatus(booking.bookingid)}>
                <RefreshCw size={12} /> Check Now
              </button>
              {statusData[booking.bookingid] && <DriverCard data={statusData[booking.bookingid]} />}
            </div>
          )}

          {ridesLoaded && rides.length > 0 && (
            <div className={styles.recentWrap}>
              <p className={styles.sectionLabel}>Recent rides</p>
              {rides.slice(0, 3).map(ride => (
                <div key={ride.id} className={styles.recentRow}>
                  <div className={styles.recentRoute}>
                    <MapPin size={11} color="var(--text3)" />
                    <span>{prettyLocation(ride.pickUp)}</span>
                    <ChevronRight size={10} color="var(--text3)" />
                    <span>{prettyLocation(ride.drop)}</span>
                  </div>
                  <span className={`${styles.rideStatus} ${ride.driverId ? styles.accepted : styles.pending}`}>
                    {ride.driverId ? '✓ Done' : '⏳ Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className={styles.historyWrap}>
          {rides.length === 0 ? (
            <div className={styles.empty}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛺</div>
              <p>No rides yet — book your first one!</p>
            </div>
          ) : (
            <>
              <div className={styles.historyMeta}>
                {rides.length} ride{rides.length !== 1 ? 's' : ''} · ₹{completedRides * 10} total spent
              </div>
              {rides.map((ride, i) => (
                <div key={ride.id} className={styles.rideCard}>
                  <div className={styles.rideCardTop}>
                    <span className={styles.rideNum}>#{rides.length - i}</span>
                    <span className={`${styles.rideStatus} ${ride.driverId ? styles.accepted : styles.pending}`}>
                      {ride.driverId ? '✓ Accepted' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className={styles.rideRoute}>
                    <MapPin size={13} color="var(--accent)" />
                    <span>{prettyLocation(ride.pickUp)}</span>
                    <ChevronRight size={12} color="var(--text3)" />
                    <span>{prettyLocation(ride.drop)}</span>
                  </div>
                  <div className={styles.rideFooter}>
                    <span className={styles.rideFare}>₹10</span>
                    <button className={styles.statusBtn} onClick={() => checkStatus(ride.id)}>
                      <RefreshCw size={11} /> View Driver
                    </button>
                  </div>
                  {statusData[ride.id] && <DriverCard data={statusData[ride.id]} />}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function DriverCard({ data }) {
  if (!data?.name) return (
    <div className={styles.driverWaiting}><Clock size={13} /> Waiting for a driver to accept…</div>
  )
  return (
    <div className={styles.driverCard}>
      <div className={styles.driverCardTitle}>Your Driver</div>
      <div className={styles.driverRow}><User size={13} color="var(--accent)" /><strong>{data.name}</strong></div>
      <div className={styles.driverRow}><Phone size={13} color="var(--text2)" /><span>{data.number}</span></div>
      {data.vehicleNumber && <div className={styles.driverRow}><Car size={13} color="var(--text2)" /><span>{data.vehicleNumber}</span></div>}
    </div>
  )
}