import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/questions', async (req: any, res: Response): Promise<void> => {
  try {
    const { collegeId, page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const where: any = {};
    if (collegeId) where.collegeId = parseInt(collegeId);
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where, include: {
          user: { select: { id: true, name: true } },
          college: { select: { id: true, name: true, shortName: true } },
          _count: { select: { answers: true } }
        },
        orderBy: { createdAt: 'desc' }, skip: (pageNum - 1) * limitNum, take: limitNum
      }),
      prisma.question.count({ where })
    ]);
    res.json({ data: questions, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch questions.' }); }
});

router.post('/questions', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, body, collegeId } = req.body;
    if (!title) { res.status(400).json({ error: 'Title is required.' }); return; }
    const question = await prisma.question.create({
      data: { title, body: body || null, collegeId: collegeId || null, userId: req.userId! },
      include: { user: { select: { id: true, name: true } }, college: { select: { id: true, name: true, shortName: true } } }
    });
    res.status(201).json(question);
  } catch (error) { res.status(500).json({ error: 'Failed to create question.' }); }
});

router.get('/questions/:id', async (req: any, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const question = await prisma.question.findUnique({
      where: { id }, include: {
        user: { select: { id: true, name: true } },
        college: { select: { id: true, name: true, shortName: true } },
        answers: { include: { user: { select: { id: true, name: true } } }, orderBy: [{ isAccepted: 'desc' }, { createdAt: 'asc' }] }
      }
    });
    if (!question) { res.status(404).json({ error: 'Question not found.' }); return; }
    res.json(question);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch question.' }); }
});

router.post('/questions/:id/answers', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const questionId = parseInt(req.params.id);
    const { body } = req.body;
    if (!body) { res.status(400).json({ error: 'Answer body is required.' }); return; }
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) { res.status(404).json({ error: 'Question not found.' }); return; }
    const answer = await prisma.answer.create({
      data: { questionId, body, userId: req.userId! },
      include: { user: { select: { id: true, name: true } } }
    });
    res.status(201).json(answer);
  } catch (error) { res.status(500).json({ error: 'Failed to post answer.' }); }
});

router.patch('/answers/:id/accept', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const answerId = parseInt(req.params.id);
    const answer = await prisma.answer.findUnique({ where: { id: answerId }, include: { question: true } });
    if (!answer) { res.status(404).json({ error: 'Answer not found.' }); return; }
    if (answer.question.userId !== req.userId) { res.status(403).json({ error: 'Only the question author can accept answers.' }); return; }
    const updated = await prisma.answer.update({ where: { id: answerId }, data: { isAccepted: true }, include: { user: { select: { id: true, name: true } } } });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to accept answer.' }); }
});

export default router;
