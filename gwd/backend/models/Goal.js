import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  durationDays: { type: Number, required: true },
  targetScore: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#f97316' },
  icon: { type: String, default: '🔥' },
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
