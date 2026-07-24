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
  players: Player[]
  rounds: Round[]
  undoStack: GameState[]
}

export const CardType = {
  ACE: 'A',
}

export function createGame(names: string[]): GameState{
  const players = names.map(n=>({id:uuidv4(),name:n,points:0,stars:0}))
  return {players, rounds:[], undoStack:[]}
}

export function cardValue(card:string){
  // simple mapping if needed
  switch(card){
    case 'A': return 1
    case 'J': return 15
    case 'Q': return 2
    case 'K': return 3
    case 'JOKER': return 30
    case '7H': return 25
    default: {
      const n = Number(card)
      return isNaN(n)?0:n
    }
  }
}

export function addRound(state: GameState, round: Round): GameState{
  const snapshot = JSON.parse(JSON.stringify(state))
  const nextPlayers = state.players.map(p=>({...p}))
  // apply scores
  Object.entries(round.scores).forEach(([pid,score])=>{
    const pl = nextPlayers.find(x=>x.id===pid)
    if(pl){ pl.points += score }
  })
  // winner gets 0 and one star
  const winner = nextPlayers.find(p=>p.id===round.winnerId)
  if(winner) winner.stars += 1

  const next: GameState = {players: nextPlayers, rounds: [...state.rounds, round], undoStack: [...state.undoStack.slice(-49), snapshot]}
  return next
}

export function undoRound(state: GameState): GameState{
  const last = state.undoStack[state.undoStack.length-1]
  if(!last) return state
  const nextUndo = state.undoStack.slice(0,-1)
  return {...last, undoStack: nextUndo}
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
