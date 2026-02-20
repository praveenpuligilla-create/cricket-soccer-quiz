import './SportBackground.css'

/* ─────────────────────────────────────────────────────────
   HOW TO ADD REAL PHOTOS:
   Save these 4 image files anywhere in the public folder:
     public/players/kohli.jpg
     public/players/tendulkar.jpg
     public/players/ronaldo.jpg
     public/players/chhetri.jpg
   Portrait-orientation photos work best (taller than wide).
───────────────────────────────────────────────────────── */

function PlayerPanel({ src, alt, name, number, country, side, glowColor, fallbackEmoji }) {
  return (
    <div className={`player-panel player-panel-${side}`} style={{ '--glow': glowColor }}>
      <div className="player-photo-wrap">
        <img
          src={src}
          alt={alt}
          className="player-photo"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        {/* Fallback shown if image is missing */}
        <div className="player-fallback" aria-hidden="true">
          <span className="fallback-emoji">{fallbackEmoji}</span>
          <span className="fallback-name">{name}</span>
        </div>
      </div>
      <div className={`player-info player-info-${side}`}>
        <span className="player-badge-num">{number}</span>
        <span className="player-badge-name">{name}</span>
        <span className="player-badge-country">{country}</span>
      </div>
    </div>
  )
}

function CricketBackground() {
  return (
    <div className="sport-bg cricket-bg">
      <PlayerPanel
        src="/players/kohli.jpg"
        alt="Virat Kohli"
        name="VIRAT KOHLI"
        number="#18"
        country="INDIA"
        side="left"
        glowColor="#FF5500"
        fallbackEmoji="🏏"
      />
      <PlayerPanel
        src="/players/tendulkar.jpg"
        alt="Sachin Tendulkar"
        name="SACHIN TENDULKAR"
        number="#10"
        country="INDIA"
        side="right"
        glowColor="#FFB800"
        fallbackEmoji="🏆"
      />
      <div className="sport-bg-overlay cricket-overlay" />
    </div>
  )
}

function SoccerBackground() {
  return (
    <div className="sport-bg soccer-bg">
      <PlayerPanel
        src="/players/ronaldo.jpg"
        alt="Cristiano Ronaldo"
        name="C. RONALDO"
        number="#7"
        country="PORTUGAL"
        side="left"
        glowColor="#FF2244"
        fallbackEmoji="⚽"
      />
      <PlayerPanel
        src="/players/chhetri.jpg"
        alt="Sunil Chhetri"
        name="SUNIL CHHETRI"
        number="#11"
        country="INDIA"
        side="right"
        glowColor="#4488FF"
        fallbackEmoji="🥅"
      />
      <div className="sport-bg-overlay soccer-overlay" />
    </div>
  )
}

export default function SportBackground({ sport }) {
  return (
    <div className="sport-bg-root">
      <div className={`sport-transition ${sport === 'cricket' ? 'visible' : ''}`}>
        <CricketBackground />
      </div>
      <div className={`sport-transition ${sport === 'soccer' ? 'visible' : ''}`}>
        <SoccerBackground />
      </div>
    </div>
  )
}
