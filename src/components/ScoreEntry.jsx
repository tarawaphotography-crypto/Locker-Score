import React, { useState } from 'react';
import ScoringEngine from '../scoring/engine';

export default function ScoreEntry({ onSave }) {
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);

  function addPlayer(name) {
    setPlayers((p) => [...p, { id: Date.now().toString(), name }]);
  }

  function addRound(playerId, scoreDelta, card) {
    setRounds((r) => [...r, { playerId, scoreDelta, card }]);
  }

  function save() {
    const game = { players, rounds, settings: {} };
    const totals = ScoringEngine.calculateTotalScores(game);
    onSave?.(game, totals);
  }

  return (
    <div className="score-entry">
      <h2>Score Entry (PWA scaffold)</h2>
      <p>This is an initial placeholder for the Score Entry screen. Interactive UI will follow.</p>
      <button onClick={() => addPlayer('Player ' + (players.length + 1))}>Add player</button>
      <button onClick={() => addRound(players[0]?.id || '', 1)}>Add sample round</button>
      <button onClick={save}>Save game</button>
    </div>
  );
}
