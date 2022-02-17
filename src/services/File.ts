import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';

import fileRepository from '../repositories/file';

interface FileServicesParams {
    repository: { file: typeof fileRepository };
}

interface SaveFileParams {
    user: object;
    files: object[];
}

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);
ajvKeywords(ajv);

export default class FileServices implements FileServicesParams {
  repository: { file: typeof fileRepository };

  constructor(repository = { file: fileRepository }) {
    this.repository = repository;
    this.saveFile = this.saveFile.bind(this);
  }

  static async validateSaveFile(arg: SaveFileParams) {
    const schema: JSONSchemaType<SaveFileParams> = {
      $async: true,
      type: 'object',
      properties: {
        user: { type: 'object' },
        files: { type: 'array', minItems: 1, items: { type: 'object' } },
      },
      required: ['user', 'files'],
    };
    return ajv.compile(schema)(arg);
  }

  async saveFile(arg: SaveFileParams) {
    await FileServices.validateSaveFile(arg);
    const repo = await await this.repository.file();
    const newFile = await repo.create(arg);
    await repo.save(newFile);
    return { message: 'New file successfully saved', data: newFile };
  }
}
