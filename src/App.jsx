import { useEffect, useState } from 'react'
import { useSession, signOut } from './authClient'
import { getCourts, getBookings, getMyBookings, createBooking, cancelBooking } from './api'
import CourtList from './components/CourtList'
import CourtDetail from './components/CourtDetail'
import MyBookings from './components/MyBookings'
import AuthForm from './components/AuthForm'
import './App.css'

function App() {
  const { data: session, isPending: sessionLoading } = useSession()

  const [view, setView] = useState('courts')
  const [selectedCourtId, setSelectedCourtId] = useState(null)
  const [courts, setCourts] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return
    setLoading(true)
    Promise.all([getCourts(), getBookings(), getMyBookings()])
      .then(([courtsData, bookedData, mineData]) => {
        setCourts(courtsData)
        setBookedSlots(bookedData)
        setMyBookings(mineData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [session])

  const selectedCourt = courts.find((court) => court.id === selectedCourtId)

  const handleSelectCourt = (courtId) => setSelectedCourtId(courtId)

  const handleBook = async (booking) => {
    const created = await createBooking(booking)
    setMyBookings((prev) => [...prev, created])
    setBookedSlots((prev) => [
      ...prev,
      { id: created.id, courtId: created.courtId, date: created.date, time: created.time },
    ])
  }

  const handleCancel = async (id) => {
    await cancelBooking(id)
    setMyBookings((prev) => prev.filter((booking) => booking.id !== id))
    setBookedSlots((prev) => prev.filter((slot) => slot.id !== id))
  }

  const handleNavigate = (nextView) => {
    setView(nextView)
    setSelectedCourtId(null)
  }

  if (sessionLoading) {
    return <p className="empty-state">Loading...</p>
  }

  if (!session) {
    return <AuthForm />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎾 CourtSide</h1>
        <div className="header-right">
          <nav>
            <button className={view === 'courts' ? 'active' : ''} onClick={() => handleNavigate('courts')}>
              Courts
            </button>
            <button className={view === 'mybookings' ? 'active' : ''} onClick={() => handleNavigate('mybookings')}>
              My Bookings{myBookings.length ? ` (${myBookings.length})` : ''}
            </button>
          </nav>
          <div className="user-menu">
            <span>{session.user.name}</span>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && <p className="error-banner">{error}</p>}

        {loading ? (
          <p className="empty-state">Loading courts...</p>
        ) : (
          <>
            {view === 'courts' && !selectedCourt && <CourtList courts={courts} onSelect={handleSelectCourt} />}

            {view === 'courts' && selectedCourt && (
              <CourtDetail
                court={selectedCourt}
                bookedSlots={bookedSlots}
                onBook={handleBook}
                onBack={() => setSelectedCourtId(null)}
              />
            )}

            {view === 'mybookings' && <MyBookings bookings={myBookings} courts={courts} onCancel={handleCancel} />}
          </>
        )}
      </main>
    </div>
  )
}

export default App
