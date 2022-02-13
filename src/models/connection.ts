/* eslint-disable no-console */
import { createConnection } from 'typeorm';

import EnvConfig from '../utils/Env';

createConnection({
  type: 'postgres',
  url: new EnvConfig().databaseURL,
  ssl: true,
  synchronize: true,
}).catch(console.error);
