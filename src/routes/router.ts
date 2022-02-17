import { Router } from 'express';

import userRoutes from './user';
import fileRoutes from './file';

const router = Router();
router.use('/auth', userRoutes.authRouter);
router.use(userRoutes.authUser);
router.use('/files', fileRoutes.router);

export default router;
