import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Help from '@material-ui/icons/Help'
import { makeStyles } from '@material-ui/core/styles'
import CollectionSearch from 'components/CollectionSearch'
import SplitButton from 'components/SplitButton'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'
import PrivateActionTemplates from '../PrivateActionTemplates'
import RecentActions from '../RecentActions'
import useActionsPage from './useActionsPage'
import styles from './ActionPage.styles'
import ActionsRunnerForm from '../ActionsRunnerForm'

const useStyles = makeStyles(styles)
const PUBLIC_OPTION = 'Public'
const options = [PUBLIC_OPTION, 'Private']

function ActionsPage({ projectId }) {
  const classes = useStyles()
  const [templateScope, setSelectedTemplateScope] = useState(PUBLIC_OPTION)
  const [selectedTemplate, changeSelectedTemplate] = useState()
  const [templateEditExpanded, changeTemplateEdit] = useState(true)
  const toggleTemplateEdit = () => changeTemplateEdit(!templateEditExpanded)
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const selectActionTemplate = (newSelectedTemplate) => {
    changeSelectedTemplate(newSelectedTemplate)
    changeTemplateEdit(false)
  }
  const { runAction, rerunAction } = useActionsPage({
    projectId,
    selectActionTemplate,
    selectedTemplate
  })

  const templateName = selectedTemplate?.name
    ? `Template: ${selectedTemplate.name}`
    : 'Template'
  // TODO: Disable run action button if form is not fully filled out
  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Actions</Typography>
      <Typography variant="h5" className={classes.sectionHeader}>
        Action Runner
      </Typography>
      <Tooltip
        title={
          <Typography>
            Run an action by selecting a template, filling in the template's
            configuration options, then clicking <strong>run action</strong>.
          </Typography>
        }>
        <IconButton
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          className={classes.helpIcon}
          style={{ backgroundColor: 'transparent' }}>
          <Help />
        </IconButton>
      </Tooltip>
      <div className={classes.container}>
        <div>
          <ExpansionPanel
            expanded={templateEditExpanded}
            onChange={toggleTemplateEdit}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.sectionHeader}>
                {templateName}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2} justify="center" alignItems="center">
                <Grid item xs={12} md={12} className={classes.paperHeader}>
                  <Typography variant="h6" className={classes.paperHeaderText}>
                    Select Existing Template
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  md={3}
                  style={{
                    // Used to fix jumping caused by spacing of CollectionSearch
                    marginTop:
                      templateScope !== PUBLIC_OPTION ? '2.75rem' : undefined,
                    marginBottom:
                      templateScope !== PUBLIC_OPTION ? '2rem' : undefined
                  }}>
                  <SplitButton
                    options={options}
                    buttonStyle={{ width: '120px' }}
                    ariaLabel="select-template-scope"
                    onChange={(ind, value) => {
                      setSelectedTemplateScope(value)
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={8}
                  md={3}
                  style={{
                    // Used to fix jumping caused by spacing of CollectionSearch
                    marginTop:
                      templateScope !== PUBLIC_OPTION ? '2.5rem' : undefined,
                    marginBottom:
                      templateScope !== PUBLIC_OPTION ? '2rem' : undefined
                  }}>
                  {templateScope === PUBLIC_OPTION ? (
                    <div className={classes.search}>
                      <CollectionSearch
                        indexName="actionTemplates"
                        onSuggestionClick={selectActionTemplate}
                      />
                    </div>
                  ) : (
                    <PrivateActionTemplates
                      onTemplateClick={selectActionTemplate}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.paper}>
                  <Typography>Can't find the template you want?</Typography>
                  <Button
                    color="primary"
                    component={Link}
                    to={ACTION_TEMPLATES_PATH}>
                    Create A New Action Template
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {selectedTemplate ? (
            <ActionsRunnerForm
              selectedTemplate={selectedTemplate}
              changeSelectedTemplate={changeSelectedTemplate}
              changeTemplateEdit={changeTemplateEdit}
              runAction={runAction}
              projectId={projectId}
            />
          ) : null}
        </div>
      </div>
      <Typography variant="h5">Recently Run Actions</Typography>
      <RecentActions projectId={projectId} rerunAction={rerunAction} />
    </div>
  )
}

ActionsPage.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default ActionsPage
