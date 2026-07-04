const BASE_URL = '/api'

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const getCourts = () => request('/courts')

export const getBookings = () => request('/bookings')

export const getMyBookings = () => request('/bookings/mine')

export const createBooking = (booking) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(booking) })

export const cancelBooking = (id) => request(`/bookings/${id}`, { method: 'DELETE' })
