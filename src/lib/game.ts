import { v4 as uuidv4 } from 'uuid'

export type Player = {
  id: string
  name: string
  points: number
  stars: number
}

export type Round = {
  id: string
  winnerId: string
  winnerName: string
  lockerPlayed: boolean
  scores: Record<string, number>
  timestamp: number
}

export type GameState = {
  players: Player[] // computed players with current points and stars
  rounds: Round[]
  undoStack: GameState[]
}

export function createGame(names: string[]): GameState{
  const players = names.map(n=>({id:uuidv4(),name:n,points:0,stars:0}))
  return {players, rounds:[], undoStack:[]}
}

export function cardValueRank(rank: string, suit?: string){
  // rank: 'A','2'..'10','J','Q','K','JOKER','7'
  if(rank === 'JOKER') return 30
  if(rank === 'A') return 1
  if(rank === 'J') return 15
  if(rank === 'Q') return 2
  if(rank === 'K') return 3
  if(rank === '7' && suit === 'hearts') return 25
  const n = Number(rank)
  if(!isNaN(n)) return n
  return 0
}

function deepCopyState(state: GameState): GameState{
  return JSON.parse(JSON.stringify(state))
}

function computePlayersFromRounds(playersBase: Player[], rounds: Round[]): Player[]{
  const next = playersBase.map(p=>({id:p.id,name:p.name,points:0,stars:0}))
  for(const r of rounds){
    // apply scores
    Object.entries(r.scores).forEach(([pid,score])=>{
      const pl = next.find(p=>p.id===pid)
      if(pl){ pl.points += score }
    })
    // winner star
    const winner = next.find(p=>p.id===r.winnerId)
    if(winner) winner.stars += 1
  }
  return next
}

export function addRound(state: GameState, round: Round): GameState{
  const snapshot = deepCopyState(state)
  const nextRounds = [...state.rounds, round]
  const playersBase = state.players.map(p=>({id:p.id,name:p.name,points:0,stars:0}))
  const nextPlayers = computePlayersFromRounds(playersBase, nextRounds)
  const next: GameState = {players: nextPlayers, rounds: nextRounds, undoStack: [...state.undoStack.slice(-49), snapshot]}
  return next
}

export function editRound(state: GameState, roundId: string, updatedRound: Round): GameState{
  const snapshot = deepCopyState(state)
  const nextRounds = state.rounds.map(r=> r.id===roundId ? updatedRound : r)
  const playersBase = state.players.map(p=>({id:p.id,name:p.name,points:0,stars:0}))
  const nextPlayers = computePlayersFromRounds(playersBase, nextRounds)
  const next: GameState = {players: nextPlayers, rounds: nextRounds, undoStack: [...state.undoStack.slice(-49), snapshot]}
  return next
}

export function undoRound(state: GameState): GameState{
  const last = state.undoStack[state.undoStack.length-1]
  if(!last) return state
  const nextUndo = state.undoStack.slice(0,-1)
  // last already contains its own undoStack; preserve the remaining stack
  last.undoStack = nextUndo
  return last
}

export function resetGame(): GameState{
  return {players:[], rounds:[], undoStack:[]}
}

export function endRoundWithHands(state: GameState, winnerId:string, lockerPlayed:boolean, handPoints: Record<string, number>): GameState{
  const roundId = uuidv4()
  const winner = state.players.find(p=>p.id===winnerId)
  const winnerName = winner?.name || 'Winner'
  const scores: Record<string, number> = {}
  state.players.forEach(p=>{
    if(p.id===winnerId) scores[p.id]=0
    else scores[p.id]=handPoints[p.id]||0
  })
  const round: Round = {id:roundId, winnerId, winnerName, lockerPlayed, scores, timestamp: Date.now()}
  return addRound(state, round)
}
