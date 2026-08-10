export default function QuestionCard({
  question,
  index,
  total,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  isLastQuestion,
}) {
  const hasAnswered = selectedAnswer !== null

  function answerState(answer) {
    if (!hasAnswered) return 'idle'
    if (answer === question.correctAnswer) return 'correct'
    if (answer === selectedAnswer) return 'incorrect'
    return 'muted'
  }

  return (
    <div className="panel question-panel">
      <div className="question-meta">
        <span className="eyebrow">
          Question {index + 1} of {total}
        </span>
        <span className="difficulty-tag">{question.difficulty}</span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="answer-grid">
        {question.answers.map((answer) => (
          <button
            key={answer}
            type="button"
            className={`answer-btn answer-${answerState(answer)}`}
            onClick={() => !hasAnswered && onSelectAnswer(answer)}
            disabled={hasAnswered}
          >
            {answer}
          </button>
        ))}
      </div>

      {hasAnswered && (
        <div className="feedback-row">
          <p className={`feedback-text ${selectedAnswer === question.correctAnswer ? 'feedback-correct' : 'feedback-incorrect'}`}>
            {selectedAnswer === question.correctAnswer
              ? 'Correct!'
              : `Not quite. The answer was "${question.correctAnswer}".`}
          </p>
          <button type="button" className="btn btn-primary" onClick={onNext}>
            {isLastQuestion ? 'See results' : 'Next question'}
          </button>
        </div>
      )}
    </div>
  )
}
