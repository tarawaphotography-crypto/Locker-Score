import React from 'react'
import { Link } from 'react-router-dom'

export default function NewGame(){
  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-gold font-semibold">New Game</h2>
      <p className="text-white/70">Set up a new Locker Scores game for 2–6 players.</p>
      <Link to="/setup" className="block mt-4 p-3 bg-gold text-black text-center rounded-lg">Create Game</Link>
    </div>
  )
}
