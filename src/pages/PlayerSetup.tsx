import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loadState, saveState } from '../lib/storage'
import { GameState, createGame } from '../lib/game'

export default function PlayerSetup(){
  const nav = useNavigate()
  const [names,setNames] = React.useState<string[]>(['',''])
  const [error,setError] = React.useState<string|null>(null)

  React.useEffect(()=>{
    const s = loadState()
    if(s?.players?.length){
      const existing = s.players.map((p:any)=>p.name)
      if(existing.length>=2){
        setNames(existing)
      }
    }
  },[])

  function updateName(i:number, val:string){
    const next = [...names]
    next[i]=val
    setNames(next)
  }

  function addPlayer(){
    if(names.length>=6) return
    setNames([...names,''])
  }
  function removePlayer(index?:number){
    if(names.length<=2) return
    if(typeof index === 'number'){
      setNames(names.filter((_,i)=>i!==index))
    } else setNames(names.slice(0,-1))
  }

  function start(){
    const cleaned = names.map(n=>n.trim()||'Player').slice(0,6)
    if(cleaned.length<2){ setError('At least 2 players required'); return }
    const game: GameState = createGame(cleaned)
    saveState(game)
    nav('/scoreboard')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-gold font-semibold">Player Setup</h2>
      {error && <div className="text-red-400">{error}</div>}
      <div className="space-y-2">
        {names.map((n, i)=>(
          <div key={i} className="flex gap-2">
            <input className="flex-1 p-3 bg-white/3 rounded" value={n} onChange={e=>updateName(i,e.target.value)} placeholder={`Player ${i+1}`} />
            {names.length>2 && <button onClick={()=>removePlayer(i)} className="p-2 bg-red-700 rounded">Remove</button>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={addPlayer} className="flex-1 p-3 bg-white/5 rounded">Add Player</button>
        <button onClick={()=>removePlayer()} className="flex-1 p-3 bg-white/5 rounded">Remove Last</button>
      </div>
      <div className="flex gap-2">
        <button onClick={start} className="flex-1 p-3 bg-gold text-black rounded">Start Game</button>
      </div>
    </div>
  )
}
