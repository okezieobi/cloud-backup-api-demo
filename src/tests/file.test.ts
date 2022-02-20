import { fileRepository, userRepository } from '../entities';
import FileServices, { SaveFileParams } from '../services/File';

describe('File management tests', () => {
  const user = {
    name: 'test-username',
    email: 'test-flie@email.com',
    password: 'test-password',
  };

  const file: SaveFileParams = {
    info: [
      { test: 'test' },
    ],
    user: {},
  };

  beforeAll(async () => {
    const userRepo = await userRepository();
    const fileRepo = await fileRepository();

    await fileRepo.delete({});

    const registeredUser = userRepo.create(user);
    await userRepo.save(registeredUser);

    file.user = registeredUser;
    const savedFile = fileRepo.create(file);
    await fileRepo.save(savedFile);
  });

  describe('Testing new file saving on database', () => {
    it('Saves a new file on a database', async () => {
      const { saveOne } = new FileServices();
      const { message } = await saveOne(file);
      expect(message).toBeString();
      expect(message).toEqual('New file successfully saved');
    });
  });
});
