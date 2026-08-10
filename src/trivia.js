const BASE_URL = 'https://opentdb.com'

/**
 * Decodes HTML entities returned by the Open Trivia Database
 * (e.g. "&quot;Metal Gear&quot;" -> "Metal Gear").
 */
export function decodeHtml(text) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

/** Fisher-Yates shuffle, returns a new array without mutating the input. */
export function shuffleArray(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Fetches the full list of trivia categories from the API. */
export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/api_category.php`)
  if (!response.ok) {
    throw new Error('Could not load categories. Please try again.')
  }
  const data = await response.json()
  return data.trivia_categories
}

/**
 * Fetches 10 multiple-choice questions for a given category id and
 * returns them decoded, with answers pre-shuffled and ready to render.
 */
export async function fetchQuestions(categoryId) {
  const url = new URL(`${BASE_URL}/api.php`)
  url.searchParams.set('amount', '10')
  url.searchParams.set('type', 'multiple')
  if (categoryId) url.searchParams.set('category', categoryId)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Could not load questions. Please try again.')
  }
  const data = await response.json()

  if (data.response_code !== 0 || !data.results?.length) {
    throw new Error(
      'Not enough questions were available for that category. Please pick another.',
    )
  }

  return data.results.map((item, index) => {
    const answers = shuffleArray([
      ...item.incorrect_answers.map((answer) => decodeHtml(answer)),
      decodeHtml(item.correct_answer),
    ])
    return {
      id: `${index}-${item.question}`,
      question: decodeHtml(item.question),
      category: decodeHtml(item.category),
      difficulty: item.difficulty,
      correctAnswer: decodeHtml(item.correct_answer),
      answers,
    }
  })
}
