import { Router } from 'express';

import userRoutes from './user';
import fileUploader from '../controllers/fileUploader';

const router = Router();
router.use('/auth', userRoutes.authRouter);
router.use('/media', fileUploader.any());

export default router;
