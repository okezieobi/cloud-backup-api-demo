import { Router } from 'express';

import Controller from '../controllers/File';
import fileUploader from '../controllers/fileUploader';
import UserController from '../controllers/User';

const {
  saveOne, listAllForAdmin, listAll, dispatchResponse, verifyOne, verifyOneForAdmin,
} = new Controller();

const router = Router();

router.get('/', listAll, dispatchResponse);
router.post('/save', saveOne, dispatchResponse);
router.post('/upload', fileUploader.any(), Controller.sendMediaResponse);

router.get('/:id', verifyOne);

router.get('/:id', Controller.getOne, dispatchResponse);
router.use(UserController.isAdmin);
router.get('/all', listAllForAdmin, dispatchResponse);
router.get('/all/:id', verifyOneForAdmin);
router.get('/all/:id', Controller.getOne, dispatchResponse);

export default { router };
