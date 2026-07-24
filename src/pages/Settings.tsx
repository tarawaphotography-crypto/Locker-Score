import React from 'react'
import { loadState, clearState } from '../lib/storage'

export default function Settings(){
  const [game,setGame] = React.useState<any>(null)
  React.useEffect(()=> setGame(loadState()),[])

  function exportState(){
    const s = loadState() || {}
    const data = JSON.stringify(s, null, 2)
    const blob = new Blob([data], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'locker-scores-state.json'
    a.click(); URL.revokeObjectURL(url)
  }

  function clear(){
    if(!confirm('Clear saved game?')) return
    clearState(); setGame(null)
  }

  return (
    <div>
      <h2 className="text-2xl text-gold">Settings</h2>
      <div className="mt-4 space-y-2">
        <button onClick={exportState} className="p-3 bg-white/5 rounded">Export Game Data</button>
        <button onClick={clear} className="p-3 bg-red-700 rounded">Clear Saved Game</button>
      </div>
    </div>
  )
}
