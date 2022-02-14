import { Router } from 'express';

import userRoutes from './user';
import fileUploader from '../controllers/fileUploader';
import Controller from '../controllers';

const router = Router();
router.use('/auth', userRoutes.authRouter);
router.use(userRoutes.authUser);
router.use('/media', fileUploader.any(), Controller.sendMediaResponse);

export default router;
