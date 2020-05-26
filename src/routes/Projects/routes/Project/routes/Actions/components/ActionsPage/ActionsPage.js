import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { makeStyles } from '@material-ui/core/styles'
import CollectionSearch from 'components/CollectionSearch'
import TabContainer from 'components/TabContainer'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'
import PrivateActionTemplates from '../PrivateActionTemplates'
import RecentActions from '../RecentActions'
import useActionsPage from './useActionsPage'
import styles from './ActionPage.styles'
import ActionsRunnerForm from '../ActionsRunnerForm'

const useStyles = makeStyles(styles)

function ActionsPage({ projectId }) {
  const classes = useStyles()
  const [selectedTab, selectTab] = useState(0)
  const [selectedTemplate, changeSelectedTemplate] = useState()
  const [templateEditExpanded, changeTemplateEdit] = useState(true)
  const triggerSelectTab = (e, selectedIndex) => {
    selectTab(selectedIndex)
  }
  const toggleTemplateEdit = () => changeTemplateEdit(!templateEditExpanded)
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
      <Typography variant="h5">Action Runner</Typography>
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
            <TabContainer className="flex-column">
              <Grid container spacing={8} justify="center">
                <Grid
                  item
                  xs={12}
                  sm={8}
                  md={8}
                  style={{ textAlign: 'center' }}>
                  <Typography paragraph>
                    Run an action by selecting a template, filling in the
                    template's configuration options, then clicking{' '}
                    <strong>run action</strong>.
                  </Typography>
                  <Button
                    color="primary"
                    component={Link}
                    to={ACTION_TEMPLATES_PATH}
                    className={classes.button}>
                    Create New Action Template
                  </Button>
                  <Typography className={classes.orFont}>
                    or select existing
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <AppBar position="static">
                    <Tabs
                      value={selectedTab}
                      onChange={triggerSelectTab}
                      variant="fullWidth">
                      <Tab label="Public" index={0} />
                      <Tab label="Private" index={1} />
                    </Tabs>
                  </AppBar>
                </Grid>
                {selectedTab === 0 && (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ textAlign: 'center' }}>
                    <TabContainer>
                      <div className={classes.search}>
                        <CollectionSearch
                          indexName="actionTemplates"
                          onSuggestionClick={selectActionTemplate}
                        />
                      </div>
                    </TabContainer>
                  </Grid>
                )}
                {selectedTab === 1 && (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ textAlign: 'center' }}>
                    <TabContainer>
                      <PrivateActionTemplates
                        onTemplateClick={selectActionTemplate}
                      />
                    </TabContainer>
                  </Grid>
                )}
              </Grid>
            </TabContainer>
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
