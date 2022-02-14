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
  params: {
    folder: 'folder',
    allowed_formats: ['png', 'jpeg', 'jpg', 'gif', 'bmp'],
  },
});

export default multer({
  storage,
  limits: { fileSize: 200000000 },
});
