import React from 'react'
import { loadState } from '../lib/storage'

export default function Statistics(){
  const [game,setGame] = React.useState<any>(null)
  React.useEffect(()=> setGame(loadState()),[])
  if(!game) return <div>No data</div>

  const totalRounds = game.rounds.length
  const stars = game.players.map((p:any)=>({name:p.name,stars:p.stars,points:p.points}))

  return (
    <div>
      <h2 className="text-2xl text-gold">Statistics</h2>
      <div className="mt-4 space-y-4">
        <div className="p-3 bg-white/3 rounded">Total rounds: <strong>{totalRounds}</strong></div>
        <div className="p-3 bg-white/3 rounded">Stars:
          <ul className="mt-2">
            {stars.map(s=>(<li key={s.name} className="p-2 bg-white/5 rounded mb-1">{s.name}: <span className="text-gold">{s.stars}</span> • {s.points} pts</li>))}
          </ul>
        </div>
      </div>
    </div>
  )
}
