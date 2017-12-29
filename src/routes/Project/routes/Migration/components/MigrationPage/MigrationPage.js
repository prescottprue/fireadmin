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
import MigrationInstanceTile from '../MigrationInstanceTile'
import classes from './MigrationPage.scss'

export const MigrationPage = ({
  selectMigrationTemplate,
  runMigration,
  selectedTemplate,
  toggleTemplateEdit,
  templateEditExpanded,
  templateName,
  configExpanded,
  toInstance,
  fromInstance,
  toggleConfig,
  selectTo,
  selectFrom,
  project
}) => (
  <div>
    <Typography className={classes.pageHeader}>Data Migration</Typography>
    <div>
      <div className={classes.buttons}>
        <Button
          raised
          disabled={!selectedTemplate || !toInstance || !fromInstance}
          color="primary"
          onTouchTap={runMigration}>
          Run Migration
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
              Run a data migration by selecting a template, filling in the
              template's configuation options, then clicking run migration
            </Typography>
            <div className="flex-row-center">
              <Link to={paths.dataMigration}>
                <Button raised color="primary" className={classes.button}>
                  Create New Migration Template
                </Button>
              </Link>
            </div>
            <div className={classes.or}>
              <Typography className={classes.orFont}>or</Typography>
            </div>
            <CollectionSearch
              indexName="migrationTemplates"
              onSuggestionClick={selectMigrationTemplate}
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
                  <MigrationInstanceTile
                    title="From"
                    environments={project.environments}
                    selectedInstance={fromInstance}
                    selectInstance={selectFrom}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <MigrationInstanceTile
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

MigrationPage.propTypes = {
  toInstance: PropTypes.object,
  fromInstance: PropTypes.object,
  project: PropTypes.object,
  selectTo: PropTypes.func.isRequired,
  selectFrom: PropTypes.func.isRequired,
  toggleConfig: PropTypes.func.isRequired,
  runMigration: PropTypes.func.isRequired,
  selectMigrationTemplate: PropTypes.func.isRequired,
  toggleTemplateEdit: PropTypes.func.isRequired,
  templateEditExpanded: PropTypes.bool.isRequired,
  selectedTemplate: PropTypes.object,
  configExpanded: PropTypes.bool.isRequired,
  templateName: PropTypes.string.isRequired
}

export default MigrationPage
