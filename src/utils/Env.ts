import { config } from 'dotenv';

config();

export default class EnvConfig {
  databaseURL: string | undefined;

  cloudinary: {
    cloud_name: string | undefined,
    api_key: string | undefined, api_secret: string | undefined
  };

  jwtSecret: string | undefined;

  constructor() {
    this.cloudinary = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
    this.jwtSecret = process.env.JWT_SECRET;
    this.databaseURL = process.env.NODE_ENV === 'testing' ?? process.env.NODE_ENV === 'testing-in-ci' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL ?? process.env.DEV_DATABASE_URL;
  }
}
