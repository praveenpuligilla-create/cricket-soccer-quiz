import './Results.css'

const SPORT_EMOJI = { cricket: '🏏', soccer: '⚽' }

function getAwardBadge(pct) {
  if (pct === 100) return { emoji: '🌟', label: 'Flawless',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.4)' }
  if (pct >= 80)  return { emoji: '🏆', label: 'Legend',    color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.4)' }
  if (pct >= 60)  return { emoji: '🥇', label: 'Expert',    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.4)' }
  if (pct >= 40)  return { emoji: '🥈', label: 'Supporter', color: '#facc15', bg: 'rgba(250,204,21,0.12)',  border: 'rgba(250,204,21,0.4)' }
  return           { emoji: '🎯', label: 'Rookie',    color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.4)' }
}

export default function Results({ score, total, points, lives, maxStreak, roundNum, sport, difficulty, onNextRound, onHome }) {
  const pct   = total > 0 ? Math.round((score / total) * 100) : 0
  const wrong = total - score
  const award = getAwardBadge(pct)

  const bonusBadges = []
  if (lives === 3) bonusBadges.push({ emoji: '💚', label: 'Untouchable' })
  if (maxStreak >= 5) bonusBadges.push({ emoji: '🔥', label: 'On Fire' })

  return (
    <div className="results">
      <div className="results-card">
        <div className="results-sport-icon">{SPORT_EMOJI[sport]}</div>

        <div className="round-label">Round {roundNum} Complete</div>

        {/* Points display */}
        <div className="points-display">
          <span className="points-number">{points.toLocaleString()}</span>
          <span className="points-unit">points</span>
        </div>

        {/* Score ring */}
        <div className="score-circle">
          <svg viewBox="0 0 120 120" className="score-ring">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={award.color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="score-inner">
            <span className="score-pct">{pct}%</span>
            <span className="score-fraction">{score}/{total}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat correct-stat">
            <span className="stat-num">{score}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat wrong-stat">
            <span className="stat-num">{wrong}</span>
            <span className="stat-label">Wrong</span>
          </div>
          <div className="stat info-stat">
            <span className="stat-num">{lives}</span>
            <span className="stat-label">Hearts left</span>
          </div>
          <div className="stat streak-stat">
            <span className="stat-num">{maxStreak}</span>
            <span className="stat-label">Best streak</span>
          </div>
        </div>

        {/* Award badge */}
        <div className="award-section">
          <div className="award-badge" style={{ background: award.bg, borderColor: award.border }}>
            <span className="award-emoji">{award.emoji}</span>
            <span className="award-label" style={{ color: award.color }}>{award.label}</span>
          </div>
          {bonusBadges.length > 0 && (
            <div className="bonus-badges">
              {bonusBadges.map(b => (
                <div key={b.label} className="bonus-badge">
                  <span>{b.emoji}</span>
                  <span className="bonus-label">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="results-actions">
        <button className="next-round-btn" onClick={onNextRound}>
          Next Round →
        </button>
        <button className="home-btn" onClick={onHome}>
          Change Settings 🏠
        </button>
      </div>
    </div>
  )
}
