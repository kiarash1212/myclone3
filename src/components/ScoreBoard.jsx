export default function ScoreBoard({ total, currentIndex, results, score, category }) {
  const paddedScore = String(score).padStart(3, '0')

  return (
    <div className="scoreboard">
      <div className="scoreboard-top">
        <span className="eyebrow scoreboard-category">{category || 'Trivia marquee'}</span>
        <div className="scoreboard-score">
          <span className="scoreboard-score-label">Score</span>
          <span className="scoreboard-score-digits">{paddedScore}</span>
        </div>
      </div>
      <div className="marquee-bulbs" role="list" aria-label={`Question ${currentIndex + 1} of ${total}`}>
        {Array.from({ length: total }, (_, index) => {
          let state = 'pending'
          if (index < results.length) {
            state = results[index] ? 'correct' : 'incorrect'
          } else if (index === currentIndex) {
            state = 'active'
          }
          return <span key={index} className={`bulb bulb-${state}`} role="listitem" />
        })}
      </div>
    </div>
  )
}
