import Match from '../models/Match.js';
import { crud } from './crud.js';
export const matchCrud = crud(Match, { sort: '-date' });

export const stats = async (req, res) => {
  const ms = await Match.find({ owner: req.user.id }).sort('date');
  const played = ms.length;
  const won = ms.filter((m) => m.result === 'Won').length;
  const lost = ms.filter((m) => m.result === 'Lost').length;
  res.json({
    played, won, lost, tied: played - won - lost,
    winPct: played ? Math.round((won / played) * 100) : 0,
    avgRuns: played ? Math.round(ms.reduce((a, m) => a + m.myRuns, 0) / played) : 0,
    highest: played ? Math.max(...ms.map((m) => m.myRuns)) : 0,
    trend: ms.map((m, i) => ({ label: `M${i + 1}`, opponent: m.opponent, runs: m.myRuns, oppRuns: m.oppRuns })),
  });
};
