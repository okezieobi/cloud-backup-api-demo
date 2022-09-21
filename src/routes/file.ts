import { Router } from 'express';

import Controller from '../controllers/File';
import fileUploader from '../controllers/fileUploader';

const {
  saveOne, listAllForAdmin, listAll, dispatchResponse, verifyOne, verifyOneForAdmin, updateSafeProp,
} = new Controller();

const router = Router();
const adminRouter = Router();

router.get('/', listAll, dispatchResponse);
router.post('/save', saveOne, dispatchResponse);
router.post('/upload', fileUploader.any(), Controller.sendMediaResponse);
router.use('/:id', verifyOne);
router.get('/:id', Controller.getOne, dispatchResponse);

adminRouter.get('/', listAllForAdmin, dispatchResponse);
adminRouter.use('/:id', verifyOneForAdmin);
adminRouter.get('/:id', Controller.getOne, dispatchResponse);
adminRouter.put('/:id', updateSafeProp, dispatchResponse);

export default { router, adminRouter };
