import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';

import userRepository from '../repositories/user';

interface UserServicesParams {
    repository: { user: typeof userRepository };
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

if (process.env.NODE_ENV === 'development') {
  (async () => {
    const repo = await userRepository();
    const admin = repo.create({
      name: 'Frank',
      email: 'frank@okezie.com',
      password: 'test',
      role: 'admin',
    });
    await repo.save(admin);
  })();
}

export default class UserServices implements UserServicesParams {
  repository: { user: typeof userRepository };

  constructor(repository = { user: userRepository }) {
    this.repository = repository;
    this.signupUser = this.signupUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.authUser = this.authUser.bind(this);
  }

  async signupUser(arg: SignupParam) {
    const repo = await this.repository.user();
    const newUser = repo.create(arg);
    await repo.save(newUser);
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
    };
    return ajv.compile(schema)(arg);
  }

  async loginUser({ email, password }: LoginParams) {
    await UserServices.validateLoginArg({ email, password });
    const repo = await this.repository.user();
    const userExists = await repo.findOneOrFail({ where: { email } });
    await userExists.validatePassword(password);
    return { message: 'Registered user successfully signed in', data: { ...userExists, password: undefined } };
  }

  static async validateId(id: string) {
    const schema: JSONSchemaType<string> = {
      $async: true,
      type: 'string',
      format: 'uuid',
    };
    return ajv.compile(schema)(id);
  }

  async authUser(id: string) {
    await UserServices.validateId(id);
    const repo = await this.repository.user();
    return repo.findOneOrFail({ where: { id } });
  }
}
