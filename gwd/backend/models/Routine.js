import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['fitness', 'study', 'mindset', 'nutrition', 'skill', 'other'],
    default: 'other'
  },
  startTime: String,   // "06:00"
  endTime: String,     // "07:00"
  durationMin: Number,
  points: { type: Number, default: 10 },
  icon: { type: String, default: '⚡' },
  color: String,
  isActive: { type: Boolean, default: true },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  daysOfWeek: [{ type: Number }], // 0=Sun, 6=Sat, empty=daily
}, { timestamps: true });

export default mongoose.model('Routine', routineSchema);
