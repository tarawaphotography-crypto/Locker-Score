// Scoring engine skeleton for Locker-Score

/**
 * Example game model:
 * {
 *   players: [{id, name}],
 *   rounds: [{playerId, card, scoreDelta}],
 *   settings: { lockerRule: true, stars: true }
 * }
 */

export function calculateTotalScores(game) {
  const totals = new Map();
  for (const p of game.players) totals.set(p.id, 0);

  for (const round of game.rounds || []) {
    const prev = totals.get(round.playerId) || 0;
    totals.set(round.playerId, prev + (round.scoreDelta || 0));
  }

  return Object.fromEntries(totals);
}

export function applyLockerRule(playerScore, card) {
  // Placeholder: apply 7\u2665 (7 of hearts) "Locker" rule adjustment
  // Implement actual rule logic in future changes
  if (!card) return playerScore;
  const isLocker = card.suit === 'hearts' && card.rank === 7;
  if (isLocker) {
    // Example: lock the player's score (no further changes) represented by null
    return { locked: true, value: playerScore };
  }
  return playerScore;
}

export default {
  calculateTotalScores,
  applyLockerRule,
};
