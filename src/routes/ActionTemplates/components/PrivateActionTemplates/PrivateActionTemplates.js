import React from 'react'
import PropTypes from 'prop-types'
import { useFirestore, useUser, useFirestoreCollectionData } from 'reactfire'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import ActionTemplateListCard from '../ActionTemplateListCard'
import styles from './PrivateActionTemplates.styles'

const useStyles = makeStyles(styles)

function PrivateActionTemplates({ toggleDeleteDialog }) {
  const classes = useStyles()
  const firestore = useFirestore()
  const user = useUser()

  const currentUserTemplatesRef = firestore
    .collection(ACTION_TEMPLATES_PATH)
    .where('createdBy', '==', user?.uid)
    .where('public', '==', false)

  const currentUserTemplates = useFirestoreCollectionData(
    currentUserTemplatesRef,
    {
      idField: 'id'
    }
  )

  return (
    <div>
      {currentUserTemplates && currentUserTemplates.length ? (
        <div>
          <Typography className={classes.sectionHeader}>
            Private Templates
          </Typography>
          <Grid container spacing={8} className={classes.root}>
            {currentUserTemplates.map((template, templateIdx) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={3}
                  key={`Template-${template.id}-${templateIdx}`}>
                  <ActionTemplateListCard
                    {...template}
                    onDeleteClick={toggleDeleteDialog}
                  />
                </Grid>
              )
            })}
          </Grid>
        </div>
      ) : null}
    </div>
  )
}

PrivateActionTemplates.propTypes = {
  toggleDeleteDialog: PropTypes.func.isRequired
}

export default PrivateActionTemplates
