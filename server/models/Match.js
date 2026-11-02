import mongoose from 'mongoose';
const s = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  opponent: { type: String, required: true, trim: true },
  myRuns: { type: Number, required: true, min: 0 }, myWkts: { type: Number, default: 0, min: 0, max: 10 },
  oppRuns: { type: Number, required: true, min: 0 }, oppWkts: { type: Number, default: 0, min: 0, max: 10 },
  overs: { type: Number, default: 20, min: 1 },
  venue: { type: String, default: '' },
  result: { type: String, enum: ['Won', 'Lost', 'Tie'] },
  date: { type: Date, default: Date.now },
}, { timestamps: true });
s.pre('validate', function (next) {
  this.result = this.myRuns > this.oppRuns ? 'Won' : this.myRuns < this.oppRuns ? 'Lost' : 'Tie';
  next();
});
export default mongoose.model('Match', s);
