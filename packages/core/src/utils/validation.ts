import Ajv from 'ajv';

export const validator = new Ajv({ allErrors: true });

/**
 * Run validation for a specified class. Validated against schema which is loaded
 * based on class name.
 * @param _class - Class for which to run valdation
 * @param dataToValidate - Data value to validate (validated against schema based on class name)
 */
export async function runValidationForClass<ClassType extends any>(_class: ClassType, dataToValidate: object) {
  const className = _class.constructor.name
  const schema = require(`../schemas/${className}.json`)
  const test = validator.compile(schema);
  const isValid = test(dataToValidate);
  if (!isValid) {
    const errMsg = test.errors && test.errors.length
      ? test.errors.map((errObj) => `"${errObj.dataPath.replace('.', '')}" ${errObj.message}`).join(', ')
      : `Error creating ${className}`
    throw new Error(errMsg)
  }
}
