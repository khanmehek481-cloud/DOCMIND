
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import DocumentUpload from '../components/DocumentUpload'
import DocumentSearch from '../components/DocumentSearch'

const API = 'http://127.0.0.1:8000'

function Dashboard() {
  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryFilename, setSummaryFilename] = useState('')
  const [history, setHistory] = useState([])
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('docmind_dark_mode') === 'true'
  )

  const user = JSON.parse(
    localStorage.getItem('docmind_user') || '{}'
  )

  // Load documents from backend
  async function loadDocuments() {
    try {
      setLoading(true)

      const response = await fetch(`${API}/documents`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load documents.')
      }

      const files = Array.isArray(data)
        ? data
        : data.documents || data.files || []

      setDocuments(files)
      setMessage('')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load search history
  function loadHistory() {
    try {
      const savedHistory = JSON.parse(
        localStorage.getItem('docmind_search_history') || '[]'
      )
      setHistory(savedHistory)
    } catch {
      setHistory([])
    }
  }

  // Load data and listen for upload/search updates
  useEffect(() => {
    loadDocuments()
    loadHistory()

    const updateHistory = () => loadHistory()
    const updateDocuments = () => loadDocuments()

    window.addEventListener('docmind:history', updateHistory)
    window.addEventListener('docmind:documents', updateDocuments)

    return () => {
      window.removeEventListener('docmind:history', updateHistory)
      window.removeEventListener('docmind:documents', updateDocuments)
    }
  }, [])

  // Save dark mode setting
  useEffect(() => {
    localStorage.setItem('docmind_dark_mode', String(darkMode))
  }, [darkMode])

  // Navigate to dashboard sections
  function goToSection(id) {
    const section = document.getElementById(id)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // View document
  function viewDocument(filename) {
    const url = `${API}/documents/${encodeURIComponent(filename)}/view`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Delete document
  async function deleteDocument(filename) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `${API}/documents/${encodeURIComponent(filename)}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Could not delete document.')
      }

      setMessage('Document deleted successfully.')
      loadDocuments()
    } catch (error) {
      setMessage(error.message)
    }
  }

  // Summarize document
  async function summarizeDocument(filename) {
    setSummaryLoading(true)
    setSummaryFilename(filename)
    setSummary('')

    try {
      const response = await fetch(
        `${API}/summarize?filename=${encodeURIComponent(filename)}`,
        { method: 'POST' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Summary generation failed.')
      }

      setSummary(data.summary || 'No summary available.')
    } catch (error) {
      setSummary(`Error: ${error.message}`)
    } finally {
      setSummaryLoading(false)
    }
  }

  // Clear search history
  function clearHistory() {
    const confirmed = window.confirm(
      'Are you sure you want to clear search history?'
    )

    if (!confirmed) return

    localStorage.removeItem('docmind_search_history')
    setHistory([])
  }

  // Logout
  function logout() {
    localStorage.removeItem('docmind_user')
    navigate('/login')
  }

  return (
    <div className={`dashboard ${darkMode ? 'dark-dashboard' : ''}`}>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <h2>DOCMIND</h2>
        </div>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="sidebar-nav">
          <button onClick={() => goToSection('dashboard')}>
            <span>⌂</span> Dashboard
          </button>

          <button onClick={() => goToSection('documents')}>
            <span>▤</span> My Documents
          </button>

          <button onClick={() => goToSection('search')}>
            <span>⌕</span> Smart Search
          </button>

          <button onClick={() => goToSection('history')}>
            <span>◷</span> Search History
          </button>

          <button onClick={() => goToSection('settings')}>
            <span>⚙</span> Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-button" onClick={logout}>
            <span>⇥</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">

        {/* Topbar */}
        <header className="topbar">
          <div>
            <p className="topbar-subtitle">WORKSPACE</p>
            <h2>Dashboard</h2>
          </div>

          <div className="profile-area">
            <div className="profile-avatar">
              {(user.name || user.username || 'U')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{user.name || user.username || 'User'}</strong>
              <p>Welcome back!</p>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section" id="dashboard">
          <div>
            <p className="welcome-tag">YOUR DOCUMENT WORKSPACE</p>
            <h1>Welcome back, {user.name || 'there'}!</h1>
            <p>
              Organize, search and understand your documents
              with DOCMIND.
            </p>

            <button
              className="welcome-button"
              onClick={() => goToSection('upload')}
            >
              + Upload Documents
            </button>
          </div>

          <div className="welcome-art">
            <div className="art-circle"></div>
            <div className="art-folder">📁</div>
            <div className="art-search">⌕</div>
            <div className="art-star">✦</div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="feature-grid">
          <div className="feature-card purple-card">
            <div className="feature-icon">▤</div>
            <div className="feature-info">
              <h3>My Documents</h3>
              <p>Manage all your files</p>
            </div>
            <button onClick={() => goToSection('documents')}>
              Explore →
            </button>
          </div>

          <div className="feature-card pink-card">
            <div className="feature-icon">⌕</div>
            <div className="feature-info">
              <h3>Smart Search</h3>
              <p>Find information quickly</p>
            </div>
            <button onClick={() => goToSection('search')}>
              Search →
            </button>
          </div>

          <div className="feature-card blue-card">
            <div className="feature-icon">◷</div>
            <div className="feature-info">
              <h3>Search History</h3>
              <p>See your recent searches</p>
            </div>
            <button onClick={() => goToSection('history')}>
              View →
            </button>
          </div>
        </section>

        {/* Documents */}
        <section className="documents-panel" id="documents">
          <div className="panel-heading">
            <div>
              <h2>My Documents</h2>
              <p>Your uploaded files</p>
            </div>

            <button
              className="refresh-button"
              onClick={loadDocuments}
              disabled={loading}
            >
              {loading ? 'Loading...' : '↻ Refresh'}
            </button>
          </div>

          {message && (
            <p className="dashboard-message">{message}</p>
          )}

          {loading ? (
            <p className="empty-message">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="empty-message">
              No documents uploaded yet. Upload your first document below.
            </p>
          ) : (
            <div className="document-grid">
              {documents.map((doc, index) => {
                const filename =
                  typeof doc === 'string'
                    ? doc
                    : doc.filename || doc.name

                if (!filename) return null

                const extension = filename
                  .split('.')
                  .pop()
                  .toLowerCase()

                return (
                  <div className="document-card" key={`${filename}-${index}`}>
                    <div className={`file-icon ${extension}`}>
                      {extension === 'pdf'
                        ? 'PDF'
                        : extension.toUpperCase()}
                    </div>

                    <h3 title={filename}>{filename}</h3>

                    <div className="document-actions">
                      <button
                        className="view-button"
                        onClick={() => viewDocument(filename)}
                      >
                        View
                      </button>

                      <button
                        className="summarize-button"
                        onClick={() => summarizeDocument(filename)}
                      >
                        Summarize
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteDocument(filename)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Summary */}
        {summaryFilename && (
          <section className="summary-panel">
            <div className="panel-heading">
              <div>
                <h2>Document Summary</h2>
                <p>{summaryFilename}</p>
              </div>

              <button
                className="refresh-button"
                onClick={() => {
                  setSummaryFilename('')
                  setSummary('')
                }}
              >
                Close
              </button>
            </div>

            {summaryLoading ? (
              <p>Generating summary...</p>
            ) : (
              <p>{summary}</p>
            )}
          </section>
        )}

        {/* Upload and Search */}
        <section className="workspace-grid">
          <div className="workspace-panel" id="upload">
            <DocumentUpload />
          </div>

          <div className="workspace-panel" id="search">
            <DocumentSearch />
          </div>
        </section>

        {/* Search History */}
        <section className="documents-panel history-panel" id="history">
          <div className="panel-heading">
            <div>
              <h2>Search History</h2>
              <p>Your recent keyword searches</p>
            </div>

            <button
              className="clear-history-button"
              onClick={clearHistory}
            >
              Clear History
            </button>
          </div>

          {history.length === 0 ? (
            <p className="empty-message">
              No search history available.
            </p>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div className="history-item" key={`${item.keyword}-${index}`}>
                  <div>
                    <strong>⌕ {item.keyword}</strong>
                    <p>{item.date}</p>
                  </div>

                  <span>
                    {item.count} result(s)
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Settings */}
        <section className="documents-panel settings-panel" id="settings">
          <div className="panel-heading">
            <div>
              <h2>Settings</h2>
              <p>Customize your DOCMIND workspace</p>
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Dark Mode</strong>
              <p>Switch between light and dark appearance</p>
            </div>

            <label className="dark-mode-toggle">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span>{darkMode ? 'On' : 'Off'}</span>
            </label>
          </div>

          <div className="setting-row">
            <div>
              <strong>Account</strong>
              <p>Sign out of your DOCMIND workspace</p>
            </div>

            <button className="delete-button" onClick={logout}>
              Logout
            </button>
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>© 2026 DOCMIND. Smart Document Management.</p>
        </footer>

      </main>
    </div>
  )
}

export default Dashboard
