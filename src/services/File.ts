import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';

import fileRepository from '../repositories/file';

interface FileServicesParams {
    repository: { file: typeof fileRepository };
}

interface ListFilesParams {
  user: string;
  isSafe: boolean;
}

interface SaveFileParams {
    user: object;
    info: object[];
}

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);
ajvKeywords(ajv);

export default class FileServices implements FileServicesParams {
  repository: { file: typeof fileRepository };

  constructor(repository = { file: fileRepository }) {
    this.repository = repository;
    this.saveFile = this.saveFile.bind(this);
    this.listFiles = this.listFiles.bind(this);
  }

  static async validateSaveFile(arg: SaveFileParams) {
    const schema: JSONSchemaType<SaveFileParams> = {
      $async: true,
      type: 'object',
      properties: {
        user: { type: 'object' },
        info: { type: 'array', minItems: 1, items: { type: 'object' } },
      },
      required: ['user', 'info'],
    };
    return ajv.compile(schema)(arg);
  }

  async saveFile(arg: SaveFileParams) {
    await FileServices.validateSaveFile(arg);
    const repo = await await this.repository.file();
    const newFile = await repo.create(arg);
    await repo.save(newFile);
    return { message: 'New file successfully saved', data: { ...newFile, user: undefined } };
  }

  static async validateListFiles(arg: ListFilesParams) {
    const schema: JSONSchemaType<ListFilesParams> = {
      $async: true,
      type: 'object',
      properties: {
        user: { type: 'string', nullable: 'true' },
        isSafe: { type: 'boolean' },
      },
      required: ['isSafe', 'user'],
    };
    return ajv.compile(schema)(arg);
  }

  async listFiles(arg: ListFilesParams) {
    await FileServices.validateListFiles(arg);
    const repo = await await this.repository.file();
    const data = await repo.find({ where: arg });
    return { message: 'Files retrieved successfully', data };
  }
}
