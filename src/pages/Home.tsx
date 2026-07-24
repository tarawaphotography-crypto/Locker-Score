import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-gold font-semibold">Home</h2>
      <div className="grid gap-3">
        <Link to="/new" className="p-4 bg-white/3 rounded-lg">New Game</Link>
        <Link to="/scoreboard" className="p-4 bg-white/3 rounded-lg">Scoreboard</Link>
        <Link to="/history" className="p-4 bg-white/3 rounded-lg">Round History</Link>
        <Link to="/stats" className="p-4 bg-white/3 rounded-lg">Statistics</Link>
        <Link to="/settings" className="p-4 bg-white/3 rounded-lg">Settings</Link>
      </div>
    </div>
  )
}
