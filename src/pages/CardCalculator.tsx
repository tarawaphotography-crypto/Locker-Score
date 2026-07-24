import React from 'react'
import { loadState, saveState } from '../lib/storage'
import { GameState, cardValueRank, endRoundWithHands } from '../lib/game'
import { useNavigate } from 'react-router-dom'

type Card = { rank: string; suit?: string }

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export default function CardCalculator() {
  const nav = useNavigate()
  const [game, setGame] = React.useState<GameState | null>(null)
  const [winnerId, setWinnerId] = React.useState<string | null>(null)
  const [playerCards, setPlayerCards] = React.useState<Record<string, Card[]>>({})
  const [lockerDetected, setLockerDetected] = React.useState(false)
  const [lockerPlayedBy, setLockerPlayedBy] = React.useState<string | null>(null)
  const [roundEnded, setRoundEnded] = React.useState(false)

  React.useEffect(() => {
    const s = loadState()
    setGame(s || null)
    if (s) {
      const initial: Record<string, Card[]> = {}
      s.players.forEach(p => (initial[p.id] = []))
      setPlayerCards(initial)
    }
  }, [])

  if (!game) return <div>No game</div>

  function addCard(playerId: string, card: Card) {
    if (lockerDetected || roundEnded) return
    setPlayerCards(prev => {
      const next = { ...prev }
      next[playerId] = [...(next[playerId] || []), card]
      return next
    })
    // detect locker (7♥)
    if (card.rank === '7' && card.suit === 'hearts') {
      setLockerDetected(true)
      setLockerPlayedBy(playerId)
    }
  }

  function removeCard(playerId: string, index: number) {
    if (lockerDetected || roundEnded) return
    setPlayerCards(prev => {
      const next = { ...prev }
      next[playerId] = next[playerId].filter((_, i) => i !== index)
      return next
    })
  }

  function cardTotal(cards: Card[]) {
    return cards.reduce((s, c) => s + cardValueRank(c.rank, c.suit), 0)
  }

  function finishRound(endType: 'winner' | 'locker') {
    if (!game) return

    if (endType === 'winner' && !winnerId) {
      alert('Select winner (player who played all 7 cards)')
      return
    }

    const handPoints: Record<string, number> = {}
    game.players.forEach(p => {
      handPoints[p.id] = cardTotal(playerCards[p.id] || [])
    })

    let finalWinnerId = winnerId
    if (endType === 'locker') {
      finalWinnerId = lockerPlayedBy
    }

    if (!finalWinnerId) return

    const next = endRoundWithHands(game, finalWinnerId, endType, handPoints, endType === 'locker' ? lockerPlayedBy || undefined : undefined)
    saveState(next)
    nav('/scoreboard')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gold">Card Calculator</h2>
        {lockerDetected && (
          <div className="text-sm text-red-400">
            Locker (7♥) played by {game.players.find(p => p.id === lockerPlayedBy)?.name}
          </div>
        )}
      </div>

      <p className="text-sm text-white/60">
        Select cards for each player. When 7♥ (Locker) is added, the round ends immediately and no more cards may be played.
      </p>

      <div className="space-y-3">
        {game.players.map(p => (
          <div
            key={p.id}
            className={`p-3 bg-white/3 rounded ${
              lockerDetected ? 'locked-overlay' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-white/60">
                  Remaining: {cardTotal(playerCards[p.id] || [])} pts
                </div>
              </div>
              {!lockerDetected && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setWinnerId(p.id)}
                    className={`p-2 rounded ${
                      winnerId === p.id ? 'bg-gold text-black' : 'bg-white/5'
                    }`}
                  >
                    Winner
                  </button>
                </div>
              )}
            </div>

            <div className="mt-2 grid grid-cols-6 gap-1">
              {RANKS.map(r => (
                <button
                  key={r}
                  onClick={() => addCard(p.id, { rank: r })}
                  disabled={lockerDetected}
                  className="p-2 bg-white/5 rounded text-sm disabled:opacity-50"
                >
                  {r}
                </button>
              ))}
              <div className="col-span-6 mt-2 text-xs text-white/60">Suits (7 of...)</div>
              {SUITS.map(s => (
                <button
                  key={s}
                  onClick={() => addCard(p.id, { rank: '7', suit: s })}
                  disabled={lockerDetected}
                  className="p-2 bg-white/5 rounded text-sm disabled:opacity-50"
                >
                  7 {s[0].toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => addCard(p.id, { rank: 'JOKER' })}
                disabled={lockerDetected}
                className="p-2 bg-white/5 rounded text-sm disabled:opacity-50"
              >
                Joker
              </button>
            </div>

            <div className="mt-2">
              <div className="flex gap-2 flex-wrap">
                {(playerCards[p.id] || []).map((c, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-black/40 rounded border border-white/5 flex items-center gap-2"
                  >
                    <div className="text-sm">
                      {c.rank}
                      {c.suit ? ' ' + c.suit[0].toUpperCase() : ''}
                    </div>
                    <div className="text-xs text-white/60">{cardValueRank(c.rank, c.suit)}</div>
                    {!lockerDetected && !roundEnded && (
                      <button
                        onClick={() => removeCard(p.id, idx)}
                        className="text-xs text-red-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {!lockerDetected ? (
          <>
            <button
              onClick={() => finishRound('winner')}
              disabled={!winnerId}
              className={`flex-1 btn-large ${
                winnerId ? 'bg-gold text-black' : 'bg-white/8 text-white/40'
              } rounded`}
            >
              Winner (0 pts + ⭐)
            </button>
          </>
        ) : (
          <button
            onClick={() => finishRound('locker')}
            className="flex-1 btn-large bg-red-600 text-white rounded"
          >
            End Round (Locker)
          </button>
        )}
        <button
          onClick={() => {
            const initial: Record<string, Card[]> = {}
            game.players.forEach(p => (initial[p.id] = []))
            setPlayerCards(initial)
            setLockerDetected(false)
            setLockerPlayedBy(null)
            setWinnerId(null)
            setRoundEnded(false)
          }}
          className="p-3 bg-white/5 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
