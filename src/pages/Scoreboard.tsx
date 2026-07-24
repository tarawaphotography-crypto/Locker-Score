import React from 'react'
import { loadState, saveState } from '../lib/storage'
import { GameState, endRoundWithHands, undoRound, resetGame } from '../lib/game'
import { Link, useNavigate } from 'react-router-dom'

export default function Scoreboard(){
  const nav = useNavigate()
  const [game, setGame] = React.useState<GameState | null>(null)

  React.useEffect(()=>{
    const s = loadState()
    setGame(s||null)
  },[])

  React.useEffect(()=>{
    // save when game updates
    if(game) saveState(game)
  },[game])

  function onNewRound(){
    nav('/card-calculator')
  }

  function onUndo(){
    if(!game) return
    const next = undoRound(game)
    saveState(next)
    setGame(next)
  }

  function onReset(){
    if(!confirm('Reset game?')) return
    const next = resetGame()
    saveState(next)
    setGame(next)
  }

  if(!game) return (
    <div>
      <p>No active game. <Link to="/new" className="text-gold">Create one</Link></p>
    </div>
  )

  const loser = game.players.find(p=>p.points>=100)
  const sorted = [...game.players].sort((a,b)=>a.points-b.points)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gold font-semibold">Scoreboard</h2>
        <div className="text-sm text-white/60">Rounds: {game.rounds.length}</div>
      </div>
      <div className="space-y-2">
        {sorted.map(p=> (
          <div key={p.id} className="p-3 rounded bg-white/3 flex justify-between items-center transition-transform transform hover:scale-[1.01]">
            <div>
              <div className="font-medium text-lg">{p.name}</div>
              <div className="text-sm text-white/60">Stars: <span className="text-gold">{p.stars}</span></div>
            </div>
            <div className="text-right">
              <div className="text-3xl">{p.points}</div>
              {loser && loser.id===p.id && <div className="text-xs text-red-400">Reached 100+</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onNewRound} className="flex-1 btn-large bg-gold text-black rounded">New Round</button>
        <button onClick={onUndo} className="p-3 bg-white/5 rounded">Undo</button>
        <button onClick={onReset} className="p-3 bg-white/5 rounded">New Game</button>
      </div>
      <div className="space-y-2">
        <Link to="/history" className="block p-3 bg-white/5 rounded">Round History</Link>
        <Link to="/stats" className="block p-3 bg-white/5 rounded">Statistics</Link>
        <Link to="/settings" className="block p-3 bg-white/5 rounded">Settings</Link>
      </div>
    </div>
  )
}
