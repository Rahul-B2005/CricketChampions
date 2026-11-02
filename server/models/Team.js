import mongoose from 'mongoose';
const ref = { type: mongoose.Schema.Types.ObjectId, ref: 'Player' };
const s = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, trim: true, uppercase: true, default: '' },
  flag: { type: String, default: '🏏' },
  accent: { type: String, default: '#22c55e' },
  players: [ref],
  playingXI: { type: [ref], validate: [(v) => v.length <= 11, 'Playing XI cannot exceed 11 players'] },
}, { timestamps: true });
export default mongoose.model('Team', s);
