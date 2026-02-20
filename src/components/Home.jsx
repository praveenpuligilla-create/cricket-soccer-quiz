import { useState } from 'react'
import './Home.css'

const SPORTS = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏', desc: 'Test your cricket knowledge' },
  { id: 'soccer', label: 'Soccer', emoji: '⚽', desc: 'Test your soccer knowledge' },
]

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', color: '#4ade80', desc: 'Beginner-friendly questions' },
  { id: 'medium', label: 'Medium', color: '#facc15', desc: 'Intermediate questions' },
  { id: 'hard', label: 'Hard', color: '#f87171', desc: 'Challenging questions' },
]

export default function Home({ onStart, onSportPreview }) {
  const [selectedSport, setSelectedSport] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)

  const canStart = selectedSport && selectedDifficulty

  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId)
    onSportPreview?.(sportId)
  }

  return (
    <div className="home">
      <div className="home-header">
        <div className="home-icons">🏏 ⚽</div>
        <h1 className="home-title">Sports Quiz</h1>
        <p className="home-subtitle">Cricket & Soccer Trivia Challenge</p>
      </div>

      <div className="home-card">
        <section className="section">
          <h2 className="section-title">Choose Your Sport</h2>
          <div className="sport-grid">
            {SPORTS.map(sport => (
              <button
                key={sport.id}
                className={`sport-btn ${selectedSport === sport.id ? 'selected' : ''}`}
                onClick={() => handleSportSelect(sport.id)}
              >
                <span className="sport-emoji">{sport.emoji}</span>
                <span className="sport-label">{sport.label}</span>
                <span className="sport-desc">{sport.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Choose Difficulty</h2>
          <div className="diff-list">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff.id}
                className={`diff-btn ${selectedDifficulty === diff.id ? 'selected' : ''}`}
                style={{ '--diff-color': diff.color }}
                onClick={() => setSelectedDifficulty(diff.id)}
              >
                <span className="diff-label" style={{ color: diff.color }}>{diff.label}</span>
                <span className="diff-desc">{diff.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <button
          className={`start-btn ${canStart ? 'active' : 'disabled'}`}
          onClick={() => canStart && onStart(selectedSport, selectedDifficulty)}
          disabled={!canStart}
        >
          Start Quiz!
        </button>
      </div>

      <p className="home-footer">20 questions per round • Timer • Streak multiplier • Lives</p>
    </div>
  )
}
