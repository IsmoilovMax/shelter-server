import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.routes';

export const router = Router();

router.use('/auth', authRouter);

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Health check' });
});

