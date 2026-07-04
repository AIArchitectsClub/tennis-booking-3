function CourtList({ courts, onSelect }) {
  return (
    <div className="court-grid">
      {courts.map((court) => (
        <button key={court.id} className="court-card" onClick={() => onSelect(court.id)}>
          <h3>{court.name}</h3>
          <p className="court-meta">{court.location}</p>
          <div className="court-tags">
            <span className="tag">{court.surface}</span>
            <span className="tag">{court.indoor ? 'Indoor' : 'Outdoor'}</span>
            <span className="tag">{court.courtCount} courts</span>
          </div>
          <p className="court-price">${court.pricePerHour}/hr</p>
        </button>
      ))}
    </div>
  )
}

export default CourtList
