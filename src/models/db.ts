import pgPromise from 'pg-promise';
import promise from 'bluebird';
import { join as joinPath } from 'path';

import dotenv from 'dotenv';

dotenv.config();

const options = {
  promiseLib: promise,
};

const pgp = pgPromise(options);

// sudo -u postgres createuser <user> -P -s -e
// sudo -u postgres createdb movie-api-demo

export default {
  db: pgp({
    ssl: { rejectUnauthorized: false },
    connectionString: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DEV_DATABASE_URL,
  }),
  sql(file: string) {
    const fullPath = joinPath(__dirname, file);
    return new pgp.QueryFile(fullPath, { minify: true });
  },
};
