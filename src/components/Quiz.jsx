import { useState, useEffect, useRef } from 'react'
import './Quiz.css'

const SPORT_EMOJI = { cricket: '🏏', soccer: '⚽' }

function getMultiplier(streak) {
  if (streak >= 5) return 3
  if (streak >= 3) return 2
  if (streak >= 2) return 1.5
  return 1
}

export default function Quiz({ sport, difficulty, roundNum, roundQuestions, onFinish, onBack }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [points, setPoints] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isTimeout, setIsTimeout] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [roundEnded, setRoundEnded] = useState(false)

  const [particles, setParticles] = useState([])

  const correctCountRef = useRef(0)
  const maxStreakRef = useRef(0)
  const lastEarnedRef = useRef(0)

  const question = roundQuestions[current]
  const total = roundQuestions.length
  const progress = (current / total) * 100

  // Timer countdown — resets on new question, stops when result is shown
  useEffect(() => {
    if (showResult) return
    setTimeLeft(15)
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [current, showResult])

  // Handle timeout when timeLeft hits 0 before an answer is selected
  useEffect(() => {
    if (timeLeft === 0 && !showResult) handleAnswer(null)
  }, [timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps

  const spawnParticles = (isCorrect) => {
    const pool = isCorrect
      ? ['😊', '🎉', '✨', '🌟', '👏', '💯', '🥳', '😄']
      : ['😢', '😞', '💔', '😰', '😬', '😭', '🙈']
    const count = isCorrect ? 7 : 5
    const next = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      x: 5 + Math.random() * 90,
      delay: Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 120,
    }))
    setParticles(prev => [...prev, ...next])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !next.some(n => n.id === p.id)))
    }, 2400)
  }

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2000)
  }

  const handleAnswer = (option) => {
    if (showResult) return

    const isCorrect = option !== null && option === question.answer
    const newStreak = isCorrect ? streak + 1 : 0
    const newLives = isCorrect ? lives : lives - 1
    let newPoints = points
    let earned = 0

    if (isCorrect) {
      const multiplier = getMultiplier(newStreak)
      const timeBonus = Math.floor(timeLeft / 15 * 50)
      earned = Math.round((100 + timeBonus) * multiplier)
      newPoints += earned
      correctCountRef.current += 1
    }
    if (newStreak > maxStreakRef.current) maxStreakRef.current = newStreak
    lastEarnedRef.current = earned

    spawnParticles(isCorrect)

    setSelected(option)
    setShowResult(true)
    setIsTimeout(option === null)
    setStreak(newStreak)
    setLives(newLives)
    setPoints(newPoints)

    if (newStreak === 3) showToast('On Fire! 🔥')
    else if (newStreak === 5) showToast('Unstoppable! ⚡')

    if (newLives === 0) {
      setRoundEnded(true)
      setTimeout(() => {
        onFinish(correctCountRef.current, total, newPoints, 0, maxStreakRef.current)
      }, 1500)
    }
  }

  const handleNext = () => {
    if (current + 1 >= total) {
      onFinish(correctCountRef.current, total, points, lives, maxStreakRef.current)
      return
    }
    setCurrent(c => c + 1)
    setSelected(null)
    setShowResult(false)
    setIsTimeout(false)
  }

  const getOptionClass = (option) => {
    if (!showResult) return 'option-btn'
    if (option === question.answer) return 'option-btn correct'
    if (option === selected && option !== question.answer) return 'option-btn incorrect'
    return 'option-btn dimmed'
  }

  return (
    <div className="quiz">

      {/* Floating emoji particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="emoji-particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {toastMsg && <div className="combo-toast">{toastMsg}</div>}

      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="quiz-meta">
          <span className="sport-tag">{SPORT_EMOJI[sport]} {sport.charAt(0).toUpperCase() + sport.slice(1)}</span>
          <span className="round-tag">Round {roundNum}</span>
        </div>
        <div className="hearts-row">
          {[0, 1, 2].map(i => (
            <span key={i} className={`heart ${i < lives ? 'heart-alive' : 'heart-lost'}`}>❤️</span>
          ))}
        </div>
      </div>

      <div className="score-streak-row">
        <div className="score-display">{points.toLocaleString()} pts</div>
        {streak >= 2 && (
          <div className={`streak-badge ${streak >= 5 ? 'streak-mega' : streak >= 3 ? 'streak-high' : ''}`}>
            {streak >= 5 ? '⚡' : '🔥'} ×{getMultiplier(streak)}
          </div>
        )}
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="question-timer-row">
        <div className="question-counter">
          Q <strong>{current + 1}</strong> / <strong>{total}</strong>
        </div>
        <div className="timer-wrap">
          <div className="timer-bar-bg">
            <div
              className={`timer-bar ${timeLeft <= 5 ? 'timer-urgent' : timeLeft <= 10 ? 'timer-warn' : ''}`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>
          <span className={`timer-label ${timeLeft <= 5 ? 'timer-label-urgent' : ''}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="quiz-card">
        <p className="question-text">{question.question}</p>
        <div className="options-grid">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className={getOptionClass(option)}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{option}</span>
              {showResult && option === question.answer && <span className="option-icon">✓</span>}
              {showResult && option === selected && option !== question.answer && <span className="option-icon">✗</span>}
            </button>
          ))}
        </div>
        {showResult && (
          <div className={`feedback ${selected === question.answer ? 'feedback-correct' : 'feedback-incorrect'}`}>
            {selected === question.answer
              ? `🎉 Correct! +${lastEarnedRef.current} pts`
              : isTimeout
                ? `⏰ Time's Up! Answer: "${question.answer}"`
                : `❌ Wrong! Answer: "${question.answer}"`}
          </div>
        )}
      </div>

      {showResult && !roundEnded && (
        <button className="next-btn" onClick={handleNext}>
          {current + 1 >= total ? 'See Results 🏆' : 'Next Question →'}
        </button>
      )}
      {roundEnded && (
        <div className="round-end-msg">💔 Out of hearts — loading results…</div>
      )}
    </div>
  )
}
