import { EntityRepository, Repository } from 'typeorm';

import connection, { UserEntity } from '../entities';
import AppError from '../errors';

@EntityRepository(UserEntity)
class UserRepository extends Repository<UserEntity> {
  async verifyPryKey(key: string) {
    const user = await this.findOneOrFail({ where: { id: key } });
    if (user == null) {
      throw new AppError('Verified user id from jwt not found, please sign up by creating an account', 'Authorization', { msg: 'User id not found, user authorization failed' });
    }
    return user;
  }

  async verifyEmail(email: string) {
    const user = await this.findOneOrFail({ where: { email } });
    if (user == null) {
      throw new AppError(`Registered user with '${email}' does not exist, please sign up`, 'Query', { param: 'email', value: email, msg: 'User email not found, email verification failed' });
    }
    return user;
  }
}

export default async () => {
  const resolvedConnection = await (await connection());
  return resolvedConnection.getCustomRepository(UserRepository);
};
