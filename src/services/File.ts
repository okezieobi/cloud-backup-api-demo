import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';

import fileRepository from '../repositories/file';

interface FileServicesParams {
    repository: { file: typeof fileRepository };
}

interface SaveFileParams {
    owner: any;
    file: any;
}

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);
ajvKeywords(ajv);

export default class FileServices implements FileServicesParams {
  repository: { file: typeof fileRepository };

  constructor(repository = { file: fileRepository }) {
    this.repository = repository;
  }

  async saveFile(arg: SaveFileParams) {
    const repo = await (await this.repository.file());
    const newFile = await repo.create(arg);
    await repo.save(newFile);
    return { message: 'New file successfully saved', data: newFile };
  }
}
