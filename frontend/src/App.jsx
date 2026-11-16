
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('docmind_user')
  return user ? children : <Navigate to="/login" replace />
}

function Home() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="logo">DOCMIND<span>.</span></Link>

        <nav>
          <a href="#features">Features</a>
          <Link to="/login" className="login-btn">Sign In</Link>
          <Link to="/signup" className="signup-btn">Get Started</Link>
        </nav>
      </header>

      <main className="hero">
        <section className="hero-content">
          <p className="eyebrow">✦ YOUR INTELLIGENT DOCUMENT WORKSPACE</p>

          <h1>
            Your documents.<br />
            <span>Your knowledge.</span><br />
            One workspace.
          </h1>

          <p className="description">
            Upload, organize and search your documents effortlessly.
            Find the information you need without wasting time.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="primary-btn">
              Get Started →
            </Link>
            <a href="#features" className="secondary-btn">
              Explore Features
            </a>
          </div>

          <div className="hero-note">
            ✧ Simple. Smart. Organized.
          </div>
        </section>

        <section className="preview-card">
          <div className="preview-header">
            <div>
              <span className="preview-label">DOCMIND WORKSPACE</span>
              <h3>Document Overview</h3>
            </div>
            <span className="status">● ACTIVE</span>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <span>Search your documents...</span>
          </div>

          {[
            ['PDF', 'Research Document', 'PDF document'],
            ['TXT', 'Project Notes', 'Text document'],
            ['DOC', 'Study Materials', 'Word document']
          ].map((item, i) => (
            <div className="document" key={item[1]}>
              <div className={`document-icon icon-${i}`}>
                {item[0]}
              </div>
              <div>
                <h4>{item[1]}</h4>
                <p>{item[2]}</p>
              </div>
              <span className="document-arrow">›</span>
            </div>
          ))}

          <div className="preview-footer">
            ✨ Everything you need, in one place.
          </div>
        </section>
      </main>

      <section className="features" id="features">
        <p className="eyebrow">✦ MADE FOR PRODUCTIVITY</p>
        <h2>Everything connected.<br />Everything searchable.</h2>

        <div className="feature-grid">
          <div className="feature-item">
            <span>📁</span>
            <h3>Document Management</h3>
            <p>Upload and organize all your important documents.</p>
          </div>

          <div className="feature-item">
            <span>🔍</span>
            <h3>Smart Search</h3>
            <p>Find information quickly using keyword search.</p>
          </div>

          <div className="feature-item">
            <span>✨</span>
            <h3>Easy Access</h3>
            <p>View, manage and access your documents in one place.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <h2>DOCMIND<span>.</span></h2>
        <p>Your intelligent document workspace.</p>
        <p>© 2026 DOCMIND. All rights reserved.</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
