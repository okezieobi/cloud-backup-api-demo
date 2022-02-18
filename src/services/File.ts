import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';

import fileRepository from '../repositories/file';
import Services from '.';

interface FileServicesParams {
    repository: { file: typeof fileRepository };
}

interface ListFilesParams {
  user?: string;
  isSafe: boolean;
}

interface verifyOneParams {
  user?: string;
  id: string;
}

interface SaveFileParams {
    user: object;
    info: object[];
}

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);
ajvKeywords(ajv);

export default class FileServices extends Services implements FileServicesParams {
  repository: { file: typeof fileRepository };

  constructor(repository = { file: fileRepository }) {
    super();
    this.repository = repository;
    this.saveOne = this.saveOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
  }

  static async validateSaveOne(arg: SaveFileParams) {
    const schema: JSONSchemaType<SaveFileParams> = {
      $async: true,
      type: 'object',
      properties: {
        user: { type: 'object' },
        info: { type: 'array', minItems: 1, items: { type: 'object' } },
      },
      required: ['user', 'info'],
      additionalProperties: false,
    };
    return ajv.compile(schema)(arg);
  }

  async saveOne(arg: SaveFileParams) {
    await FileServices.validateSaveOne(arg);
    const repo = await this.repository.file();
    const newFile = await repo.create(arg);
    await repo.save(newFile);
    return { message: 'New file successfully saved', data: { ...newFile, user: undefined } };
  }

  static async validateListAll(arg: ListFilesParams) {
    const schema: JSONSchemaType<ListFilesParams> = {
      $async: true,
      type: 'object',
      properties: {
        user: { type: 'string', nullable: true },
        isSafe: { type: 'boolean' },
      },
      required: ['isSafe'],
      additionalProperties: false,
    };
    return ajv.compile(schema)(arg);
  }

  async listAll({ user, isSafe }: ListFilesParams) {
    await FileServices.validateListAll({ user, isSafe });
    const repo = await this.repository.file();
    let data: any;
    if (user == null) data = await repo.find({ where: { isSafe } });
    else data = await repo.find({ where: { user, isSafe } });
    return { message: 'Files retrieved successfully', data };
  }

  async verifyOne({ id, user }: verifyOneParams) {
    await FileServices.validateId(id);
    const repo = await this.repository.file();
    if (user == null) return repo.findOneOrFail({ where: { id } });
    return repo.findOneOrFail({ where: { user, id } });
  }
}
