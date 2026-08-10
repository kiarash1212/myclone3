export default function QuizResult({ result, onPlayAgain, onViewHistory }) {
  const percent = Math.round((result.score / result.total) * 100)

  return (
    <div className="panel result-panel">
      <p className="eyebrow">Final tally</p>
      <h1 className="display-title">
        {result.score} / {result.total}
      </h1>
      <p className="result-percent">{percent}% correct</p>

      <dl className="result-meta">
        <div className="result-meta-row">
          <dt>Category</dt>
          <dd>{result.category}</dd>
        </div>
        <div className="result-meta-row">
          <dt>Completed</dt>
          <dd>{new Date(result.date).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
          Play again
        </button>
        <button type="button" className="btn btn-ghost" onClick={onViewHistory}>
          View history
        </button>
      </div>
    </div>
  )
}
