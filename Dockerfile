FROM node:8
ARG FIREBASE_PROJECT
ENV FIREBASE_PROJECT=$FIREBASE_PROJECT
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ARG PORT=8080
ENV PORT=$PORT

# Expose Port 8080 to be used later for firebase-serve
EXPOSE $PORT

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

## Copy package/lock files
COPY package.json yarn.lock ./

# Copy app source
COPY . .

# Install dependencies (skipping install of Cypress binary)
RUN CYPRESS_INSTALL_BINARY=0 yarn --pure-lockfile --no-cache

## Create project/env specific config
RUN yarn build:config

## Build app bundle and index.html
RUN yarn build

# Run http-server so exit signals such as SIGTERM and SIGINT are recieved by
# node process instead of being swallowed by npm
ENTRYPOINT [ "firebase", "serve", "--only", "hosting:app", "-p", $PORT ]
