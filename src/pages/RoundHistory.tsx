import React from 'react'
import { loadState, saveState } from '../lib/storage'
import { editRound } from '../lib/game'

export default function RoundHistory() {
  const [game, setGame] = React.useState<any>(null)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editData, setEditData] = React.useState<any>(null)

  React.useEffect(() => {
    setGame(loadState())
  }, [])

  if (!game) return <div>No history</div>

  function startEdit(round: any) {
    setEditingId(round.id)
    setEditData({ ...round, scores: { ...round.scores } })
  }

  function changeScore(pid: string, val: number) {
    setEditData((e: any) => ({ ...e, scores: { ...e.scores, [pid]: val } }))
  }

  function saveEdit() {
    if (!editData) return
    const next = editRound(game, editingId!, editData)
    saveState(next)
    setGame(next)
    setEditingId(null)
    setEditData(null)
  }

  return (
    <div>
      <h2 className="text-2xl text-gold">Round History</h2>
      <div className="space-y-2 mt-4">
        {game.rounds.slice().reverse().map((r: any, idx: number) => (
          <div key={r.id || idx} className="p-3 bg-white/3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-white/60">{new Date(r.timestamp).toLocaleString()}</div>
                <div className="mt-1">
                  Winner: <span className="font-medium">{r.winnerName}</span>
                  {r.endType === 'locker' && (
                    <span className="ml-2 text-xs bg-red-900 px-2 py-1 rounded">Locker</span>
                  )}
                  {r.endType === 'winner' && (
                    <span className="ml-2 text-xs bg-gold text-black px-2 py-1 rounded">⭐ Winner</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(r)}
                  className="p-2 bg-white/5 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {Object.entries(r.scores).map(([pid, score]) => {
                const player = game.players.find((p: any) => p.id === pid)
                return (
                  <div key={pid} className="p-1 bg-white/5 rounded text-sm">
                    {player?.name}: {score}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {editingId && editData && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center p-4 bg-black/50">
          <div className="w-full md:w-2/3 bg-bg p-4 rounded-lg border border-white/5">
            <h3 className="text-lg text-gold">Edit Round</h3>
            <div className="mt-2">
              <label className="text-sm">End Type</label>
              <select
                value={editData.endType}
                onChange={e => setEditData((d: any) => ({ ...d, endType: e.target.value }))}
                className="w-full p-2 bg-white/5 rounded mt-1"
              >
                <option value="winner">Winner (0 pts + ⭐)</option>
                <option value="locker">Locker (7♥ played)</option>
              </select>
            </div>
            <div className="mt-2">
              <label className="text-sm">Winner</label>
              <select
                value={editData.winnerId}
                onChange={e =>
                  setEditData((d: any) => ({
                    ...d,
                    winnerId: e.target.value,
                    winnerName: game.players.find((p: any) => p.id === e.target.value)?.name,
                  }))
                }
                className="w-full p-2 bg-white/5 rounded mt-1"
              >
                {game.players.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <label className="text-sm">Scores</label>
              <div className="space-y-2 mt-2">
                {game.players.map((p: any) => (
                  <div key={p.id} className="flex gap-2 items-center">
                    <div className="w-1/2">{p.name}</div>
                    <input
                      type="number"
                      value={editData.scores[p.id]}
                      onChange={e => changeScore(p.id, Number(e.target.value) || 0)}
                      className="flex-1 p-2 bg-white/5 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={saveEdit}
                className="flex-1 p-3 bg-gold text-black rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingId(null)
                  setEditData(null)
                }}
                className="p-3 bg-white/5 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
