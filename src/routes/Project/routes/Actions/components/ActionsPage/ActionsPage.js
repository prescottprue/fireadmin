import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import Typography from 'material-ui-next/Typography'
import { Link } from 'react-router'
import IconButton from 'material-ui-next/IconButton'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import ExpandLessIcon from 'material-ui-icons/ExpandLess'
import Card, { CardHeader, CardContent } from 'material-ui-next/Card'
import Grid from 'material-ui-next/Grid'
import Collapse from 'material-ui-next/transitions/Collapse'
import CollectionSearch from 'components/CollectionSearch'
import { paths } from 'constants'
import ActionInstanceTile from '../ActionInstanceTile'
import classes from './ActionsPage.scss'

export const ActionsPage = ({
  selectActionTemplate,
  runAction,
  selectedTemplate,
  toggleTemplateEdit,
  templateEditExpanded,
  templateName,
  configExpanded,
  toInstance,
  fromInstance,
  toggleConfig,
  selectTo,
  actionProcessing,
  selectFrom,
  project
}) => (
  <div>
    <Typography className={classes.pageHeader}>Data Action</Typography>
    <div>
      <div className={classes.buttons}>
        <Button
          raised
          disabled={
            !selectedTemplate ||
            !toInstance ||
            !fromInstance ||
            actionProcessing
          }
          color="primary"
          onTouchTap={runAction}>
          Run Action
        </Button>
      </div>
      <Card className={classes.card}>
        <CardHeader
          title={templateName}
          action={
            <IconButton onClick={toggleTemplateEdit}>
              {templateEditExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          }
        />
        <Collapse in={templateEditExpanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              Run a data action by selecting a template, filling in the
              template's configuation options, then clicking run action
            </Typography>
            <div className="flex-row-center">
              <Link to={paths.actionTemplates}>
                <Button raised color="primary" className={classes.button}>
                  Create New Action Template
                </Button>
              </Link>
            </div>
            <div className={classes.or}>
              <Typography className={classes.orFont}>or</Typography>
            </div>
            <CollectionSearch
              indexName="actionTemplates"
              onSuggestionClick={selectActionTemplate}
            />
          </CardContent>
        </Collapse>
      </Card>
      {selectedTemplate ? (
        <Card className={classes.card}>
          <CardHeader
            title="Configuration"
            action={
              <IconButton onClick={toggleConfig}>
                {configExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            }
          />
          <Collapse in={configExpanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Grid container spacing={24} style={{ flexGrow: 1 }}>
                <Grid item xs={12} lg={6}>
                  <ActionInstanceTile
                    title="From"
                    environments={project.environments}
                    selectedInstance={fromInstance}
                    selectInstance={selectFrom}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <ActionInstanceTile
                    title="To"
                    environments={project.environments}
                    selectedInstance={toInstance}
                    selectInstance={selectTo}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      ) : null}
    </div>
  </div>
)

ActionsPage.propTypes = {
  toInstance: PropTypes.string,
  fromInstance: PropTypes.string,
  project: PropTypes.object,
  selectTo: PropTypes.func.isRequired,
  selectFrom: PropTypes.func.isRequired,
  toggleConfig: PropTypes.func.isRequired,
  runAction: PropTypes.func.isRequired,
  selectActionTemplate: PropTypes.func.isRequired,
  toggleTemplateEdit: PropTypes.func.isRequired,
  templateEditExpanded: PropTypes.bool.isRequired,
  actionProcessing: PropTypes.bool.isRequired,
  selectedTemplate: PropTypes.object,
  configExpanded: PropTypes.bool.isRequired,
  templateName: PropTypes.string.isRequired
}

export default ActionsPage
