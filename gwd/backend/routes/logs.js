import express from 'express';
import DayLog from '../models/DayLog.js';
import Routine from '../models/Routine.js';

const router = express.Router();

// Get logs - range query supported
router.get('/', async (req, res) => {
  try {
    const { start, end, goalId } = req.query;
    let filter = {};
    if (start && end) filter.date = { $gte: start, $lte: end };
    if (goalId) filter.goal = goalId;
    const logs = await DayLog.find(filter).sort({ date: 1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:date', async (req, res) => {
  try {
    const log = await DayLog.findOne({ date: req.params.date });
    res.json(log || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create or update a day log
router.post('/:date', async (req, res) => {
  try {
    const { entries, mood, journal, goal } = req.body;
    const routines = await Routine.find({ isActive: true });
    const maxPoints = routines.reduce((sum, r) => sum + (r.points || 10), 0);
    const totalPoints = entries
      .filter(e => e.completed)
      .reduce((sum, e) => sum + (e.pointsEarned || 0), 0);

    const log = await DayLog.findOneAndUpdate(
      { date: req.params.date },
      { entries, mood, journal, goal, totalPoints, maxPoints },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Stats for growth graph
router.get('/stats/growth', async (req, res) => {
  try {
    const { days = 90, goalId } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    let filter = { date: { $gte: startStr, $lte: endStr } };
    if (goalId) filter.goal = goalId;

    const logs = await DayLog.find(filter).sort({ date: 1 });
    const stats = {
      totalDays: logs.length,
      avgCompletion: logs.length ? Math.round(logs.reduce((s, l) => s + l.completionPercent, 0) / logs.length) : 0,
      perfectDays: logs.filter(l => l.completionPercent === 100).length,
      currentStreak: 0,
      chartData: logs.map(l => ({
        date: l.date,
        completion: l.completionPercent,
        points: l.totalPoints,
        mood: l.mood,
      }))
    };

    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    for (let i = logs.length - 1; i >= 0; i--) {
      if (logs[i].completionPercent >= 50) streak++;
      else break;
    }
    stats.currentStreak = streak;

    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
