import * as functions from 'firebase-functions'
import { createIndexFunc } from '../utils/search'

// Updates the search index for action templates when template is created or updated.
export default functions.firestore
  .document('/actionTemplates/{templateId}')
  .onWrite(
    // index action templates with parameter templateId only if template is public
    createIndexFunc({
      indexName: 'actionTemplates',
      idParam: 'templateId',
      indexCondition: (template) => template.public
    })
  )
