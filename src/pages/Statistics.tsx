import React from 'react'
import { loadState } from '../lib/storage'

export default function Statistics(){
  const [game,setGame] = React.useState<any>(null)
  React.useEffect(()=> setGame(loadState()),[])
  if(!game) return <div>No data</div>

  const totalRounds = game.rounds.length
  const stars = game.players.map((p:any)=>({name:p.name,stars:p.stars}))

  return (
    <div>
      <h2 className="text-2xl text-gold">Statistics</h2>
      <div className="mt-4 space-y-2">
        <div>Total rounds: {totalRounds}</div>
        <div>
          Stars:
          <ul className="mt-2">
            {stars.map(s=>(<li key={s.name}>{s.name}: <span className="text-gold">{s.stars}</span></li>))}
          </ul>
        </div>
      </div>
    </div>
  )
}
