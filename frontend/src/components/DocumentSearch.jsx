
import { useState } from 'react'

const API = 'http://127.0.0.1:8000'

function DocumentSearch() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [summaries, setSummaries] = useState({})
  const [summarizing, setSummarizing] = useState('')

  async function handleSearch() {
    const searchTerm = keyword.trim()

    if (!searchTerm) {
      setMessage('Please enter a keyword.')
      setResults([])
      return
    }

    setLoading(true)
    setMessage('')
    setSummaries({})

    try {
      const response = await fetch(
        `${API}/search?keyword=${encodeURIComponent(searchTerm)}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Search failed.')
      }

      const foundResults = data.results || []
      setResults(foundResults)

      const total = data.total_results ?? foundResults.length

      setMessage(
        total > 0
          ? `${total} matching document(s) found.`
          : 'No matching documents found.'
      )

      // Save search history
      const oldHistory = JSON.parse(
        localStorage.getItem('docmind_search_history') || '[]'
      )

      const newHistory = [
        {
          keyword: searchTerm,
          count: total,
          date: new Date().toLocaleString()
        },
        ...oldHistory
      ].slice(0, 30)

      localStorage.setItem(
        'docmind_search_history',
        JSON.stringify(newHistory)
      )

      // Notify dashboard
      window.dispatchEvent(new Event('docmind:history'))

    } catch (error) {
      setMessage(error.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSummarize(filename) {
    setSummarizing(filename)

    try {
      const response = await fetch(
        `${API}/summarize?filename=${encodeURIComponent(filename)}`,
        { method: 'POST' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Summary generation failed.')
      }

      setSummaries(previous => ({
        ...previous,
        [filename]: data.summary
      }))

    } catch (error) {
      setSummaries(previous => ({
        ...previous,
        [filename]: `Error: ${error.message}`
      }))
    } finally {
      setSummarizing('')
    }
  }

  return (
    <div className="search-section">
      <h2>✦ Smart Document Search</h2>

      <p>Search for keywords across your uploaded documents.</p>

      <div className="search-input-row">
        <input
          type="text"
          placeholder="Enter a keyword..."
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleSearch()
            }
          }}
        />

        <button
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Searching...' : '⌕ Search'}
        </button>
      </div>

      {message && (
        <p className="search-message">
          {message}
        </p>
      )}

      <div className="search-results">
        {results.map(result => (
          <div
            className="search-result-card"
            key={result.filename}
          >
            <h3>📄 {result.filename}</h3>

            <button
              onClick={() => handleSummarize(result.filename)}
              disabled={summarizing !== ''}
            >
              {summarizing === result.filename
                ? 'Generating Summary...'
                : '✦ AI Summarize'}
            </button>

            {summaries[result.filename] && (
              <div className="summary-result">
                <h4>Document Summary</h4>
                <p>{summaries[result.filename]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocumentSearch
