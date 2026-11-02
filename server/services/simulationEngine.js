// Ball-by-ball cricket simulation driven by player ratings (1-99), pitch and match phase.
const PITCH = {
  flat:  { wkt: -0.008, bnd: 0.03 },
  green: { wkt: 0.02,   bnd: -0.03 },
  dusty: { wkt: 0.012,  bnd: -0.015 },
};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const pick = (weights) => {
  const entries = Object.entries(weights);
  let r = Math.random() * entries.reduce((a, [, w]) => a + w, 0);
  for (const [k, w] of entries) { if ((r -= w) <= 0) return k; }
  return entries[0][0];
};

export function ballOutcome(bat, bowl, pitchKey, phase) {
  const edge = (bat - bowl) / 100;
  const p = PITCH[pitchKey] || PITCH.flat;
  return pick({
    W: clamp(0.045 - edge * 0.04 + p.wkt + phase * 0.012, 0.012, 0.14),
    0: Math.max(0.08, 0.34 - edge * 0.12 - phase * 0.06),
    1: 0.32, 2: 0.08, 3: 0.01,
    4: Math.max(0.03, 0.10 + edge * 0.06 + p.bnd + phase * 0.05),
    6: Math.max(0.01, 0.03 + edge * 0.05 + p.bnd / 2 + phase * 0.05),
  });
}

function playInnings(batXI, bowlXI, overs, pitch, target) {
  const n = batXI.length;
  let pool = bowlXI.filter((p) => p.bowlingRating >= 40).sort((a, b) => b.bowlingRating - a.bowlingRating);
  if (pool.length < 5) pool = [...bowlXI].sort((a, b) => b.bowlingRating - a.bowlingRating).slice(0, Math.max(5, pool.length));
  const maxBalls = Math.ceil(overs / Math.max(1, Math.min(5, pool.length))) * 6;
  const bowlCard = Object.fromEntries(pool.map((p) => [p.name, { player: p.name, balls: 0, runs: 0, wkts: 0 }]));
  const batCard = batXI.map((p) => ({ player: p.name, runs: 0, balls: 0, fours: 0, sixes: 0, out: false, howOut: 'not out' }));
  const log = [], perOver = [];
  let striker = 0, non = 1, next = 2, runs = 0, wkts = 0, balls = 0, last = null, done = false;

  for (let o = 0; o < overs && !done; o++) {
    const phase = o / overs >= 0.8 ? 1 : 0;
    let cands = pool.filter((p) => bowlCard[p.name].balls < maxBalls && p.name !== last);
    if (!cands.length) cands = pool.filter((p) => p.name !== last);
    if (!cands.length) cands = pool;
    const bw = cands[Math.floor(Math.random() * cands.length)];
    last = bw.name;
    let overRuns = 0;
    for (let b = 0; b < 6; b++) {
      const bat = batXI[striker], card = batCard[striker], bc = bowlCard[bw.name];
      const out = ballOutcome(bat.battingRating, bw.bowlingRating, pitch, phase);
      balls++; card.balls++; bc.balls++;
      if (out === 'W') {
        wkts++; bc.wkts++; card.out = true; card.howOut = 'b ' + bw.name;
        log.push({ over: o + 1, ball: b + 1, batter: bat.name, bowler: bw.name, outcome: 'W' });
        if (wkts >= n - 1) { done = true; break; }
        striker = next++;
      } else {
        const r = Number(out);
        runs += r; overRuns += r; card.runs += r; bc.runs += r;
        if (r === 4) card.fours++;
        if (r === 6) card.sixes++;
        log.push({ over: o + 1, ball: b + 1, batter: bat.name, bowler: bw.name, outcome: r });
        if (r % 2 === 1) [striker, non] = [non, striker];
        if (target != null && runs > target) { done = true; break; }
      }
    }
    if (!done) [striker, non] = [non, striker];
    perOver.push({ over: o + 1, runs: overRuns, total: runs, wkts });
  }
  return { runs, wkts, balls, batting: batCard, bowling: Object.values(bowlCard).filter((b) => b.balls), perOver, log };
}

export function simulateMatch({ teamA, teamB, overs = 20, pitch = 'flat' }) {
  const first = playInnings(teamA.xi, teamB.xi, overs, pitch, null);
  const second = playInnings(teamB.xi, teamA.xi, overs, pitch, first.runs);
  let result;
  if (second.runs > first.runs) result = `${teamB.name} won by ${Math.max(1, teamB.xi.length - 1 - second.wkts)} wickets`;
  else if (second.runs < first.runs) result = `${teamA.name} won by ${first.runs - second.runs} runs`;
  else result = 'Match tied';
  return {
    summary: {
      result, target: first.runs + 1,
      a: { name: teamA.name, runs: first.runs, wkts: first.wkts, balls: first.balls },
      b: { name: teamB.name, runs: second.runs, wkts: second.wkts, balls: second.balls },
    },
    innings: [{ team: teamA.name, ...first }, { team: teamB.name, ...second }],
  };
}
