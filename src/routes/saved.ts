import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/colleges', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.body;
    const userId = req.userId!;
    if (!collegeId) { res.status(400).json({ error: 'collegeId is required.' }); return; }
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) { res.status(404).json({ error: 'College not found.' }); return; }
    const existing = await prisma.savedCollege.findUnique({ where: { userId_collegeId: { userId, collegeId } } });
    if (existing) { res.json(existing); return; }
    const saved = await prisma.savedCollege.create({
      data: { userId, collegeId },
      include: { college: { include: { courses: { include: { course: true } } } } }
    });
    res.status(201).json(saved);
  } catch (error) { console.error('Save college error:', error); res.status(500).json({ error: 'Failed to save college.' }); }
});

router.delete('/colleges/:collegeId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collegeId = parseInt(req.params.collegeId);
    const userId = req.userId!;
    await prisma.savedCollege.deleteMany({ where: { userId, collegeId } });
    res.json({ message: 'College unsaved successfully.' });
  } catch (error) { res.status(500).json({ error: 'Failed to unsave college.' }); }
});

router.get('/colleges', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: req.userId! },
      include: { college: { include: { courses: { include: { course: true } } } } },
      orderBy: { savedAt: 'desc' }
    });
    res.json(saved);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch saved colleges.' }); }
});

router.post('/comparisons', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { collegeIds, label } = req.body;
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 3) {
      res.status(400).json({ error: 'collegeIds must be an array of 2 or 3 IDs.' }); return;
    }
    const comparison = await prisma.savedComparison.create({ data: { userId: req.userId!, collegeIds, label: label || null } });
    res.status(201).json(comparison);
  } catch (error) { res.status(500).json({ error: 'Failed to save comparison.' }); }
});

router.get('/comparisons', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comparisons = await prisma.savedComparison.findMany({ where: { userId: req.userId! }, orderBy: { savedAt: 'desc' } });
    const enriched = await Promise.all(comparisons.map(async (comp) => {
      const colleges = await prisma.college.findMany({ where: { id: { in: comp.collegeIds } }, include: { courses: { include: { course: true } } } });
      return { ...comp, colleges };
    }));
    res.json(enriched);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch comparisons.' }); }
});

router.delete('/comparisons/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.savedComparison.deleteMany({ where: { id: parseInt(req.params.id), userId: req.userId! } });
    res.json({ message: 'Comparison deleted successfully.' });
  } catch (error) { res.status(500).json({ error: 'Failed to delete comparison.' }); }
});

export default router;
