import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest, optionalAuth } from '../middleware/auth';

const router = Router();

// Course detection map
const courseMap: Record<string, string> = {
  'cse': 'CSE',
  'computer science': 'CSE',
  'computer': 'CSE',
  'software': 'CSE',
  'it': 'CSE',
  'ece': 'ECE',
  'electronics': 'ECE',
  'ai': 'AI & DS',
  'artificial intel': 'AI & DS',
  'artificial intelligence': 'AI & DS',
  'mechanical': 'Mechanical',
  'mech': 'Mechanical',
  'data science': 'Data Science',
  'electrical': 'Electrical',
  'eee': 'Electrical',
};

// Location to state map
const locationMap: Record<string, string> = {
  'delhi': 'Delhi',
  'mumbai': 'Maharashtra',
  'bombay': 'Maharashtra',
  'maharashtra': 'Maharashtra',
  'karnataka': 'Karnataka',
  'bengaluru': 'Karnataka',
  'bangalore': 'Karnataka',
  'tamil nadu': 'Tamil Nadu',
  'chennai': 'Tamil Nadu',
  'rajasthan': 'Rajasthan',
  'kolkata': 'West Bengal',
  'west bengal': 'West Bengal',
  'uttar pradesh': 'Uttar Pradesh',
  'kanpur': 'Uttar Pradesh',
  'up': 'Uttar Pradesh',
  'vellore': 'Tamil Nadu',
  'trichy': 'Tamil Nadu',
  'tiruchirappalli': 'Tamil Nadu',
};

// POST /api/search
router.post('/', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, userId } = req.body;

    if (!query) {
      res.status(400).json({ error: 'Search query is required.' });
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Extract course filter
    let courseFilter: string | null = null;
    for (const [keyword, course] of Object.entries(courseMap)) {
      if (lowerQuery.includes(keyword)) {
        courseFilter = course;
        break;
      }
    }

    // Extract location filter
    let locationFilter: string | null = null;
    for (const [keyword, state] of Object.entries(locationMap)) {
      if (lowerQuery.includes(keyword)) {
        locationFilter = state;
        break;
      }
    }

    // Extract fees filter (supports integers, decimals, "lakh", "lakhs", "l", "within", "budget of")
    let maxFeesFilter: number | null = null;
    const feesMatch = lowerQuery.match(/(?:under|below|less than|budget of|within|cheaper than)\s+(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l)/);
    if (feesMatch) {
      maxFeesFilter = parseFloat(feesMatch[1]) * 100000;
    }

    // Determine sort
    let sortBy = 'rating';
    let orderBy: any = { rating: 'desc' };

    if (lowerQuery.includes('placement') || lowerQuery.includes('placements')) {
      sortBy = 'placement';
      orderBy = { placementPercentage: 'desc' };
    } else if (lowerQuery.includes('package') || lowerQuery.includes('salary') || lowerQuery.includes('highest')) {
      sortBy = 'package';
      orderBy = { averagePackageLpa: 'desc' };
    } else if (lowerQuery.includes('fees') || lowerQuery.includes('cheap') || lowerQuery.includes('affordable') || lowerQuery.includes('economical') || lowerQuery.includes('budget')) {
      sortBy = 'fees';
      orderBy = { fees: 'asc' };
    } else if (lowerQuery.includes('rank') || lowerQuery.includes('nirf') || lowerQuery.includes('best') || lowerQuery.includes('top')) {
      sortBy = 'rank';
      orderBy = { nirfRank: 'asc' };
    }

    // Build Prisma where clause
    const where: any = {};

    if (courseFilter) {
      where.courses = {
        some: {
          course: {
            name: { equals: courseFilter, mode: 'insensitive' }
          }
        }
      };
    }

    if (locationFilter) {
      where.state = { equals: locationFilter, mode: 'insensitive' };
    }

    if (maxFeesFilter) {
      where.fees = { lte: maxFeesFilter };
    }

    // Fallback general text search if no specific filters extracted
    if (!courseFilter && !locationFilter && !maxFeesFilter) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { state: { contains: query, mode: 'insensitive' } }
      ];
    }

    const results = await prisma.college.findMany({
      where,
      include: {
        courses: {
          include: { course: true }
        }
      },
      orderBy
    });

    // Save search history if user is authenticated
    const effectiveUserId = userId || req.userId;
    if (effectiveUserId) {
      await prisma.searchHistory.create({
        data: {
          userId: effectiveUserId,
          query
        }
      });
    }

    res.json({
      message: 'Here are the best matching colleges',
      filters: {
        course: courseFilter,
        location: locationFilter,
        maxFees: maxFeesFilter,
        sortBy
      },
      results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed.' });
  }
});

// GET /api/search/history/:userId
router.get('/history/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    if (req.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to view this history.' });
      return;
    }

    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { searchedAt: 'desc' },
      take: 10
    });

    res.json(history);
  } catch (error) {
    console.error('Search history error:', error);
    res.status(500).json({ error: 'Failed to fetch search history.' });
  }
});

export default router;
