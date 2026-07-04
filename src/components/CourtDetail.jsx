import { useState } from 'react'
import { generateTimeSlots, formatTimeLabel, formatDateLabel, todayISO } from '../utils/slots'

function CourtDetail({ court, bookedSlots, onBook, onBack }) {
  const [date, setDate] = useState(todayISO())
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  const slots = generateTimeSlots(court.openHour, court.closeHour)
  const bookedTimes = new Set(
    bookedSlots.filter((b) => b.courtId === court.id && b.date === date).map((b) => b.time),
  )

  const handleDateChange = (event) => {
    setDate(event.target.value)
    setSelectedSlot(null)
    setBookingError(null)
  }

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setBookingError(null)
  }

  const handleConfirm = async () => {
    if (!selectedSlot) return

    setSubmitting(true)
    setBookingError(null)
    try {
      await onBook({ courtId: court.id, date, time: selectedSlot })
      setSelectedSlot(null)
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="court-detail">
      <button className="back-link" onClick={onBack}>
        &larr; Back to courts
      </button>

      <h2>{court.name}</h2>
      <p className="court-meta">
        {court.location} · {court.surface} · {court.indoor ? 'Indoor' : 'Outdoor'} · ${court.pricePerHour}/hr
      </p>

      <label className="date-picker">
        Date
        <input type="date" value={date} min={todayISO()} onChange={handleDateChange} />
        <span className="date-label">{formatDateLabel(date)}</span>
      </label>

      <div className="slot-grid">
        {slots.map((slot) => {
          const isBooked = bookedTimes.has(slot)
          const isSelected = selectedSlot === slot
          return (
            <button
              key={slot}
              disabled={isBooked}
              className={`slot${isBooked ? ' booked' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => handleSelectSlot(slot)}
            >
              {formatTimeLabel(slot)}
              {isBooked && <span className="slot-status">Booked</span>}
            </button>
          )
        })}
      </div>

      {selectedSlot && (
        <div className="booking-panel">
          <p>
            Booking <strong>{formatTimeLabel(selectedSlot)}</strong> on <strong>{formatDateLabel(date)}</strong>
          </p>
          {bookingError && <p className="error-banner">{bookingError}</p>}
          <div className="booking-actions">
            <button className="primary" onClick={handleConfirm} disabled={submitting}>
              {submitting ? 'Booking...' : 'Confirm booking'}
            </button>
            <button onClick={() => setSelectedSlot(null)} disabled={submitting}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourtDetail
