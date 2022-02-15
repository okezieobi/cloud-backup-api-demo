import userRepositories from '../repositories/user';
import UserServices from '../services/User';

describe('User tests', () => {
  const user = {
    name: 'test-username',
    email: 'test@email.com',
    password: 'test-password',
  };

  //   const userReq = {
  //     email: 'test@email.com',
  //     password: 'test-password',
  //   };

  //   const user404 = {
  //     name: 'test-username-fake',
  //     email: 'test-fake@email.com',
  //     password: 'test-password',
  //     phone: '0812345675',
  //   };

  //   const user404Req = {
  //     email: 'test-fake@email.com',
  //     password: 'test-password',
  //   };

  const newUser = {
    name: 'test-username-new',
    email: 'test-new@email.com',
    password: 'test-password',
  };

  beforeAll(async () => {
    const repo = await (await userRepositories());
    await repo.clear();
    await repo.save(user);
  });

  describe('Testing new user creation', () => {
    it('Should create new user', async () => {
      const { signupUser } = new UserServices();
      const { message, data } = await signupUser(newUser);
      expect(message).toBeString();
      expect(message).toEqual('New user successfully signed up');
      expect(data).toBeObject();
      expect(data).toContainKeys(['name', 'email', 'id', 'role', 'createDate', 'updateDate']);
      expect(data.id).toBeString();
      expect(data.name).toBeString();
      expect(data.name).toEqual(newUser.name);
      expect(data.email).toBeString();
      expect(data.email).toEqual(newUser.email);
      expect(data.role).toBeString();
      expect(data.role).toEqual('Client');
      expect(data.createDate).toBeString();
      expect(data.updateDate).toBeString();
    });
  });

  describe('Testing registered user signing in', () => {
    it('Signs in registered user', async () => {
      const { loginUser } = new UserServices();
      const { message, data } = await loginUser(user);
      expect(message).toBeString();
      expect(message).toEqual('Registered user successfully signed in');
      expect(data).toBeObject();
      expect(data).toContainKeys(['name', 'email', 'id', 'role', 'createDate', 'updateDate']);
      expect(data.id).toBeString();
      expect(data.name).toBeString();
      expect(data.name).toEqual(newUser.name);
      expect(data.email).toBeString();
      expect(data.email).toEqual(newUser.email);
      expect(data.role).toBeString();
      expect(data.role).toEqual('Client');
      expect(data.createDate).toBeString();
      expect(data.updateDate).toBeString();
    });
  });
});
