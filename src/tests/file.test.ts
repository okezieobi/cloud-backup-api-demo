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

  let fileForTesting: any;

  beforeAll(async () => {
    const userRepo = await userRepository();
    const fileRepo = await fileRepository();

    await fileRepo.delete({});
    await userRepo.delete({});

    const registeredUser = userRepo.create(user);
    await userRepo.save(registeredUser);

    file.user = registeredUser;
    const savedFile = fileRepo.create(file);
    await fileRepo.save(savedFile);
    fileForTesting = savedFile;
  });

  describe('Testing new file saving on database', () => {
    it('Saves a new file on a database', async () => {
      const { saveOne } = new FileServices();
      const { message, data } = await saveOne(file);
      expect(message).toBeString();
      expect(message).toEqual('New file successfully saved');
      expect(data).toBeObject();
      expect(data).toContainKeys(['id', 'info', 'isSafe', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.info).toBeArray();
      expect(data.isSafe).toBeBoolean();
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });

  describe('Testing files listing', () => {
    it('List saved files using parameters', async () => {
      const { listAll } = new FileServices();
      const { message, data } = await listAll({ isSafe: true });
      expect(message).toBeString();
      expect(message).toEqual('Files retrieved successfully');
      expect(data).toBeArray();
    });
  });

  describe('Testing verifying file', () => {
    it('Verify file with id', async () => {
      const { verifyOne } = new FileServices();
      const data = await verifyOne({ id: fileForTesting.id });
      expect(data).toBeObject();
      expect(data).toContainKeys(['id', 'info', 'isSafe', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.info).toBeArray();
      expect(data.isSafe).toBeBoolean();
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });

  describe('Testing updating file safe property ie isSafe', () => {
    it('Update file by id', async () => {
      const { updateSafeProp } = new FileServices();
      const { message, data } = await updateSafeProp({ isSafe: true, file: fileForTesting });
      expect(message).toBeString();
      expect(message).toEqual('File safe property ie isSafe updated to true');
      expect(data).toBeObject();
      expect(data).toContainKeys(['id', 'info', 'isSafe', 'createdAt', 'updatedAt']);
      expect(data!.id).toBeString();
      expect(data!.info).toBeArray();
      expect(data!.isSafe).toBeBoolean();
      expect(data!.createdAt).toBeDate();
      expect(data!.updatedAt).toBeDate();
    });
  });
});
