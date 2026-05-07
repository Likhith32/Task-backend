import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/predictor
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { exam, rank, category = 'General' } = req.body;

    if (!exam || !rank) {
      res.status(400).json({ error: 'Exam and rank are required.' });
      return;
    }

    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum < 1) {
      res.status(400).json({ error: 'Rank must be a positive number.' });
      return;
    }

    // Handle IISc special case: accept both "JEE Advanced" and "KVPY"
    const examFilter: any = {
      equals: exam,
      mode: 'insensitive'
    };

    const cutoffs = await prisma.rankCutoff.findMany({
      where: {
        exam: examFilter,
        minRank: { lte: rankNum },
        maxRank: { gte: rankNum },
        category: { equals: category, mode: 'insensitive' }
      },
      include: {
        college: {
          include: {
            courses: {
              include: { course: true }
            }
          }
        },
        course: true
      },
      orderBy: {
        college: { nirfRank: 'asc' }
      }
    });

    const results = cutoffs.map(cutoff => ({
      college: cutoff.college,
      matchedCourse: cutoff.course?.name || 'Unknown',
      cutoffRange: {
        min: cutoff.minRank,
        max: cutoff.maxRank
      }
    }));

    res.json({
      message: results.length > 0
        ? 'Here are colleges matching your rank'
        : 'No colleges found for this rank and exam combination',
      results
    });
  } catch (error) {
    console.error('Predictor error:', error);
    res.status(500).json({ error: 'Prediction failed.' });
  }
});

export default router;
