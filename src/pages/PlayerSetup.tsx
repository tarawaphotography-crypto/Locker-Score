import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loadState, saveState } from '../lib/storage'
import { GameState, createGame } from '../lib/game'

export default function PlayerSetup(){
  const nav = useNavigate()
  const [names,setNames] = React.useState<string[]>(['',''])

  React.useEffect(()=>{
    const s = loadState()
    if(s?.players?.length) {
      // prefill
    }
  },[])

  function updateName(i:string|number, val:string){
    const idx = Number(i)
    const next = [...names]
    next[idx]=val
    setNames(next)
  }

  function addPlayer(){
    if(names.length>=6) return
    setNames([...names,''])
  }
  function removePlayer(){
    if(names.length<=2) return
    setNames(names.slice(0,-1))
  }

  function start(){
    const cleaned = names.map(n=>n.trim()||'Player').slice(0,6)
    if(cleaned.length<2) return
    const game: GameState = createGame(cleaned)
    saveState(game)
    nav('/scoreboard')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-gold font-semibold">Player Setup</h2>
      <div className="space-y-2">
        {names.map((n, i)=>(
          <input key={i} className="w-full p-3 bg-white/3 rounded" value={n} onChange={e=>updateName(i,e.target.value)} placeholder={`Player ${i+1}`} />
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={addPlayer} className="flex-1 p-3 bg-white/5 rounded">Add Player</button>
        <button onClick={removePlayer} className="flex-1 p-3 bg-white/5 rounded">Remove</button>
      </div>
      <div className="flex gap-2">
        <button onClick={start} className="flex-1 p-3 bg-gold text-black rounded">Start Game</button>
      </div>
    </div>
  )
}
