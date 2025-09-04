import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Task from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// helper: always get a safe string id from req.user
const getUserId = (req: AuthRequest) =>
  ((req as any).user?._id?.toString?.() ?? '');

const uploadDir = path.join(process.cwd(), 'server', process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    const status = String(req.query.status || '');

    const query: any = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { assignedTo: { $regex: q, $options: 'i' } }
      ];
    }

    if (status) query.status = status;

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Get tasks error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Get task error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const userId = getUserId(req);
    const assignedToId = (task.assignedTo as any)?.toString?.() ?? String(task.assignedTo);

    if (req.user?.role === 'student' && assignedToId !== userId) {
      return res.status(403).json({ error: 'Can only update your own tasks' });
    }

    const updates = req.body || {};
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json(updatedTask);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Update task error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/submissions', requireAuth, upload.array('files', 10), async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const userId = getUserId(req);
    const assignedToId = (task.assignedTo as any)?.toString?.() ?? String(task.assignedTo);

    if (assignedToId !== userId) {
      return res.status(403).json({ error: 'Can only submit your own tasks' });
    }

    const files = (req.files as Express.Multer.File[] | undefined) || [];

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { progress: 100, status: 'completed' },
      { new: true }
    );

    res.json({
      ok: true,
      files: files.map(f => ({
        filename: f.filename,
        url: `/uploads/${f.filename}`
      })),
      task: updatedTask
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Submission error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
