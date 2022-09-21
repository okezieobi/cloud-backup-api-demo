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
  // eslint-disable-next-line no-unused-vars
  params: async ({ body: { folder = 'default' } }, file) => ({
    folder: `cloud-api-demo/${folder}`,
  }),
});

export default multer({
  storage,
  limits: { fileSize: 200000000 },
});
