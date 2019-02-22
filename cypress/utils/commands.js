/**
 * Converts Cypress fixtures, including JSON, to a Blob. All file types are
 * converted to base64 then converted to a Blob using Cypress
 * expect application/json. Json files are just stringified then converted to
 * a blob (prevents issues with invalid string decoding).
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 * @return {Promise} Resolves with blob containing fixture contents
 */
export function getFixtureBlob(fileUrl, type) {
  console.log('fixture blob', fileUrl)
  return type === 'application/json'
    ? cy
        .fixture(fileUrl)
        .then(JSON.stringify)
        .then(jsonStr => new Blob([jsonStr], { type: 'application/json' }))
    : cy
        .fixture(fileUrl, 'base64')
        .then(item => Cypress.Blob.base64StringToBlob(item, type))
}
