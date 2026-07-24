import React from 'react'
import { loadState } from '../lib/storage'

export default function RoundHistory(){
  const [game,setGame] = React.useState<any>(null)
  React.useEffect(()=>{
    setGame(loadState())
  },[])
  if(!game) return <div>No history</div>
  return (
    <div>
      <h2 className="text-2xl text-gold">Round History</h2>
      <div className="space-y-2 mt-4">
        {game.rounds.slice().reverse().map((r:any,idx:number)=> (
          <div key={r.id||idx} className="p-3 bg-white/3 rounded">
            <div className="text-sm text-white/60">{new Date(r.timestamp).toLocaleString()}</div>
            <div className="mt-1">Winner: <span className="font-medium">{r.winnerName}</span> {r.lockerPlayed? '• Locker': ''}</div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {Object.entries(r.scores).map(([pid,score])=>{
                const player = game.players.find((p:any)=>p.id===pid)
                return <div key={pid} className="p-1 bg-white/5 rounded">{player?.name}: {score}</div>
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
