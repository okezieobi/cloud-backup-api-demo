/* eslint-disable no-console */
import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

import Env from '../utils/Env';
import UserEntity from './User';

export default async () => {
  let connection;
  const options: ConnectionOptions = {
    type: 'postgres',
    name: 'test',
    url: new Env().databaseURL,
    ssl: { rejectUnauthorized: false },
    synchronize: true,
    dropSchema: true,
    entities: [UserEntity],
  };
  try {
    connection = await getConnection('test');
  } catch (e) {
    connection = await createConnection(options);
  }
  return connection;
};

export { UserEntity };
