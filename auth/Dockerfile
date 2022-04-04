# stage 1: base image
FROM node:16 as base

# general labels (author email, image title/docker-hub-repo/github-repo and license)
LABEL org.opencontainers.image.authors alejandrorodarte1@gmail.com
LABEL org.opencontainers.image.title "Base image for the authentication microservice of a ticketing application"
LABEL org.opencontainers.image.url https://hub.docker.com/repository/docker/rodarte/msnr-ta-auth-prod
LABEL org.opencontainers.image.source https://github.com/AlejandroRodarte/course-microservices-ticketing-app/tree/master/auth
LABEL org.opencontainers.image.licenses MIT

# project labels (node version and stage)
LABEL com.rodarte.msnr.ticketing.auth.nodeversion $NODE_VERSION
LABEL com.rodarte.msnr.ticketing.auth.stage base

# set image creation date and source commit build arguments
ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

# environment variables: node environment and port
ENV NODE_ENV production
ENV PORT 3000

# install tini
RUN apt-get update \
    && apt-get install tini

# add node_modules binaries to PATH environment variable (to compile typescript code and run the dev server)
ENV PATH /node/node_modules/.bin:$PATH

# mkdir node && cd node
WORKDIR /node

# /node owned by node user
RUN chown -R node:node .

# copy package-related files to /node (owned by node user)
COPY --chown=node:node package.json package-lock.json* ./

# install prod dependencies
RUN npm config list \
    && npm ci --only=production \
    && npm cache clean --force

# document exposed port
EXPOSE 3000

ENTRYPOINT [ "/usr/bin/tini", "--" ]


# stage 2: base-dev image
FROM base as base-dev

# title label for this image
LABEL org.opencontainers.image.title "Base development image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.msnr.ticketing.auth.stage base-dev

# install development dependencies
RUN npm config list \
    && npm ci --also=development \
    && npm cache clean --force


# stage 3: dev image
FROM base-dev as dev

# title label for this image
LABEL org.opencontainers.image.title "Development image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.msnr.ticketing.auth.stage dev

# override node environment to development
ENV NODE_ENV development

# mkdir /node/app & workdir /node/app
WORKDIR /node/app

# run healthcheck
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT}/auth/health/healthz || exit 1

# change to node user
USER node

# run the typescript development server
CMD [ "ts-node-dev", "--poll", "src/index.ts" ]


# stage 4: source image
FROM base-dev as source

# title label for this image
LABEL org.opencontainers.image.title "Source image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.msnr.ticketing.auth.stage source

# copy source (typescript) code
COPY --chown=node:node . .


# stage 5: skaffold image
FROM source as skaffold

# set labels for image creation date, commit hash, and image title
LABEL org.opencontainers.image.created $CREATED_DATE
LABEL org.opencontainers.image.revision $SOURCE_COMMIT
LABEL org.opencontainers.image.title "Skaffold image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.msnr.ticketing.auth.stage skaffold

# override node environment to development
ENV NODE_ENV development

# run healthcheck
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT}/auth/health/healthz || exit 1

# change to node user
USER node

# run ts-node-dev on src/index.ts entrypoint file
CMD [ "ts-node-dev", "--poll", "src/index.ts" ]


# stage 6: build image
FROM source as build

# title label for this image
LABEL org.opencontainers.image.title "Build image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.msnr.ticketing.auth.stage build

# run tsc to compile typescript code to javascript (dumped on /app/dist)
RUN tsc


# stage 7: prod image
FROM base as prod

# set labels for image creation date, commit hash, and image title
LABEL org.opencontainers.image.created $CREATED_DATE
LABEL org.opencontainers.image.revision $SOURCE_COMMIT
LABEL org.opencontainers.image.title "Production image for the authentication microservice of a ticketing application"

# stage label for this image
LABEL com.rodarte.msnr.ticketing.auth.stage prod

# from build stage, copy /node/build/src files (compiled javascript code) to /node/src in prod stage
COPY --chown=node:node --from=build /node/build/src ./src

# run healthcheck
HEALTHCHECK --interval=10s --timeout=10s --start-period=10s --retries=3 CMD curl -f http://localhost:${PORT}/auth/health/healthz || exit 1

# change to node user
USER node

# run server
CMD [ "node", "src/index.js" ]
