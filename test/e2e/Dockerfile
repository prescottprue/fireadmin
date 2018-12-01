FROM cypress/base:8

## Build Arguments
# URL which Cypress will run tests against (with default)
ARG test_url=https://fireadmin-stage.firebaseapp.com
# Arguments to add to the cypress run command
ARG test_command_args=""
# Image Build Id (from Cloud Build) used in recording of test files
ARG build_id

## Environment Variables
# URL which Cypress will run tests against (defaults to test_url arg)
ENV CYPRESS_baseUrl=$test_url
# Arguments to add to the cypress run command
ENV TEST_ARGS "${test_command_args}"

# Token used to auth firebase-tools for use in seeding/checking Firebase (RTDB + Firestore)
ENV FIREBASE_TOKEN $FIREBASE_TOKEN
# Token used to auth firebase-tools for use in seeding/checking Firebase (RTDB + Firestore)
ENV CYPRESS_KEY $CYPRESS_KEY
# Image Build Id (from Cloud Build) used in recording of test files
ENV BUILD_ID=$build_id

# Prevent a large number messages during NPM install
ENV npm_config_loglevel warn
# Color logs where possible
ENV TERM xterm

## Copy code into container
### Files
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json cypress.json serviceAccount.json project.config.js ./

### Directories
COPY build/ /build/
COPY test/e2e/ /test/e2e/

# Install Dependencies (only those used to build config files)
RUN CYPRESS_INSTALL_BINARY=0 npm install cypress-firebase

# Install Cypress
# Set CI=true to prevent a large number of messages during install of
# dependencies such as Cypress
RUN CI=true npm install cypress

# Verify Cypress Installed correctly
RUN $(npm bin)/cypress verify

# Run Cypress tests (URL set by ENV above) reporting results to Cypress
ENTRYPOINT npm run test:ui:stage -- --record --key $CYPRESS_KEY$TEST_ARGS
