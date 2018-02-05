import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { LinearProgress } from 'material-ui/Progress'
import { Link } from 'react-router'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import CollectionSearch from 'components/CollectionSearch'
import { paths } from 'constants'
import ActionRunnerForm from '../ActionRunnerForm'
import classes from './ActionsPage.scss'

export const ActionsPage = ({
  selectActionTemplate,
  runAction,
  selectedTemplate,
  toggleTemplateEdit,
  templateEditExpanded,
  templateName,
  params,
  configExpanded,
  toggleConfig,
  actionProcessing,
  project
}) => (
  <div>
    <Typography className={classes.pageHeader}>Actions</Typography>
    <Typography className={classes.subHeader}>Action Runner</Typography>
    <div>
      <div className={classes.buttons}>
        <Button
          disabled={!selectedTemplate || actionProcessing}
          color="primary"
          onTouchTap={runAction}>
          Run Action
        </Button>
      </div>
      {actionProcessing && <LinearProgress color="primary" />}
      <ExpansionPanel
        expanded={templateEditExpanded}
        onChange={toggleTemplateEdit}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.sectionHeader}>
            {templateName}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="flex-column">
          <Typography paragraph>
            Run a data action by selecting a template, filling in the template's
            configuation options, then clicking run action
          </Typography>
          <div className="flex-row-center">
            <Link to={paths.actionTemplates}>
              <Button color="primary" className={classes.button}>
                Create New Action Template
              </Button>
            </Link>
          </div>
          <div className={classes.or}>
            <Typography className={classes.orFont}>or</Typography>
          </div>
          <div className={classes.search}>
            <CollectionSearch
              indexName="actionTemplates"
              onSuggestionClick={selectActionTemplate}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {selectedTemplate ? (
        <ActionRunnerForm
          environments={project.environments}
          project={project}
          projectId={params.projectId}
          selectedTemplate={selectedTemplate}
        />
      ) : null}
    </div>
  </div>
)

ActionsPage.propTypes = {
  project: PropTypes.object,
  selectedTemplate: PropTypes.object,
  params: PropTypes.object.isRequired, // from react-router
  runAction: PropTypes.func.isRequired, // from enhancer (withHandlers)
  toggleConfig: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  selectActionTemplate: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleTemplateEdit: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  templateEditExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  actionProcessing: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  configExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  templateName: PropTypes.string.isRequired
}

export default ActionsPage
