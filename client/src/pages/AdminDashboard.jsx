import { useState, useEffect } from 'react'
import api from '../api/axios'
import { showToast } from '../components/Toast'
import { prettyLocation } from '../api/locations'
import { Users, Truck, MapPin, ChevronRight, RefreshCw, TrendingUp, Activity } from 'lucide-react'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    drivers: 0,
    students: 0
  })

  const [rides, setRides] = useState([])

  const [loading, setLoading] = useState(true)

  const [lastRefresh, setLastRefresh] =
    useState(null)

  const [drivers, setDrivers] = useState([])

  const [students, setStudents] = useState([])

  const [showDrivers, setShowDrivers] =
    useState(false)

  const [showStudents, setShowStudents] =
    useState(false)

  async function load() {

    setLoading(true)

    try {

      const [d, s, r] = await Promise.all([
        api.get('/admin/total-drivers'),
        api.get('/admin/total-students'),
        api.get('/admin/get-all'),
      ])

      setStats({
        drivers: d.data,
        students: s.data
      })

      setRides(r.data)

      setLastRefresh(new Date())

    } catch {

      showToast(
        'Failed to load admin data',
        'error'
      )

    } finally {

      setLoading(false)
    }
  }

  async function loadDrivers() {

    try {

      const res = await api.get(
        '/admin/view-all-drivers'
      )

      setDrivers(res.data)

      setShowDrivers(true)

      setShowStudents(false)

    } catch {

      showToast(
        'Failed to load drivers',
        'error'
      )
    }
  }

  async function loadStudents() {

    try {

      const res = await api.get(
        '/admin/view-all-students'
      )

      setStudents(res.data)

      setShowStudents(true)

      setShowDrivers(false)

    } catch {

      showToast(
        'Failed to load students',
        'error'
      )
    }
  }

  useEffect(() => {
    load()
  }, [])

  const completed =
    rides.filter(r => r.driverId).length

  const pending =
    rides.filter(r => !r.driverId).length

  const revenue = completed * 10

  const completionRate =
    rides.length > 0
      ? Math.round(
          (completed / rides.length) * 100
        )
      : 0

  // Top locations

  const pickupCounts = {}

  const dropCounts = {}

  rides.forEach(r => {

    pickupCounts[r.pickUp] =
      (pickupCounts[r.pickUp] || 0) + 1

    dropCounts[r.drop] =
      (dropCounts[r.drop] || 0) + 1
  })

  const topPickups =
    Object.entries(pickupCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

  const topDrops =
    Object.entries(dropCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

  const maxCount = Math.max(
    ...topPickups.map(x => x[1]),
    1
  )

  return (

    <div className={styles.page}>

      {/* Hero */}

      <div className={styles.hero}>

        <div>

          <span className={styles.greet}>
            Admin Panel
          </span>

          <h1>ThaparOnWheelz</h1>

          <p>Live platform overview</p>

        </div>

        <button
          className={styles.refresh}
          onClick={load}
          disabled={loading}
        >

          <RefreshCw
            size={14}
            className={
              loading ? styles.spinning : ''
            }
          />

          {
            lastRefresh
              ? `Updated ${
                  Math.floor(
                    (Date.now() - lastRefresh) / 1000
                  )
                }s ago`
              : 'Refresh'
          }

        </button>

      </div>

      {/* Stats grid */}

      <div className={styles.statsGrid}>

        <StatCard
          icon={<Users size={18} />}
          label="Students"
          value={stats.students}
          color="var(--blue)"
          bg="var(--blue-dim)"
        />

        <StatCard
          icon={<Truck size={18} />}
          label="Drivers"
          value={stats.drivers}
          color="var(--accent)"
          bg="var(--accent-dim)"
        />

        <StatCard
          icon={<Activity size={18} />}
          label="Total Rides"
          value={rides.length}
          color="#7c3aed"
          bg="rgba(124,58,237,0.08)"
        />

        <StatCard
          icon={<TrendingUp size={18} />}
          label="Revenue"
          value={`₹${revenue}`}
          color="#1a783c"
          bg="rgba(26,120,60,0.08)"
        />

      </div>

      {/* Secondary stats */}

      <div className={styles.secondaryGrid}>

        <div className={styles.secondaryCard}>

          <div className={styles.secondaryLabel}>
            Completion Rate
          </div>

          <div className={styles.progressWrap}>

            <div className={styles.progressBar}>

              <div
                className={styles.progressFill}
                style={{
                  width: `${completionRate}%`
                }}
              />

            </div>

            <span className={styles.progressVal}>
              {completionRate}%
            </span>

          </div>

          <div className={styles.secondaryMeta}>
            {completed} completed · {pending} pending
          </div>

        </div>

        <div className={styles.secondaryCard}>

          <div className={styles.secondaryLabel}>
            Avg Rides / Driver
          </div>

          <div className={styles.bigNum}>
            {
              stats.drivers > 0
                ? (
                    completed /
                    stats.drivers
                  ).toFixed(1)
                : '—'
            }
          </div>

          <div className={styles.secondaryMeta}>
            across {stats.drivers} driver
            {stats.drivers !== 1 ? 's' : ''}
          </div>

        </div>

        <div className={styles.secondaryCard}>

          <div className={styles.secondaryLabel}>
            Rides / Student
          </div>

          <div className={styles.bigNum}>
            {
              stats.students > 0
                ? (
                    rides.length /
                    stats.students
                  ).toFixed(1)
                : '—'
            }
          </div>

          <div className={styles.secondaryMeta}>
            across {stats.students} student
            {stats.students !== 1 ? 's' : ''}
          </div>

        </div>

      </div>

      {/* Hot locations */}

      {
        topPickups.length > 0 && (

          <div className={styles.locGrid}>

            <div className={styles.locCard}>

              <div className={styles.locTitle}>
                <MapPin
                  size={13}
                  color="var(--accent)"
                />
                Top Pickup Points
              </div>

              {
                topPickups.map(([loc, count]) => (

                  <div
                    key={loc}
                    className={styles.locRow}
                  >

                    <span className={styles.locName}>
                      {prettyLocation(loc)}
                    </span>

                    <div className={styles.locBar}>

                      <div
                        className={styles.locFill}
                        style={{
                          width: `${
                            (count / maxCount) * 100
                          }%`
                        }}
                      />

                    </div>

                    <span className={styles.locCount}>
                      {count}
                    </span>

                  </div>
                ))
              }

            </div>

            <div className={styles.locCard}>

              <div className={styles.locTitle}>
                <MapPin
                  size={13}
                  color="#c0392b"
                />
                Top Drop Points
              </div>

              {
                topDrops.map(([loc, count]) => (

                  <div
                    key={loc}
                    className={styles.locRow}
                  >

                    <span className={styles.locName}>
                      {prettyLocation(loc)}
                    </span>

                    <div className={styles.locBar}>

                      <div
                        className={styles.locFill}
                        style={{
                          width: `${
                            (count / maxCount) * 100
                          }%`,
                          background: '#c0392b'
                        }}
                      />

                    </div>

                    <span className={styles.locCount}>
                      {count}
                    </span>

                  </div>
                ))
              }

            </div>

          </div>
        )
      }

      {/* Buttons */}

      <div className={styles.actionBtns}>

        <button
          className={styles.actionBtn}
          onClick={loadDrivers}
        >
          View All Drivers
        </button>

        <button
          className={styles.actionBtn}
          onClick={loadStudents}
        >
          View All Students
        </button>

      </div>

      {/* Drivers table */}

      {
        showDrivers && (

          <div className={styles.tableWrap}>

            <div className={styles.tableHeader}>

              <h2>All Drivers</h2>

              <span className={styles.count}>
                {drivers.length} total
              </span>

            </div>

            <div className={styles.tableScroll}>

              <table className={styles.table}>

                <thead>

                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Vehicle</th>
                  </tr>

                </thead>

                <tbody>

                  {
                    drivers.map((driver, i) => (

                      <tr key={i}>

                        <td>{driver.name}</td>

                        <td>{driver.username}</td>

                        <td>{driver.number}</td>

                        <td>{driver.vehicleNumber}</td>

                      </tr>
                    ))
                  }

                </tbody>

              </table>

            </div>

          </div>
        )
      }

      {/* Students table */}

      {
        showStudents && (

          <div className={styles.tableWrap}>

            <div className={styles.tableHeader}>

              <h2>All Students</h2>

              <span className={styles.count}>
                {students.length} total
              </span>

            </div>

            <div className={styles.tableScroll}>

              <table className={styles.table}>

                <thead>

                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Roll Number</th>
                  </tr>

                </thead>

                <tbody>

                  {
                    students.map((student, i) => (

                      <tr key={i}>

                        <td>{student.name}</td>

                        <td>{student.username}</td>

                        <td>{student.number}</td>

                        <td>{student.rollNumber}</td>

                      </tr>
                    ))
                  }

                </tbody>

              </table>

            </div>

          </div>
        )
      }

      {/* Rides table */}

      <div className={styles.tableWrap}>

        <div className={styles.tableHeader}>

          <h2>All Rides</h2>

          <span className={styles.count}>
            {rides.length} total · ₹{revenue} revenue
          </span>

        </div>

        {
          loading ? (

            <div className={styles.loadingState}>
              Loading…
            </div>

          ) : rides.length === 0 ? (

            <div className={styles.empty}>
              No rides recorded yet
            </div>

          ) : (

            <div className={styles.tableScroll}>

              <table className={styles.table}>

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Status</th>
                    <th>Fare</th>
                  </tr>

                </thead>

                <tbody>

                  {
                    rides.map((ride, i) => (

                      <tr key={ride.id}>

                        <td className={styles.mono}>
                          {rides.length - i}
                        </td>

                        <td>
                          {prettyLocation(ride.pickUp)}
                        </td>

                        <td>
                          {prettyLocation(ride.drop)}
                        </td>

                        <td>

                          <span
                            className={`${styles.pill} ${
                              ride.driverId
                                ? styles.pillDone
                                : styles.pillPending
                            }`}
                          >

                            {
                              ride.driverId
                                ? '✓ Accepted'
                                : '⏳ Pending'
                            }

                          </span>

                        </td>

                        <td className={styles.fare}>
                          ₹10
                        </td>

                      </tr>
                    ))
                  }

                </tbody>

              </table>

            </div>
          )
        }

      </div>

    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg
}) {

  return (

    <div className={styles.statCard}>

      <div
        className={styles.statIcon}
        style={{
          color,
          background: bg
        }}
      >
        {icon}
      </div>

      <div className={styles.statValue}>
        {value}
      </div>

      <div className={styles.statLabel}>
        {label}
      </div>

    </div>
  )
}