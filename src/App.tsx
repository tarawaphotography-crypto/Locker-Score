import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Splash from './pages/Splash'
import Home from './pages/Home'
import NewGame from './pages/NewGame'
import PlayerSetup from './pages/PlayerSetup'
import Scoreboard from './pages/Scoreboard'
import CardCalculator from './pages/CardCalculator'
import RoundHistory from './pages/RoundHistory'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import { loadState } from './lib/storage'

export default function App() {
  const [roundCount, setRoundCount] = React.useState<number>(0)

  React.useEffect(()=>{
    const s = loadState()
    setRoundCount(s?.rounds?.length || 0)
    const onStorage = () => {
      const ss = loadState()
      setRoundCount(ss?.rounds?.length || 0)
    }
    window.addEventListener('storage', onStorage)
    return ()=>window.removeEventListener('storage', onStorage)
  },[])

  return (
    <div className="app-shell bg-bg min-h-screen text-white font-sans">
      <header className="header p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gold">Locker Scores</h1>
          <div className="text-xs text-white/50">Rounds: {roundCount}</div>
        </div>
        <nav className="space-x-3">
          <Link to="/" className="text-sm text-white/60">Home</Link>
          <Link to="/scoreboard" className="text-sm text-white/60">Scoreboard</Link>
        </nav>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/new" element={<NewGame />} />
          <Route path="/setup" element={<PlayerSetup />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/card-calculator" element={<CardCalculator />} />
          <Route path="/history" element={<RoundHistory />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <footer className="p-3 text-center text-xs text-white/40">Black & Gold theme • Offline-ready PWA</footer>
    </div>
  )
}
