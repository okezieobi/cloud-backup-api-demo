import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';
import { createConnection } from 'typeorm';

import UserRepository from '../repositories/User';
import UserEntity from '../entities/User';
import Env from '../utils/Env';

interface UserServicesParams {
    DAL: {
        User: {
            Repository: typeof UserRepository,
            Entity: typeof UserEntity,
        }
    };
}

interface LoginParams {
    email: string;
    password: string;
}

interface SignupParam extends LoginParams {
    name: string;
}

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);
ajvKeywords(ajv);

export default class UserServices implements UserServicesParams {
  DAL: {
        User: {
            Repository: typeof UserRepository,
            Entity: typeof UserEntity,
        }
    };

  constructor(DAL = {
    User: {
      Repository: UserRepository,
      Entity: UserEntity,
    },
  }) {
    this.DAL = DAL;
    this.signupUser = this.signupUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  async startConnection() {
    const connection = await createConnection({
      type: 'postgres',
      name: 'test',
      url: new Env().databaseURL,
      ssl: { rejectUnauthorized: false },
      synchronize: true,
      entities: [this.DAL.User.Entity],
    });
    return connection.getCustomRepository(this.DAL.User.Repository);
  }

  async signupUser(arg: SignupParam) {
    const userRepo = await this.startConnection();
    const newUser = userRepo.create(arg);
    await userRepo.save(newUser);
    return { message: 'New user successfully signed up', data: { ...newUser, password: undefined } };
  }

  static async validateLoginArg(arg: LoginParams) {
    const schema: JSONSchemaType<LoginParams> = {
      $async: true,
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    };
    return schema.compile(arg);
  }

  async loginUser({ email, password }: LoginParams) {
    await UserServices.validateLoginArg({ email, password });
    const userRepo = await this.startConnection();
    const userExists = await userRepo.verifyEmail(email);
    await userExists.validatePassword(password);
    return { message: 'Registered user successfully signed in', data: { ...userExists, password: undefined } };
  }
}
