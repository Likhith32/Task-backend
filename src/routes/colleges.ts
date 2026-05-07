import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, optionalAuth } from '../middleware/auth';

const router = Router();

// GET /api/colleges
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      state,
      course,
      minFees,
      maxFees,
      page = '1',
      limit = '9',
      sortBy = 'rating'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' };
    }

    if (state) {
      where.state = { equals: state as string, mode: 'insensitive' };
    }

    if (course) {
      where.courses = {
        some: {
          course: {
            name: { equals: course as string, mode: 'insensitive' }
          }
        }
      };
    }

    if (minFees) {
      where.fees = { ...where.fees, gte: parseInt(minFees as string) };
    }

    if (maxFees) {
      where.fees = { ...where.fees, lte: parseInt(maxFees as string) };
    }

    // Sort
    let orderBy: any = { rating: 'desc' };
    switch (sortBy) {
      case 'fees_asc':
        orderBy = { fees: 'asc' };
        break;
      case 'fees_desc':
        orderBy = { fees: 'desc' };
        break;
      case 'nirf':
        orderBy = { nirfRank: 'asc' };
        break;
      case 'placement':
        orderBy = { placementPercentage: 'desc' };
        break;
      case 'rating':
      default:
        orderBy = { rating: 'desc' };
        break;
    }

    const [data, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: {
          courses: {
            include: { course: true }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.college.count({ where })
    ]);

    res.json({
      data,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ error: 'Failed to fetch colleges.' });
  }
});

// GET /api/colleges/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid college ID.' });
      return;
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: {
          include: { course: true }
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { id: true, name: true } }
          }
        },
        rankCutoffs: {
          include: {
            course: true
          }
        }
      }
    });

    if (!college) {
      res.status(404).json({ error: 'College not found.' });
      return;
    }

    res.json(college);
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ error: 'Failed to fetch college details.' });
  }
});

// POST /api/colleges/:id/reviews
router.post('/:id/reviews', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collegeId = parseInt(req.params.id as string);
    const { rating, title, body } = req.body;

    if (!body || !rating) {
      res.status(400).json({ error: 'Rating and review body are required.' });
      return;
    }

    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      res.status(404).json({ error: 'College not found.' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        collegeId,
        userId: req.userId || null,
        rating: parseFloat(rating),
        title: title || null,
        body
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review.' });
  }
});

export default router;
