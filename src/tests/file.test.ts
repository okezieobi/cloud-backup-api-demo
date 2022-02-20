// import { fileRepository, userRepository } from '../entities';
// import FileServices, { SaveFileParams } from '../services/File';

// describe('File management tests', () => {
//   const user = {
//     name: 'test-username',
//     email: 'test@email.com',
//     password: 'test-password',
//   };

//   const file: SaveFileParams = {
//     info: [
//       { test: 'test' },
//     ],
//     user: {},
//   };

//   beforeAll(async () => {
//     const userRepo = await userRepository();
//     const fileRepo = await fileRepository();

//     await fileRepo.delete({});
//     await userRepo.delete({});

//     const registeredUser = userRepo.create(user);
//     await userRepo.save(registeredUser);

//     file.user = registeredUser;
//     const file;
//     await fileRepo.save();
//   });

//   describe('Testing new file saving on database', () => {
//     it('Saves a new file on a database', async () => {
//       const { saveOne } = new FileServices();
//     });
//   });
// });
