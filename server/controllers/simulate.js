import Team from '../models/Team.js';
import Simulation from '../models/Simulation.js';
import { simulateMatch } from '../services/simulationEngine.js';

async function load(id, owner) {
  const t = await Team.findOne({ _id: id, owner }).populate('players').populate('playingXI');
  if (!t) throw Object.assign(new Error('Team not found'), { status: 404 });
  const xi = (t.playingXI.length ? t.playingXI : t.players).slice(0, 11).map((p) => p.toObject());
  if (xi.length < 2) throw Object.assign(new Error(`${t.name} needs at least 2 players`), { status: 400 });
  return { name: t.name, xi };
}

export const run = async (req, res) => {
  const { teamAId, teamBId, overs = 20, pitch = 'flat' } = req.body;
  if (!teamAId || !teamBId) return res.status(400).json({ message: 'Pick two teams' });
  if (teamAId === teamBId) return res.status(400).json({ message: 'Pick two different teams' });
  const o = Math.min(50, Math.max(1, Number(overs) || 20));
  const [teamA, teamB] = await Promise.all([load(teamAId, req.user.id), load(teamBId, req.user.id)]);
  const { summary, innings } = simulateMatch({ teamA, teamB, overs: o, pitch });
  const sim = await Simulation.create({
    owner: req.user.id, settings: { overs: o, pitch },
    teamA: { name: teamA.name }, teamB: { name: teamB.name }, summary, innings,
  });
  res.status(201).json(sim);
};
export const history = async (req, res) =>
  res.json(await Simulation.find({ owner: req.user.id }).select('-innings').sort('-createdAt').limit(20));
export const getOne = async (req, res) => {
  const s = await Simulation.findOne({ _id: req.params.id, owner: req.user.id });
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
};
