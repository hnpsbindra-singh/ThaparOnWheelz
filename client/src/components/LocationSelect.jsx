import { LOCATIONS, prettyLocation } from '../api/locations'
import styles from './LocationSelect.module.css'

export default function LocationSelect({ label, value, onChange, exclude }) {
  const filtered = LOCATIONS.filter(l => l !== exclude)
  return (
    <div className={styles.wrap}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">— Select location —</option>
        {filtered.map(loc => (
          <option key={loc} value={loc}>{prettyLocation(loc)}</option>
        ))}
      </select>
    </div>
  )
}
