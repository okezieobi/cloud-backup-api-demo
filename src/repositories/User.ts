import { EntityRepository, Repository } from 'typeorm';

import connection, { UserEntity } from '../entities';

@EntityRepository(UserEntity)
class UserRepository extends Repository<UserEntity> {
  // async verifyPryKey(key: string) {
  //   return this.findOneOrFail({ where: { id: key } });
  // }
}

export default async () => {
  const resolvedConnection = await (await connection());
  return resolvedConnection.getCustomRepository(UserRepository);
};
