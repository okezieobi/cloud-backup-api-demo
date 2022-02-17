import { Router } from 'express';

import Controller from '../controllers/File';
import fileUploader from '../controllers/fileUploader';

const { saveFile, dispatchResponse } = new Controller();

const router = Router();

router.post('/save', saveFile, dispatchResponse);
router.post('/upload', fileUploader.any(), Controller.sendMediaResponse);

export default { router };
