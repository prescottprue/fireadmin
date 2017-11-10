import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  populate,
  getVal
} from 'react-redux-firebase'
import { map, size, omit } from 'lodash'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import { UserIsAuthenticated } from 'utils/router'
import { withRouter } from 'utils/components'
import LoadingSpinner from 'components/LoadingSpinner'
import Instance from 'routes/Projects/routes/Project/components/Instance'
import NewInstanceDialog from 'routes/Projects/routes/Project/components/NewInstanceDialog'
import MigrationTile from 'routes/Projects/routes/Project/components/MigrationTile'
import notifActions from 'modules/notification'
import classes from './ProjectContainer.scss'

const populates = [{ child: 'instances', root: `instances` }]

// Get project path from firebase based on params prop (route params)
@UserIsAuthenticated
@withRouter
@firebaseConnect(({ params }) => [
  { path: `projects/${params.projectId}`, populates },
  `serviceAccounts/${params.projectId}`
])
@connect(
  ({ firebase }, { params }) => ({
    project: populate(firebase, `projects/${params.projectId}`, populates),
    serviceAccounts: getVal(firebase, `serviceAccounts/${params.projectId}`)
  }),
  {
    ...notifActions
  }
)
export default class Project extends Component {
  static propTypes = {
    project: PropTypes.shape({
      name: PropTypes.string
    }),
    serviceAccounts: PropTypes.object,
    auth: PropTypes.shape({
      uid: PropTypes.string.isRequired
    }),
    firebase: PropTypes.shape({
      push: PropTypes.func.isRequired,
      uploadFiles: PropTypes.func.isRequired
    }),
    params: PropTypes.shape({
      // eslint-disable-line react/no-unused-prop-types
      projectId: PropTypes.string.isRequired
    }),
    showError: PropTypes.func,
    showSuccess: PropTypes.func
  }

  state = {
    addInstanceOpen: false,
    selectedAccounts: {}
  }

  addInstance = instanceData => {
    if (!size(this.state.selectedAccounts)) {
      this.props.showError('You must selected a service account')
      return
    }
    const { params: { projectId }, firebase } = this.props
    return firebase
      .push('instances', {
        ...instanceData,
        serviceAccounts: this.state.selectedAccounts
      })
      .then(snap =>
        firebase.update(`projects/${projectId}/instances`, { [snap.key]: true })
      )
      .then(() => {
        this.props.showSuccess('Instance added successfully')
        this.setState({ addInstanceOpen: false })
      })
  }

  filesDrop = files => {
    const { auth: { uid }, params: { projectId }, firebase } = this.props
    const filePath = `serviceAccounts/${uid}/${projectId}`
    return firebase
      .uploadFiles(filePath, files, `serviceAccounts/${projectId}`)
      .then(res => {
        this.props.showSuccess('Service Account Uploaded successfully')
        return this.setState({ files, res })
      })
  }

  selectServiceAccount = accountKey => {
    if (this.state.selectedAccounts[accountKey]) {
      return this.setState({
        selectedAccounts: omit(this.state.selectedAccounts, [accountKey])
      })
    }
    this.setState({
      selectedAccounts: { ...this.state.selectedAccounts, [accountKey]: true }
    })
  }

  migrationRequest = () => {
    return this.props.firebase
      .push('requests/migration', {
        databaseURL: 'https://xdotcom-ebce4.firebaseio.com/',
        copyPath: 'instances',
        serviceAccount:
          'serviceAccounts/L7qNrKtd7Kaw6i85dnu4IcQXMYe2/-KqC7UG1_MGm1xgiZTIU/xdotcom-ddb4fe5e1ef0.json'
      })
      .then(() => {
        this.props.showSuccess('Request created successfully')
      })
  }

  render() {
    const { project } = this.props

    if (!isLoaded(project)) {
      return <LoadingSpinner />
    }

    if (isEmpty(project)) {
      return <div className={classes.empty}>Project not found</div>
    }

    return (
      <div className={classes.container}>
        <h2>{project.name}</h2>
        <Paper className={classes.paper}>
          <h2>Instances</h2>
          <div style={{ marginBottom: '2rem' }}>
            <RaisedButton
              label="Add Instance"
              onTouchTap={() => this.setState({ addInstanceOpen: true })}
            />
          </div>
          <div>
            {project.instances ? (
              <div className={classes.instances}>
                {map(project.instances, (inst, i) => (
                  <Instance key={`Instance-${i}`} instance={inst} />
                ))}
              </div>
            ) : (
              <span>No Instances</span>
            )}
          </div>
        </Paper>
        <MigrationTile
          instances={project.instances}
          params={this.props.params}
        />
        <NewInstanceDialog
          open={this.state.addInstanceOpen}
          onFilesDrop={this.filesDrop}
          onSubmit={this.addInstance}
          onRequestClose={() => this.setState({ addInstanceOpen: false })}
          selectedAccounts={this.state.selectedAccounts}
          onAccountClick={this.selectServiceAccount}
          serviceAccounts={this.props.serviceAccounts}
        />
      </div>
    )
  }
}
