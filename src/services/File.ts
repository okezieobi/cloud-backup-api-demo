import { validateOrReject } from 'class-validator';
import { fileRepository } from '../entities';
import VerifyOneValidator, { VerifyOneParams } from '../validators/File.verifyOne';
import ListFilesValidator, { ListFilesParams } from '../validators/File.list';
import IdValidator, {} from '../validators/Id';

interface FileServicesParams {
  repository: { file: typeof fileRepository };
  validator: { file: { VerifyOne: typeof VerifyOneValidator, List: typeof ListFilesValidator }}
}

interface SaveFileParams {
    user: object;
    info: object[];
}

export default class FileServices implements FileServicesParams {
  repository: { file: typeof fileRepository };

  validator: { file: { VerifyOne: typeof VerifyOneValidator, List: typeof ListFilesValidator }};

  constructor(
    repository = { file: fileRepository },
    validator = { file: { VerifyOne: VerifyOneValidator, List: ListFilesValidator } },
  ) {
    this.repository = repository;
    this.validator = validator;
    this.saveOne = this.saveOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
  }

  async saveOne(arg: SaveFileParams) {
    const repo = await this.repository.file();
    const newFile = await repo.create(arg);
    await repo.save(newFile);
    return { message: 'New file successfully saved', data: { ...newFile, user: undefined } };
  }

  async listAll({ user, isSafe }: ListFilesParams) {
    const arg = new this.validator.file.List(isSafe, user);
    await validateOrReject(
      arg,
      { forbidUnknownValues: true },
    );
    const repo = await this.repository.file();
    let data: any;
    if (user == null) data = await repo.find({ where: { isSafe } });
    else data = await repo.find({ where: { user, isSafe } });
    return { message: 'Files retrieved successfully', data };
  }

  async verifyOne({ id, user }: VerifyOneParams) {
    const arg = new IdValidator(id);
    await validateOrReject(
      arg,
      { forbidUnknownValues: true },
    );
    const repo = await this.repository.file();
    if (user == null) return repo.findOneOrFail({ where: { id } });
    return repo.findOneOrFail({ where: { user, id } });
  }
}

export { SaveFileParams };
