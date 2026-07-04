import { useState } from 'react'
import { formatDateLabel, formatTimeLabel } from '../utils/slots'

function MyBookings({ bookings, courts, onCancel }) {
  const [cancellingId, setCancellingId] = useState(null)
  const [error, setError] = useState(null)

  const sorted = [...bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  if (!sorted.length) {
    return <p className="empty-state">You don't have any bookings yet. Pick a court to get started.</p>
  }

  const handleCancel = async (id) => {
    setCancellingId(id)
    setError(null)
    try {
      await onCancel(id)
    } catch (err) {
      setError(err.message)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <>
      {error && <p className="error-banner">{error}</p>}
      <ul className="booking-list">
        {sorted.map((booking) => {
          const court = courts.find((c) => c.id === booking.courtId)
          return (
            <li key={booking.id} className="booking-item">
              <div>
                <h3>{court ? court.name : 'Unknown court'}</h3>
                <p>
                  {formatDateLabel(booking.date)} at {formatTimeLabel(booking.time)} · {booking.playerName}
                </p>
              </div>
              <button className="danger" onClick={() => handleCancel(booking.id)} disabled={cancellingId === booking.id}>
                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default MyBookings
