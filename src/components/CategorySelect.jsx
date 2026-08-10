import { useEffect, useState } from 'react'
import { fetchCategories } from '../trivia.js'

export default function CategorySelect({ onStart }) {
  const [categories, setCategories] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoadingCategories(true)
    fetchCategories()
      .then((list) => {
        if (!isMounted) return
        setCategories(list)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.message)
      })
      .finally(() => {
        if (!isMounted) return
        setLoadingCategories(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  async function handleStart(event) {
    event.preventDefault()
    setStarting(true)
    setError(null)
    try {
      await onStart(selectedId || null)
    } catch (err) {
      setError(err.message)
      setStarting(false)
    }
  }

  return (
    <div className="panel category-panel">
      <h1 className="display-title">Select your category</h1>

      <form className="category-form" onSubmit={handleStart}>
        <label className="field-label" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          className="select-input"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          disabled={loadingCategories || starting}
        >
          <option value="">Any category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loadingCategories || starting}>
          {starting ? 'Warming up the lights…' : 'Start quiz'}
        </button>
      </form>
    </div>
  )
}
