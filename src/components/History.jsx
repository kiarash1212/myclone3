export default function History({ history, onBack, onClear }) {
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="panel history-panel">
      <div className="history-header">
        <div>
          <p className="eyebrow">Past rounds</p>
          <h1 className="display-title">Quiz history</h1>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          Back
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="empty-state">
          No rounds played yet. Finish a quiz and it will show up here.
        </p>
      ) : (
        <>
          <ul className="history-list">
            {sorted.map((entry, index) => (
              <li key={`${entry.date}-${index}`} className="history-item">
                <div className="history-item-main">
                  <span className="history-category">{entry.category}</span>
                  <span className="history-date">
                    {new Date(entry.date).toLocaleString()}
                  </span>
                </div>
                <span className="history-score">
                  {entry.score}/{entry.total}
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-danger" onClick={onClear}>
            Clear history
          </button>
        </>
      )}
    </div>
  )
}
