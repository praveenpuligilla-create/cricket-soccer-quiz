import { useState } from 'react'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import SportBackground from './components/SportBackground'
import { questions } from './data/questions'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRoundQuestions(sport, difficulty, usedIndices) {
  const pool = questions[sport][difficulty]
  let available = pool.map((_, i) => i).filter(i => !usedIndices.includes(i))
  let baseUsed = usedIndices
  if (available.length < 20) {
    available = pool.map((_, i) => i)
    baseUsed = []
  }
  const picked = shuffle(available).slice(0, 20)
  return {
    roundQuestions: picked.map(i => pool[i]),
    newUsed: [...baseUsed, ...picked],
  }
}

const initialUsed = {
  cricket: { easy: [], medium: [], hard: [] },
  soccer: { easy: [], medium: [], hard: [] },
}

function App() {
  const [screen, setScreen] = useState('home')
  const [config, setConfig] = useState({ sport: null, difficulty: null })
  const [roundQuestions, setRoundQuestions] = useState([])
  const [usedIndices, setUsedIndices] = useState(initialUsed)
  const [roundNum, setRoundNum] = useState(1)
  const [lastResult, setLastResult] = useState({ score: 0, total: 0, points: 0, lives: 3, maxStreak: 0 })
  // previewSport drives the background even before the quiz starts
  const [previewSport, setPreviewSport] = useState(null)

  // Whichever is truthy — active quiz sport takes priority
  const activeSport = config.sport || previewSport

  const startQuiz = (sport, difficulty) => {
    const used = usedIndices[sport][difficulty]
    const { roundQuestions: qs, newUsed } = pickRoundQuestions(sport, difficulty, used)
    setUsedIndices(prev => ({ ...prev, [sport]: { ...prev[sport], [difficulty]: newUsed } }))
    setConfig({ sport, difficulty })
    setRoundQuestions(qs)
    setRoundNum(1)
    setScreen('quiz')
  }

  const finishQuiz = (finalScore, total, points, livesLeft, maxStreak) => {
    setLastResult({ score: finalScore, total, points, lives: livesLeft, maxStreak })
    setScreen('results')
  }

  const nextRound = () => {
    const { sport, difficulty } = config
    const used = usedIndices[sport][difficulty]
    const { roundQuestions: qs, newUsed } = pickRoundQuestions(sport, difficulty, used)
    setUsedIndices(prev => ({ ...prev, [sport]: { ...prev[sport], [difficulty]: newUsed } }))
    setRoundQuestions(qs)
    setRoundNum(r => r + 1)
    setScreen('quiz')
  }

  const restartQuiz = () => {
    setConfig({ sport: null, difficulty: null })
    setLastResult({ score: 0, total: 0, points: 0, lives: 3, maxStreak: 0 })
    setRoundNum(1)
    setScreen('home')
  }

  return (
    <>
      <SportBackground sport={activeSport} />
      <div className="app-content">
        {screen === 'home' && (
          <Home onStart={startQuiz} onSportPreview={setPreviewSport} />
        )}
        {screen === 'quiz' && (
          <Quiz
            sport={config.sport}
            difficulty={config.difficulty}
            roundNum={roundNum}
            roundQuestions={roundQuestions}
            onFinish={finishQuiz}
            onBack={restartQuiz}
          />
        )}
        {screen === 'results' && (
          <Results
            score={lastResult.score}
            total={lastResult.total}
            points={lastResult.points}
            lives={lastResult.lives}
            maxStreak={lastResult.maxStreak}
            roundNum={roundNum}
            sport={config.sport}
            difficulty={config.difficulty}
            onNextRound={nextRound}
            onHome={restartQuiz}
          />
        )}
      </div>
    </>
  )
}

export default App
