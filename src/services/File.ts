import { fileRepository } from '../entities';
import VerifyOneValidator, { VerifyOneParams } from '../validators/File.verifyOne';
import ListFilesValidator, { ListFilesParams } from '../validators/File.list';
import IdValidator from '../validators/Id';

interface FileServicesParams {
  repository: { file: typeof fileRepository };
  validator: {
    file: {
      VerifyOne: typeof VerifyOneValidator,
      List: typeof ListFilesValidator,
    }
  }
}

interface SaveFileParams {
    user: object;
    info: object[];
}

interface UpdateFileParams {
  file: { isSafe: boolean, id: string, info: object[], createdAt: Date, updatedAt: Date };
  isSafe: boolean;
}

export default class FileServices implements FileServicesParams {
  repository: { file: typeof fileRepository };

  validator: {
    file: {
      VerifyOne: typeof VerifyOneValidator,
      List: typeof ListFilesValidator,
    }
  };

  constructor(
    repository = { file: fileRepository },
    validator = {
      file: {
        VerifyOne: VerifyOneValidator,
        List: ListFilesValidator,
      },
    },
  ) {
    this.repository = repository;
    this.validator = validator;
    this.saveOne = this.saveOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.updateSafeProp = this.updateSafeProp.bind(this);
  }

  async saveOne(arg: SaveFileParams) {
    const repo = await this.repository.file();
    const newFile = await repo.create(arg);
    await repo.save(newFile);
    return { message: 'New file successfully saved', data: { ...newFile, user: undefined } };
  }

  async listAll({ user, isSafe }: ListFilesParams) {
    await new this.validator.file.List(isSafe, user).validate({ forbidUnknownValues: true });
    const repo = await this.repository.file();
    let data;
    if (user == null) data = await repo.find({ where: { isSafe } });
    else data = await repo.find({ where: { user, isSafe } });
    return { message: 'Files retrieved successfully', data };
  }

  async verifyOne({ id, user }: VerifyOneParams) {
    await new IdValidator(id).validate({ forbidUnknownValues: true });
    const repo = await this.repository.file();
    if (user == null) return repo.findOneOrFail({ where: { id } });
    return repo.findOneOrFail({ where: { user, id } });
  }

  async updateSafeProp({ file, isSafe }: UpdateFileParams) {
    const repo = await this.repository.file();
    const placeHolder = file;
    placeHolder.isSafe = isSafe ?? placeHolder.isSafe;
    await repo.save(placeHolder);
    if (isSafe) return { message: 'File safe property ie isSafe updated to true', data: placeHolder };
    await repo.delete({ id: placeHolder.id });
    return { message: 'File safe property ie isSafe updated to false, file automatically deleted' };
  }
}

export { SaveFileParams };
