import express from 'express';
import Routine from '../models/Routine.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { goalId } = req.query;
    const filter = goalId ? { goal: goalId, isActive: true } : { isActive: true };
    const routines = await Routine.find(filter).sort({ startTime: 1 });
    res.json(routines);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const routine = await Routine.create(req.body);
    res.status(201).json(routine);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(routine);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Routine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Routine deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
