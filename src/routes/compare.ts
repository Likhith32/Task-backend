import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/compare - get multiple colleges for comparison
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { collegeIds } = req.body;
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      res.status(400).json({ error: 'Provide at least 2 college IDs.' }); return;
    }
    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: { courses: { include: { course: true } }, rankCutoffs: { include: { course: true } } }
    });
    res.json(colleges);
  } catch (error) { res.status(500).json({ error: 'Comparison failed.' }); }
});

export default router;
