import Ajv, { JSONSchemaType } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);
ajvKeywords(ajv);

export default class Services {
  static async validateId(id: string) {
    const schema: JSONSchemaType<string> = {
      $async: true,
      type: 'string',
      format: 'uuid',
    };
    return ajv.compile(schema)(id);
  }
}
