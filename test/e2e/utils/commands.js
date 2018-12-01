/**
 * Converts fixture to Blob. All file types are converted to base64 then
 * converted to a Blob using Cypress expect application/json. Json files are
 * just stringified then converted to a blob (fixes issue invalid Blob issues).
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 * @return {Promise} Resolves with blob containing fixture contents
 */
export function getFixtureBlob(fileUrl, type) {
  return type === 'application/json'
    ? cy
        .fixture(fileUrl)
        .then(
          jsonObj =>
            new Blob([JSON.stringify(jsonObj)], { type: 'application/json' })
        )
    : cy.fixture(fileUrl, 'base64').then(Cypress.Blob.base64StringToBlob)
}
