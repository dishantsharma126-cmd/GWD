import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine' },
  routineName: String,
  completed: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 },
  note: String,
  completedAt: Date,
});

const dayLogSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // "2024-01-15"
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  entries: [entrySchema],
  totalPoints: { type: Number, default: 0 },
  maxPoints: { type: Number, default: 0 },
  completionPercent: { type: Number, default: 0 },
  mood: { type: Number, min: 1, max: 5 },
  journal: String,
  streak: { type: Number, default: 0 },
}, { timestamps: true });

dayLogSchema.pre('save', function (next) {
  if (this.maxPoints > 0) {
    this.completionPercent = Math.round((this.totalPoints / this.maxPoints) * 100);
  }
  next();
});

export default mongoose.model('DayLog', dayLogSchema);
