import { pathToFileURL } from 'node:url'
import { pool } from './pool.js'
import { migrate } from './migrate.js'

const courts = [
  {
    id: 'riverside-park',
    name: 'Riverside Park Courts',
    location: '123 Riverside Dr',
    surface: 'Hard',
    indoor: false,
    courtCount: 4,
    pricePerHour: 12,
    openHour: 7,
    closeHour: 21,
  },
  {
    id: 'oakwood-tennis-club',
    name: 'Oakwood Tennis Club',
    location: '45 Oakwood Ave',
    surface: 'Clay',
    indoor: false,
    courtCount: 6,
    pricePerHour: 18,
    openHour: 6,
    closeHour: 22,
  },
  {
    id: 'downtown-sports-centre',
    name: 'Downtown Sports Centre',
    location: '900 Main St',
    surface: 'Hard',
    indoor: true,
    courtCount: 3,
    pricePerHour: 24,
    openHour: 8,
    closeHour: 23,
  },
  {
    id: 'greenfield-recreation',
    name: 'Greenfield Recreation Ground',
    location: '12 Greenfield Rd',
    surface: 'Grass',
    indoor: false,
    courtCount: 2,
    pricePerHour: 15,
    openHour: 8,
    closeHour: 20,
  },
  {
    id: 'westside-indoor-arena',
    name: 'Westside Indoor Arena',
    location: '78 Westside Blvd',
    surface: 'Hard',
    indoor: true,
    courtCount: 5,
    pricePerHour: 22,
    openHour: 7,
    closeHour: 22,
  },
]

export async function seed() {
  await migrate()
  for (const court of courts) {
    await pool.query(
      `INSERT INTO courts (id, name, location, surface, indoor, court_count, price_per_hour, open_hour, close_hour)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [
        court.id,
        court.name,
        court.location,
        court.surface,
        court.indoor,
        court.courtCount,
        court.pricePerHour,
        court.openHour,
        court.closeHour,
      ],
    )
  }
}

const isMain = import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  seed()
    .then(() => {
      console.log('Seed complete')
      return pool.end()
    })
    .catch((err) => {
      console.error('Seed failed', err)
      process.exit(1)
    })
}
