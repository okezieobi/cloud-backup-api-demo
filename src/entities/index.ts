/* eslint-disable no-console */
import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

import Env from '../utils/Env';
import UserEntity from './User';

export default async () => {
  let connection;
  const options: ConnectionOptions = {
    type: 'postgres',
    url: new Env().databaseURL,
    ssl: false,
    synchronize: true,
    dropSchema: process.env.NODE_ENV === 'development',
    entities: [UserEntity],
  };
  try {
    connection = await getConnection();
  } catch (e) {
    connection = await createConnection(options);
  }
  return connection;
};

export { UserEntity };
