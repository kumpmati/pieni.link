# Use same version as in .nvmrc
FROM node:20-alpine as base


# Dependencies and build
FROM base as runner

ARG PUBLIC_BASEURL=http://localhost:3000
ARG DATABASE_URL
ARG GOOGLE_OAUTH_ID
ARG GOOGLE_OAUTH_SECRET

# Tell svelte.config.js to use the Node.js adapter
ENV DOCKER=true

# Keep Node.js from blocking POST requests
ENV ORIGIN=$PUBLIC_BASEURL

ENV PUBLIC_BASEURL=$PUBLIC_BASEURL
ENV DATABASE_URL=$DATABASE_URL
ENV POSTGRES_HOST=$POSTGRES_HOST
ENV GOOGLE_OAUTH_ID=$GOOGLE_OAUTH_ID
ENV GOOGLE_OAUTH_SECRET=$GOOGLE_OAUTH_SECRET


WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

RUN rm -rf static/

EXPOSE 3000

CMD ["npm", "run", "migrate-start"]