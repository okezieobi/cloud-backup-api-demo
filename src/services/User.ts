import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';

import UserRepository from '../repositories/User';

interface UserServicesParams {
    repository: { User: typeof UserRepository };
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
  repository: { User: typeof UserRepository };

  constructor(repository = { User: UserRepository }) {
    this.repository = repository;
    this.signupUser = this.signupUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  async signupUser(arg: SignupParam) {
    const repo = await (await this.repository.User());
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
      additionalProperties: false,
    };
    return ajv.compile(schema)(arg);
  }

  async loginUser({ email, password }: LoginParams) {
    await UserServices.validateLoginArg({ email, password });
    const repo = await (await this.repository.User());
    const userExists = await repo.findOneOrFail({ where: { email } });
    await userExists.validatePassword(password);
    return { message: 'Registered user successfully signed in', data: { ...userExists, password: undefined } };
  }
}
