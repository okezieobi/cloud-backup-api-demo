/* eslint-disable no-console */
import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

import Env from '../utils/Env';
import UserEntity from './User';
import FileEntity from './File';

const connection = async () => {
  let initializedConnection;
  const options: ConnectionOptions = {
    type: 'postgres',
    url: new Env().databaseURL,
    ssl: process.env.NODE_ENV === 'testing-in-ci' ? false : { rejectUnauthorized: false },
    synchronize: true,
    dropSchema: process.env.NODE_ENV === 'development',
    entities: [UserEntity, FileEntity],
  };
  try {
    initializedConnection = await getConnection();
  } catch (e) {
    initializedConnection = await createConnection(options);
  }
  return initializedConnection;
};

const userRepository = async () => {
  const resolvedConnection = await await connection();
  return resolvedConnection.getRepository(UserEntity);
};

const fileRepository = async () => {
  const resolvedConnection = await await connection();
  return resolvedConnection.getRepository(FileEntity);
};

export default connection;

export { userRepository, fileRepository };
