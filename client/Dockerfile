# stage 1: base image
FROM node:16 as base

# general labels
LABEL org.opencontainers.image.authors alejandrorodarte1@gmail.com
LABEL org.opencontainers.image.title "Base image for the frontend application of a ticketing microservices backend"
LABEL org.opencontainers.image.url https://hub.docker.com/repository/docker/rodarte/msnr-ta-front-prod
LABEL org.opencontainers.image.source https://github.com/AlejandroRodarte/course-microservices-ticketing-app/tree/master/client
LABEL org.opencontainers.image.licenses MIT

# stage-related labels
LABEL com.rodarte.msnr.ticketing.client.nodeversion $NODE_VERSION
LABEL com.rodarte.msnr.ticketing.client.stage base

# date and short commit hash args (for CI)
ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

# default env variables
ENV NODE_ENV production
ENV PORT 3001

# install tini
RUN apt-get update \
    && apt-get install tini

# access node_modules binaries
ENV PATH /node/node_modules/.bin:$PATH

# mkdir /node && cd /node
WORKDIR /node

# /node owned by node user and node group
RUN chown -R node:node .

# copy package files to /node
COPY --chown=node:node package.json package-lock.json* ./

# install prod dependencies
RUN npm config list \
    && npm ci --only=production \
    && npm cache clean --force

# expose port 3001
EXPOSE 3001

# run tini
ENTRYPOINT [ "/usr/bin/tini", "--" ]


# stage 2: base-dev image
FROM base as base-dev

# stage-related labels
LABEL org.opencontainers.image.title "Base development image for the frontend application of a ticketing microservices backend"
LABEL com.rodarte.msnr.ticketing.client.stage base-dev

# install dev dependencies
RUN npm config list \
    && npm ci --also=development \
    && npm cache clean --force


# stage 3: dev image
FROM base-dev as dev

# stage-related labels
LABEL org.opencontainers.image.title "Development image for the frontend application of a ticketing microservices backend"
LABEL com.rodarte.msnr.ticketing.client.stage dev

# set development env variables
ENV NODE_ENV development

# mkdir /node/app && cd /node/app to place src code here (node_modules will be extracted from /node)
WORKDIR /node/app

# run healthcheck
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT}/api/health/healthz || exit 1

# switch to node user
USER node

# deploy development server
CMD [ "next", "dev" ]


# stage 4: source image
FROM base-dev as source

# stage-related labels
LABEL org.opencontainers.image.title "Source image for the frontend application of a ticketing microservices backend"
LABEL com.rodarte.msnr.ticketing.client.stage source

# copy source code
COPY --chown=node:node . .


# stage 5: skaffold image
FROM source as skaffold

# label date, short commit hash and image title
LABEL org.opencontainers.image.created $CREATED_DATE
LABEL org.opencontainers.image.revision $SOURCE_COMMIT
LABEL org.opencontainers.image.title "Skaffold image for the frontend application of a ticketing microservices backend"

# stage-related label
LABEL com.rodarte.msnr.ticketing.client.stage skaffold

# set development env variables
ENV NODE_ENV development

# run healthcheck
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT}/api/health/healthz || exit 1

# switch to node user
USER node

# run development server
CMD [ "next", "dev" ]


# stage 5: build image
FROM source as build

# stage-related labels
LABEL org.opencontainers.image.title "Build image for the frontend application of a ticketing microservices backend"
LABEL com.rodarte.msnr.ticketing.client.stage build

# compile frontend in a /node/.next folder
RUN NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_VAR \
    NEXT_PUBLIC_ENV=APP_NEXT_PUBLIC_ENV_VAR \
    NEXT_PUBLIC_API_URL=APP_NEXT_PUBLIC_API_URL_VAR \
    next build


# stage 7: prod image
FROM base as prod

# label date, short commit hash and image title
LABEL org.opencontainers.image.created $CREATED_DATE
LABEL org.opencontainers.image.revision $SOURCE_COMMIT
LABEL org.opencontainers.image.title "Production image for the frontend application of a ticketing microservices backend"

# stage-related label
LABEL com.rodarte.msnr.ticketing.client.stage prod

# copy /node/.next compiled frontend from build stage to /node/.next in prod stage
COPY --chown=node:node --from=build /node/.next ./.next
COPY --chown=node:node --from=build /node/scripts/bash/entrypoint.sh ./scripts/bash/entrypoint.sh

# run healthcheck
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT}/api/health/healthz || exit 1

# switch to node user
USER node

RUN chmod +x ./scripts/bash/entrypoint.sh
ENTRYPOINT [ "/node/scripts/bash/entrypoint.sh" ]

# run production server
CMD [ "next", "start" ]
