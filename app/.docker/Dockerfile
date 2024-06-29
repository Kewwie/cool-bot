FROM node:20
USER node

COPY --chown=node:node .env /simple-discord/app/.env
COPY --chown=node:node ./app /simple-discord/app

WORKDIR /simple-discord/app

RUN npm install && npm run build
