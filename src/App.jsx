import { useState } from 'react'
import PersonalDetailsForm from './components/PersonalDetailsForm'
import SavedRecords from './components/SavedRecords'

function App() {
  const [activeTab, setActiveTab] = useState('form')

  return (
    <div className="app-container">
      <header className="header">
        <h1>Personal Details Hub</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Securely manage your personal and professional information.</p>
      </header>

      <div className="nav-tabs">
        <button 
          className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Submit Details
        </button>
        <button 
          className={`nav-btn ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          View Saved Records
        </button>
      </div>

      <main className="glass-card">
        {activeTab === 'form' ? <PersonalDetailsForm /> : <SavedRecords />}
      </main>
    </div>
  )
}

export default App
