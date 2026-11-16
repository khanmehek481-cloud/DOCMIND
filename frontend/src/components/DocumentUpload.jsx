
import { useState } from 'react'
import './DocumentUpload.css'

function DocumentUpload() {
  const [files, setFiles] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFileChange(event) {
    setFiles(Array.from(event.target.files))
    setMessage('')
  }

  async function handleUpload() {
    if (files.length === 0) {
      setMessage('Please select a document first.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(
          'http://127.0.0.1:8000/upload',
          {
            method: 'POST',
            body: formData
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Upload failed.')
        }
      }

      setMessage('All documents uploaded successfully!')
      setFiles([])
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-section">
      <h2>Upload Documents</h2>
      <p>Select PDF, TXT or DOCX documents.</p>

      <input
        type="file"
        multiple
        accept=".pdf,.txt,.docx"
        onChange={handleFileChange}
      />

      {files.map((file, index) => (
        <p key={index}>{file.name}</p>
      ))}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Documents'}
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}

export default DocumentUpload
