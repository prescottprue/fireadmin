FROM node:8

# Expose Port 8080 to be used later for http-server
EXPOSE 8080

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

# Install dependencies (skipping install of Cypress binary)
RUN CYPRESS_INSTALL_BINARY=0 npm install

# Install http-server to host after building html
RUN npm install http-server

## Build app bundle and index.html
RUN npm run build

# Run http-server so exit signals such as SIGTERM and SIGINT are recieved by
# node process instead of being swallowed by npm
ENTRYPOINT [ "http-server", "dist", "-p", "8080" ]
