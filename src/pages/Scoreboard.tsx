import React from 'react'
import { loadState, saveState } from '../lib/storage'
import { GameState, endRoundWithHands, undoRound, resetGame } from '../lib/game'
import { Link, useNavigate } from 'react-router-dom'

export default function Scoreboard(){
  const nav = useNavigate()
  const [game, setGame] = React.useState<GameState | null>(null)
  const [showEndDialog, setShowEndDialog] = React.useState(false)

  React.useEffect(()=>{
    const s = loadState()
    setGame(s||null)
  },[])

  React.useEffect(()=>{
    // save when game updates
    if(game) saveState(game)
  },[game])

  React.useEffect(()=>{
    if(game){
      const loser = game.players.find(p=>p.points>=100)
      if(loser) setShowEndDialog(true)
    }
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
  const winner = sorted[0]

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

      {showEndDialog && (
        <div className="fixed inset-0 flex items-center justify-center modal-backdrop p-4">
          <div className="w-full max-w-md bg-bg p-4 rounded-lg border border-white/5">
            <h3 className="text-xl text-gold">Game Over</h3>
            <p className="mt-2">A player reached 100 points and lost. Current winner (lowest points): <strong>{winner?.name}</strong> with {winner?.points} points.</p>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>{ setShowEndDialog(false) }} className="flex-1 p-3 bg-white/5 rounded">Continue</button>
              <button onClick={()=>{ onReset(); setShowEndDialog(false) }} className="flex-1 p-3 bg-gold text-black rounded">New Game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
