import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Drawer from 'material-ui-next/Drawer'
import AppBar from 'material-ui-next/AppBar'
import Toolbar from 'material-ui-next/Toolbar'
import Typography from 'material-ui-next/Typography'
import Divider from 'material-ui-next/Divider'
import List, {
  ListItem,
  ListItemIcon,
  ListItemText
} from 'material-ui-next/List'
import IconButton from 'material-ui-next/IconButton'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import LayersIcon from 'material-ui-icons/Layers'
import DeviceHubIcon from 'material-ui-icons/DeviceHub'
import { map } from 'lodash'
import { Link } from 'react-router'
import Button from 'material-ui-next/Button'
import { DATA_MIGRATION_PATH } from 'constants'
import Instance from '../Instance'
import InstanceDialog from '../InstanceDialog'
import classesFromStyles from './ProjectPage.scss'

export const ProjectPage = ({
  project,
  params,
  classes,
  drawerOpen,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  serviceAccounts,
  selectServiceAccount,
  selectedAccounts,
  newDialogOpen,
  addInstance,
  uploadServiceAccount,
  toggleDialog
}) => (
  <div className={classes.appFrame}>
    <AppBar
      className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}>
      <Toolbar>
        <Typography type="title" color="inherit" noWrap>
          {project.name}
        </Typography>
      </Toolbar>
    </AppBar>
    <Drawer
      type="permanent"
      classes={{
        paper: classNames(
          classes.drawerPaper,
          !drawerOpen && classes.drawerPaperClose
        )
      }}
      open={drawerOpen}>
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={closeDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.list}>
          <ListItem button selected>
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Environments" />
          </ListItem>
          <ListItem button selected>
            <ListItemIcon>
              <DeviceHubIcon />
            </ListItemIcon>
            <ListItemText primary="Migrations" />
          </ListItem>
          <Divider />
          <Divider />
          <ListItem button selected onClick={toggleDrawer}>
            <ListItemIcon>
              {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
          </ListItem>
        </List>
      </div>
    </Drawer>
    <main className={classes.content}>
      <h2>Instances</h2>
      <div style={{ marginBottom: '2rem' }}>
        <Button raised color="primary" onTouchTap={toggleDialog}>
          Add Instance
        </Button>
      </div>
      <div>
        {project.instances ? (
          <div className="flex-column">
            <div className={classesFromStyles.instances}>
              {map(project.instances, (inst, i) => (
                <Instance key={`Instance-${i}`} instance={inst} />
              ))}
            </div>
            <div className="flex-row-center">
              {map(project.instances, (inst, i) => (
                <Link to={DATA_MIGRATION_PATH} key={`Migrate-${i}`}>
                  <Button>Migrate -> </Button>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <span>No Instances</span>
        )}
      </div>
    </main>
    <InstanceDialog
      open={newDialogOpen}
      onFilesDrop={uploadServiceAccount}
      onSubmit={addInstance}
      onRequestClose={toggleDialog}
      selectedAccounts={selectedAccounts}
      onAccountClick={selectServiceAccount}
      serviceAccounts={serviceAccounts}
    />
  </div>
)

ProjectPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  serviceAccounts: PropTypes.object,
  selectedAccounts: PropTypes.array,
  addInstance: PropTypes.func,
  uploadServiceAccount: PropTypes.func,
  selectServiceAccount: PropTypes.func,
  toggleDialog: PropTypes.func,
  toggleDrawer: PropTypes.func,
  classes: PropTypes.object, // added by withStyles
  openDrawer: PropTypes.func,
  closeDrawer: PropTypes.func,
  newDialogOpen: PropTypes.bool,
  drawerOpen: PropTypes.bool
}

export default ProjectPage
