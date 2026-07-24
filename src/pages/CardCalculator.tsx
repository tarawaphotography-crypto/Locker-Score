import React from 'react'
import { loadState, saveState } from '../lib/storage'
import { GameState, CardType, cardValue, endRoundWithHands } from '../lib/game'
import { useNavigate } from 'react-router-dom'

export default function CardCalculator(){
  const nav = useNavigate()
  const [game, setGame] = React.useState<GameState | null>(null)
  const [winnerId, setWinnerId] = React.useState<string | null>(null)
  const [lockerPlayed, setLockerPlayed] = React.useState(false)
  const [entries, setEntries] = React.useState<Record<string, number>>({})

  React.useEffect(()=>{
    const s = loadState()
    setGame(s||null)
    if(s){
      const initial: Record<string,number> = {}
      s.players.forEach(p=>initial[p.id]=0)
      setEntries(initial)
    }
  },[])

  if(!game) return <div>No game</div>

  function addPoint(playerId:string, v:number){
    setEntries(prev=>({...prev,[playerId]:(prev[playerId]||0)+v}))
  }

  function setPoints(playerId:string, v:number){
    setEntries(prev=>({...prev,[playerId]:v}))
  }

  function finishRound(){
    if(!game) return
    if(!winnerId){
      alert('Select winner (who gets 0 pts and a star)')
      return
    }
    const next = endRoundWithHands(game, winnerId, lockerPlayed, entries)
    saveState(next)
    nav('/scoreboard')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-gold">Card Calculator</h2>
      <p className="text-sm text-white/60">Tap cards to add values. Winner gets 0 points and a ⭐. If Locker (7♥) was played, toggle Locker and finish round immediately.</p>
      <div className="space-y-2">
        {game.players.map(p=> (
          <div key={p.id} className="p-3 bg-white/3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-white/60">Current total: {entries[p.id]||0}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={()=>setWinnerId(p.id)} className={`p-2 rounded ${winnerId===p.id? 'bg-gold text-black':'bg-white/5'}`}>Winner</button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1">
              <button onClick={()=>addPoint(p.id,1)} className="p-2 bg-white/5 rounded">A=1</button>
              <button onClick={()=>addPoint(p.id,2)} className="p-2 bg-white/5 rounded">2</button>
              <button onClick={()=>addPoint(p.id,3)} className="p-2 bg-white/5 rounded">3</button>
              <button onClick={()=>addPoint(p.id,5)} className="p-2 bg-white/5 rounded">5</button>
              <button onClick={()=>addPoint(p.id,10)} className="p-2 bg-white/5 rounded">10</button>
              <button onClick={()=>addPoint(p.id,15)} className="p-2 bg-white/5 rounded">J=15</button>
              <button onClick={()=>addPoint(p.id,2)} className="p-2 bg-white/5 rounded">Q=2</button>
              <button onClick={()=>addPoint(p.id,3)} className="p-2 bg-white/5 rounded">K=3</button>
              <button onClick={()=>addPoint(p.id,30)} className="p-2 bg-white/5 rounded">Joker=30</button>
              <button onClick={()=>addPoint(p.id,25)} className="p-2 bg-red-700 rounded">7♥=25</button>
            </div>
            <div className="mt-2">
              <input type="number" value={entries[p.id]||0} onChange={e=>setPoints(p.id,Number(e.target.value)||0)} className="w-full p-2 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={lockerPlayed} onChange={e=>setLockerPlayed(e.target.checked)} /> Locker (7♥) played</label>
        <button onClick={finishRound} className="ml-auto p-3 bg-gold text-black rounded">Finish Round</button>
      </div>
    </div>
  )
}
