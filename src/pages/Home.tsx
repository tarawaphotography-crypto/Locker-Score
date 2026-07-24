import React from 'react'
import { Link } from 'react-router-dom'
import { loadState } from '../lib/storage'

export default function Home(){
  const [hasGame, setHasGame] = React.useState(false)
  React.useEffect(()=>{
    const s = loadState()
    setHasGame(!!s && s.players && s.players.length>0)
  },[])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-gold font-bold">Locker Scores</h2>
      <p className="text-white/70">Fast scorekeeping for Locker (7♥). Supports 2–6 players, offline, undo and round history.</p>

      <div className="grid gap-3">
        <Link to="/new" className="btn-large gold-glow bg-gold text-black text-center">New Game</Link>
        {hasGame && <Link to="/scoreboard" className="btn-large p-4 bg-white/6 rounded text-white text-center">Continue Game</Link>}
        <Link to="/history" className="p-4 bg-white/5 rounded text-center">Round History</Link>
        <Link to="/stats" className="p-4 bg-white/5 rounded text-center">Statistics</Link>
        <Link to="/settings" className="p-4 bg-white/5 rounded text-center">Settings</Link>
      </div>

      <div className="mt-6 text-xs text-white/40">Tip: Add this app to your Home Screen for an iPhone-like experience.</div>
    </div>
  )
}
