import Ajv from 'ajv';

export const validator = new Ajv({ allErrors: true, schemaId: 'auto' });
// validator.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

/**
 * Run validation for a specified class. Validated against schema which is loaded
 * based on class name.
 * @param _class - Class for which to run valdation
 * @param dataToValidate - Data value to validate (validated against schema based on class name)
 */
export async function runValidationForClass<ClassType extends any>(classOrName: ClassType | string, dataToValidate: any) {
  const className = typeof classOrName === 'string' || classOrName instanceof String ? classOrName : classOrName.constructor.name
  let schema
  try {
    schema = require(`../schemas/${className}.json`)
  } catch(err) {
    const schemaLoadErrMsg = `Error loading schema to use for validation for class named "${className}"`
    console.error(schemaLoadErrMsg)
    throw schemaLoadErrMsg
  }

  try {
    const test = validator.compile(schema);
    const isValid = test(dataToValidate);
    if (!isValid) {
      const errMsg = test.errors && test.errors.length
        ? test.errors.map((errObj) => `"${errObj.dataPath.replace('.', '')}" ${errObj.message}`).join(', ')
        : `Error creating ${className}`
      throw new Error(errMsg)
    }
  } catch(err) {
    console.error(`Error validating for class named "${className}"`, err)
    throw err
  }
}
