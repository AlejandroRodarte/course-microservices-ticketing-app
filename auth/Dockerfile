# stage 1: base image
FROM node:15-alpine as base

# general labels (author email, image title/docker-hub-repo/github-repo and license)
LABEL org.opencontainers.image.authors=alejandrorodarte1@gmail.com
LABEL org.opencontainers.image.title="Base image for the authentication microservice of a ticketing application"
LABEL org.opencontainers.image.url=https://hub.docker.com/r/rodarte/ms-node-react-ticketing-app-auth
LABEL org.opencontainers.image.source=https://github.com/AlejandroRodarte/ms-node-react-ticketing-app/tree/master/auth
LABEL org.opencontainers.image.licenses=MIT

# project labels (node version and stage)
LABEL com.rodarte.ms-node-react.ticketing.auth.nodeversion=$NODE_VERSION
LABEL com.rodarte.ms-node-react.ticketing.auth.stage=base

# environment variables: node environment and port
ENV NODE_ENV production
ENV PORT 3000

# mkdir app && cd app
WORKDIR /app

# /app owned by node user
RUN chown -R node:node .

# copy package-related files to /app (owned by node user)
COPY --chown=node:node package.json package-lock.json* ./

# install prod dependencies
RUN npm config list \
    && npm ci --only=production \
    && npm cache clean --force

# document exposed port
EXPOSE 3000


# stage 2: pre-build image
FROM base as pre-build

# title label for this image
LABEL org.opencontainers.image.title="Prebuild image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.ms-node-react.ticketing.auth.stage=pre-build

# add node_modules binaries to PATH environment variable (to compile typescript code and run the dev server)
ENV PATH /app/node_modules/.bin:$PATH

# install development dependencies
RUN npm config list \
    && npm ci --also=development \
    && npm cache clean --force

# copy source (typescript) code
COPY --chown=node:node . .


# stage 3: dev image
FROM pre-build as dev

# set image creation date and source commit build arguments
# Powershell
# command for CREATED_DATE: Get-Date -UFormat "%Y-%m-%dT%H:%M:%SZ"
# command for SOURCE_COMMIT: git rev-parse HEAD
ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

# set labels for image creation date, commit hash, and image title
LABEL org.opencontainers.image.created=$CREATED_DATE
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
LABEL org.opencontainers.image.title="Development image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.ms-node-react.ticketing.auth.stage=development

# override node environment to development
ENV NODE_ENV development

# run ts-node-dev on src/index.ts entrypoint file
CMD [ "ts-node-dev", "src/index.ts" ]


# stage 4: build image
FROM pre-build as build

# title label for this image
LABEL org.opencontainers.image.title="Build image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.ms-node-react.ticketing.auth.stage=build

# run tsc to compile typescript code to javascript (dumped on /app/dist)
RUN tsc


# stage 5: prod image
FROM base as prod

# set image creation date and source commit build arguments
# Powershell
# command for CREATED_DATE: Get-Date -UFormat "%Y-%m-%dT%H:%M:%SZ"
# command for SOURCE_COMMIT: git rev-parse HEAD
ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

# set labels for image creation date, commit hash, and image title
LABEL org.opencontainers.image.created=$CREATED_DATE
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
LABEL org.opencontainers.image.title="Production image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.ms-node-react.ticketing.auth.stage=prod

# from build stage, copy /app/build files (compiled javascript code) to /app/src in prod stage
COPY --chown=node:node --from=build /app/build ./src

# change to node user
USER node

# run server
CMD [ "node", "src/index.js" ]
