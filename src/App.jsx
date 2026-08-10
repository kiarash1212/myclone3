import { useState } from 'react'
import CategorySelect from './components/CategorySelect.jsx'
import ScoreBoard from './components/ScoreBoard.jsx'
import QuestionCard from './components/QuestionCard.jsx'
import QuizResult from './components/QuizResult.jsx'
import History from './components/History.jsx'
import { fetchQuestions } from './trivia.js'
import { useLocalStorage } from './useLocalStorage.js'

const VIEWS = {
  SETUP: 'setup',
  QUIZ: 'quiz',
  RESULT: 'result',
  HISTORY: 'history',
}

export default function App() {
  const [view, setView] = useState(VIEWS.SETUP)
  const [questions, setQuestions] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answerLog, setAnswerLog] = useState([])
  const [score, setScore] = useState(0)
  const [lastResult, setLastResult] = useState(null)
  const [history, setHistory] = useLocalStorage('trivia-quiz-history', [])

  async function handleStart(categoryId) {
    const fetched = await fetchQuestions(categoryId)
    setQuestions(fetched)
    setCategoryName(fetched[0]?.category ?? 'Any category')
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswerLog([])
    setScore(0)
    setView(VIEWS.QUIZ)
  }

  function handleSelectAnswer(answer) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answer)
    const isCorrect = answer === questions[currentIndex].correctAnswer
    if (isCorrect) setScore((prev) => prev + 1)
    setAnswerLog((prev) => [...prev, isCorrect])
  }

  function handleNext() {
    const isLastQuestion = currentIndex === questions.length - 1
    if (isLastQuestion) {
      const result = {
        score,
        total: questions.length,
        category: categoryName,
        date: new Date().toISOString(),
      }
      setHistory((prev) => [...prev, result])
      setLastResult(result)


      setView(VIEWS.RESULT)
      return
    }
    setCurrentIndex((prev) => prev + 1)
    setSelectedAnswer(null)
  }

  function handlePlayAgain() {
    setQuestions([])
    setView(VIEWS.SETUP)
  }

  function handleClearHistory() {
    setHistory([])
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        
        {view !== VIEWS.QUIZ && (
          <nav className="app-nav">
            <button
              type="button"
              className="nav-link"
              onClick={() => setView(VIEWS.SETUP)}
              disabled={view === VIEWS.SETUP}
            >
              New quiz
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => setView(VIEWS.HISTORY)}
              disabled={view === VIEWS.HISTORY}
            >
              History
            </button>
          </nav>
        )}
      </header>

      <main className="app-main">
        {view === VIEWS.SETUP && <CategorySelect onStart={handleStart} />}

        {view === VIEWS.QUIZ && questions.length > 0 && (
          <div className="quiz-layout">
            <ScoreBoard total={questions.length} currentIndex={currentIndex}
              results={answerLog}
              score={score}
              category={categoryName}
            />
            <QuestionCard
              question={questions[currentIndex]}
              index={currentIndex}

              total={questions.length}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              onNext={handleNext}
              isLastQuestion={currentIndex === questions.length - 1}
            />
          </div>
        )}

        {view === VIEWS.RESULT && lastResult && (
          <QuizResult
            result={lastResult}
            onPlayAgain={handlePlayAgain}
            onViewHistory={() => setView(VIEWS.HISTORY)}
          />
        )}

        {view === VIEWS.HISTORY && (
          <History
            history={history}
            onBack={() => setView(lastResult ? VIEWS.RESULT : VIEWS.SETUP)}
            onClear={handleClearHistory}
          />
        )}
      </main>
    </div>
  )
}
