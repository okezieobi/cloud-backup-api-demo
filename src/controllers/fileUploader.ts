import { v2 } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

import Env from '../utils/Env';

const env = new Env();

v2.config({
  ...env.cloudinary,
});

const storage = new CloudinaryStorage({
  cloudinary: v2,
});

export default multer({
  storage,
});
