import { Router } from 'express';

import Controller from '../controllers/File';
import fileUploader from '../controllers/fileUploader';
import UserController from '../controllers/User';

const {
  saveFile, listFIlesForAdmin, listFiles, dispatchResponse,
} = new Controller();

const router = Router();

router.post('/save', saveFile, dispatchResponse);
router.post('/upload', fileUploader.any(), Controller.sendMediaResponse);
router.get('/', listFiles, dispatchResponse);

router.use(UserController.isAdmin);
router.get('/all', listFIlesForAdmin, dispatchResponse);

export default { router };
