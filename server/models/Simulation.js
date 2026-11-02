import mongoose from 'mongoose';
const s = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  settings: { overs: Number, pitch: String },
  teamA: { name: String }, teamB: { name: String },
  summary: mongoose.Schema.Types.Mixed,
  innings: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });
export default mongoose.model('Simulation', s);
