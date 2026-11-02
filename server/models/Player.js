import mongoose from 'mongoose';
const rating = { type: Number, min: 1, max: 99, default: 50 };
const s = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['Batter', 'Bowler', 'All-rounder', 'Wicketkeeper'], default: 'Batter' },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Silver' },
  battingRating: rating, bowlingRating: rating, fieldingRating: rating,
  battingStyle: { type: String, default: 'Right-hand bat' },
  bowlingStyle: { type: String, default: '' },
}, { timestamps: true });
export default mongoose.model('Player', s);
