/* eslint-disable no-console */
import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

import Env from '../utils/Env';
import UserEntity from './User';
import FileEntity from './File';

export default async () => {
  let connection;
  const options: ConnectionOptions = {
    type: 'postgres',
    url: new Env().databaseURL,
    ssl: process.env.NODE_ENV === 'testing-in-ci' ? false : { rejectUnauthorized: false },
    synchronize: true,
    dropSchema: process.env.NODE_ENV === 'development',
    entities: [UserEntity, FileEntity],
  };
  try {
    connection = await getConnection();
  } catch (e) {
    connection = await createConnection(options);
  }
  return connection;
};

export { UserEntity, FileEntity };
